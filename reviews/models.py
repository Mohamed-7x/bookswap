from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from exchanges.models import ExchangeRequest

User = settings.AUTH_USER_MODEL

class Review(models.Model):
    reviewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews_given'
    )
    reviewed_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews_received'
    )
    exchange = models.ForeignKey(
        ExchangeRequest,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['reviewer', 'exchange'],
                name='unique_review_per_exchange_per_user'
            )
        ]

    def __str__(self):
        return f"Review by {self.reviewer} for {self.reviewed_user} - Rating: {self.rating}"
