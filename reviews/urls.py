from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReviewListCreateView.as_view(), name='review-list-create'),
    path('user/<str:username>/', views.UserReviewListView.as_view(), name='user-review-list'),
]
