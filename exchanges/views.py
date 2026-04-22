from django.db import transaction
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ExchangeRequest
from .serializers import ExchangeRequestSerializer


class ExchangeListCreateView(generics.ListCreateAPIView):
    serializer_class = ExchangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        direction = self.request.query_params.get('direction')

        if direction == 'sent':
            return ExchangeRequest.objects.filter(
                sender=self.request.user
            ).order_by('-created_at')

        elif direction == 'received':
            return ExchangeRequest.objects.filter(
                receiver=self.request.user
            ).order_by('-created_at')

        return ExchangeRequest.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save()


class ExchangeDetailView(generics.RetrieveAPIView):
    serializer_class = ExchangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExchangeRequest.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )


class AcceptExchangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        exchange = ExchangeRequest.objects.select_for_update().get(pk=pk)

        if exchange.receiver != request.user:
            return Response({'detail': 'غير مسموح.'}, status=status.HTTP_403_FORBIDDEN)

        if exchange.status != 'pending':
            return Response({'detail': 'الطلب مش pending.'}, status=status.HTTP_400_BAD_REQUEST)

        if not exchange.offered_book.is_available or not exchange.requested_book.is_available:
            return Response({'detail': 'واحد أو أكثر من الكتب غير متاح.'}, status=status.HTTP_400_BAD_REQUEST)

        exchange.status = 'accepted'
        exchange.save()

        exchange.offered_book.is_available = False
        exchange.requested_book.is_available = False
        exchange.offered_book.save()
        exchange.requested_book.save()

        return Response(ExchangeRequestSerializer(exchange).data, status=status.HTTP_200_OK)


class RejectExchangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        exchange = ExchangeRequest.objects.get(pk=pk)

        if exchange.receiver != request.user:
            return Response({'detail': 'غير مسموح.'}, status=status.HTTP_403_FORBIDDEN)

        if exchange.status != 'pending':
            return Response({'detail': 'الطلب مش pending.'}, status=status.HTTP_400_BAD_REQUEST)

        exchange.status = 'rejected'
        exchange.save()

        return Response(ExchangeRequestSerializer(exchange).data, status=status.HTTP_200_OK)


class CancelExchangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        exchange = ExchangeRequest.objects.get(pk=pk)

        if exchange.sender != request.user:
            return Response({'detail': 'غير مسموح.'}, status=status.HTTP_403_FORBIDDEN)

        if exchange.status != 'pending':
            return Response({'detail': 'تقدر تلغي الطلب بس وهو pending.'}, status=status.HTTP_400_BAD_REQUEST)

        exchange.status = 'cancelled'
        exchange.save()

        return Response(ExchangeRequestSerializer(exchange).data, status=status.HTTP_200_OK)


class CompleteExchangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        exchange = ExchangeRequest.objects.select_for_update().get(pk=pk)

        if request.user not in [exchange.sender, exchange.receiver]:
            return Response({'detail': 'غير مسموح.'}, status=status.HTTP_403_FORBIDDEN)

        if exchange.status != 'accepted':
            return Response({'detail': 'لازم الطلب يكون accepted الأول.'}, status=status.HTTP_400_BAD_REQUEST)

        exchange.status = 'completed'
        exchange.save()

        sender = exchange.sender
        receiver = exchange.receiver

        sender.total_exchanges += 1
        receiver.total_exchanges += 1

        sender.save()
        receiver.save()

        return Response(ExchangeRequestSerializer(exchange).data, status=status.HTTP_200_OK)