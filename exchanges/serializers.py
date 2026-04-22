from rest_framework import serializers
from .models import ExchangeRequest
from books.models import Book


class ExchangeRequestSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    receiver = serializers.StringRelatedField(read_only=True)

    offered_book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='offered_book',
        write_only=True
    )
    requested_book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='requested_book',
        write_only=True
    )

    offered_book = serializers.SerializerMethodField(read_only=True)
    requested_book = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ExchangeRequest
        fields = [
            'id',
            'sender',
            'receiver',
            'offered_book',
            'requested_book',
            'offered_book_id',
            'requested_book_id',
            'message',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'sender', 'receiver', 'status', 'created_at', 'updated_at']

    def get_offered_book(self, obj):
        return {
            'id': obj.offered_book.id,
            'title': obj.offered_book.title,
            'owner': obj.offered_book.owner.username,
        }

    def get_requested_book(self, obj):
        return {
            'id': obj.requested_book.id,
            'title': obj.requested_book.title,
            'owner': obj.requested_book.owner.username,
        }

    def validate(self, attrs):
        request = self.context['request']
        offered_book = attrs['offered_book']
        requested_book = attrs['requested_book']

        if offered_book.owner != request.user:
            raise serializers.ValidationError({
                'offered_book_id': 'لازم الكتاب المعروض يكون مملوك ليك.'
            })

        if requested_book.owner == request.user:
            raise serializers.ValidationError({
                'requested_book_id': 'مينفعش تطلب كتاب مملوك ليك.'
            })

        if not offered_book.is_available:
            raise serializers.ValidationError({
                'offered_book_id': 'الكتاب المعروض غير متاح حالياً.'
            })

        if not requested_book.is_available:
            raise serializers.ValidationError({
                'requested_book_id': 'الكتاب المطلوب غير متاح حالياً.'
            })

        if offered_book == requested_book:
            raise serializers.ValidationError('مينفعش تبدّل نفس الكتاب.')

        return attrs

    def create(self, validated_data):
        request = self.context['request']
        requested_book = validated_data['requested_book']

        validated_data['sender'] = request.user
        validated_data['receiver'] = requested_book.owner

        return super().create(validated_data)