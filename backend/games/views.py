from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Count, Q
from .models import Game, Move
from .serializers import GameSerializer, MoveSerializer

class GameCreateView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class GameUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    lookup_field = 'id'

class MoveCreateView(generics.CreateAPIView):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer

class HealthView(APIView):
    def get(self, request):
        return Response({
            'status': 'healthy',
            'message': 'Server is running'
        })

class StatsView(APIView):
    def get(self, request):
        # Only count completed games (games with a winner or tie)
        completed_games = Game.objects.filter(
            Q(winner__isnull=False) | Q(is_tie=True)
        )
        
        total_games = completed_games.count()
        x_wins = completed_games.filter(winner='X').count()
        o_wins = completed_games.filter(winner='O').count()
        ties = completed_games.filter(is_tie=True).count()
        
        return Response({
            'total_games': total_games,
            'x_wins': x_wins,
            'o_wins': o_wins,
            'ties': ties
        })
