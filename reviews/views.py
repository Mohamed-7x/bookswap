from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .models import Review
from .serializers import ReviewSerializer
from .services import recalculate_user_rating

User = get_user_model()

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        review = serializer.save()
        recalculate_user_rating(review.reviewed_user)

class UserReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        return Review.objects.filter(reviewed_user__username=username).order_by('-created_at')
