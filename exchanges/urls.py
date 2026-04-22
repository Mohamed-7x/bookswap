from django.urls import path
from .views import (
    ExchangeListCreateView,
    ExchangeDetailView,
    AcceptExchangeView,
    RejectExchangeView,
    CancelExchangeView,
    CompleteExchangeView,
)

urlpatterns = [
    path('', ExchangeListCreateView.as_view()),
    path('<int:pk>/', ExchangeDetailView.as_view()),
    path('<int:pk>/accept/', AcceptExchangeView.as_view()),
    path('<int:pk>/reject/', RejectExchangeView.as_view()),
    path('<int:pk>/cancel/', CancelExchangeView.as_view()),
    path('<int:pk>/complete/', CompleteExchangeView.as_view()),
]