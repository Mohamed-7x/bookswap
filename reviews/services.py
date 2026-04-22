from django.db.models import Avg
from django.contrib.auth import get_user_model

User = get_user_model()

def recalculate_user_rating(user):
    """
    Recalculates the user's rating based on all reviews received.
    Updates the User's rating field and saves the user.
    """
    reviews_received = user.reviews_received.all()
    if not reviews_received.exists():
        user.rating = 0.00
    else:
        avg_rating = reviews_received.aggregate(average_rating=Avg('rating'))['average_rating']
        user.rating = round(avg_rating, 2)
    user.save(update_fields=['rating'])
