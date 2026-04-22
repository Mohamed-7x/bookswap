from django.db import models
from django.conf import settings
from books.models import Book

# Create your models here.

User = settings.AUTH_USER_MODEL


class ExchangeRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_exchanges'
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_exchanges'
    )
    offered_book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='offered_exchange_requests'
    )
    requested_book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='requested_exchange_requests'
    )
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.sender} -> {self.receiver} ({self.status})'