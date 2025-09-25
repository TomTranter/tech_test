from django.urls import path
from .views import GameCreateView, GameUpdateView, MoveCreateView, StatsView, HealthView

urlpatterns = [
    path('games/', GameCreateView.as_view(), name='game-create'),
    path('games/<int:id>/', GameUpdateView.as_view(), name='game-update'),
    path('moves/', MoveCreateView.as_view(), name='move-create'),
    path('stats/', StatsView.as_view(), name='stats'),
    path('health/', HealthView.as_view(), name='health'),
]
