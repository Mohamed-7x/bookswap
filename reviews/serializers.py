from rest_framework import serializers
from .models import Review
from exchanges.models import ExchangeRequest

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source='reviewer.username')
    reviewed_user = serializers.ReadOnlyField(source='reviewed_user.username')

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'reviewed_user', 'exchange', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'reviewer', 'reviewed_user', 'created_at']

    def validate(self, attrs):
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError("User must be authenticated.")
        
        user = request.user
        exchange = attrs.get('exchange')

        # Check if exchange is completed
        if exchange.status != 'completed':
            raise serializers.ValidationError({"exchange": "You can only review completed exchanges."})

        # Check if user is participant
        if user != exchange.sender and user != exchange.receiver:
            raise serializers.ValidationError({"exchange": "You are not a participant in this exchange."})

        # Check for duplicate review
        if Review.objects.filter(reviewer=user, exchange=exchange).exists():
            raise serializers.ValidationError("You have already reviewed this exchange.")

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        exchange = validated_data['exchange']

        # Determine reviewed_user
        reviewed_user = exchange.receiver if user == exchange.sender else exchange.sender

        validated_data['reviewer'] = user
        validated_data['reviewed_user'] = reviewed_user

        return super().create(validated_data)
