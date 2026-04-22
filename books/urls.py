from django.urls import path
from .views import (
    BookListCreateView,
    BookDetailView,
    MyBooksView,
    GenreListView,
)

urlpatterns = [
    path('', BookListCreateView.as_view()),
    path('mine/', MyBooksView.as_view()),
    path('genres/', GenreListView.as_view()),
    path('<int:pk>/', BookDetailView.as_view()),
]