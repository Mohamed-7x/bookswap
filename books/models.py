from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL


class Genre(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('worn', 'Worn'),
    ]

    EXCHANGE_TYPE_CHOICES = [
        ('exchange', 'Exchange'),
        ('donate', 'Donate'),
        ('both', 'Both'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=20, blank=True)

    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True)

    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='books/', null=True, blank=True)

    exchange_type = models.CharField(max_length=20, choices=EXCHANGE_TYPE_CHOICES)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title