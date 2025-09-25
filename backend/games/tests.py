from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Game, Move


class GameModelTest(TestCase):
    """Test Game model creation and validation"""
    
    def test_create_game(self):
        """Test creating a basic game"""
        game = Game.objects.create(board_size=3)
        self.assertEqual(game.board_size, 3)
        self.assertIsNone(game.winner)
        self.assertFalse(game.is_tie)
        self.assertIsNotNone(game.created_at)
    
    
    def test_game_with_winner(self):
        """Test game with winner"""
        game = Game.objects.create(board_size=3, winner='X')
        self.assertEqual(game.winner, 'X')
        self.assertFalse(game.is_tie)
    
    def test_game_with_tie(self):
        """Test game that ends in tie"""
        game = Game.objects.create(board_size=3, is_tie=True)
        self.assertIsNone(game.winner)
        self.assertTrue(game.is_tie)


class MoveModelTest(TestCase):
    """Test Move model creation and relationships"""
    
    def setUp(self):
        """Set up test data"""
        self.game = Game.objects.create(board_size=3)
    
    def test_create_move(self):
        """Test creating a move"""
        move = Move.objects.create(
            game=self.game,
            player='X',
            row=0,
            column=1,
            move_number=1
        )
        self.assertEqual(move.game, self.game)
        self.assertEqual(move.player, 'X')
        self.assertEqual(move.row, 0)
        self.assertEqual(move.column, 1)
        self.assertEqual(move.move_number, 1)
        self.assertIsNotNone(move.timestamp)
    
    
    def test_move_game_relationship(self):
        """Test that move is properly linked to game"""
        move = Move.objects.create(
            game=self.game,
            player='X',
            row=1,
            column=1,
            move_number=1
        )
        self.assertEqual(move.game.id, self.game.id)
        # Test that we can query moves for this game
        game_moves = Move.objects.filter(game=self.game)
        self.assertIn(move, game_moves)


class StatsAPITest(APITestCase):
    """Test the stats API endpoint"""
    
    def setUp(self):
        """Set up test data"""
        # Create completed games
        self.game1 = Game.objects.create(board_size=3, winner='X')
        self.game2 = Game.objects.create(board_size=3, winner='O')
        self.game3 = Game.objects.create(board_size=3, is_tie=True)
        
        # Create incomplete game (should not be counted)
        self.incomplete_game = Game.objects.create(board_size=3)
    
    def test_stats_endpoint(self):
        """Test stats API returns correct data"""
        url = reverse('stats')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        
        # Should only count completed games
        self.assertEqual(data['total_games'], 3)
        self.assertEqual(data['x_wins'], 1)
        self.assertEqual(data['o_wins'], 1)
        self.assertEqual(data['ties'], 1)
    
    def test_stats_excludes_incomplete_games(self):
        """Test that incomplete games are not counted in stats"""
        url = reverse('stats')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        
        # Should not count the incomplete game
        self.assertEqual(data['total_games'], 3)
        
        # Add another incomplete game
        Game.objects.create(board_size=5)
        
        response = self.client.get(url)
        data = response.data
        
        # Still should be 3, not 4
        self.assertEqual(data['total_games'], 3)
    
    def test_stats_empty_database(self):
        """Test stats with no completed games"""
        # Clear all games
        Game.objects.all().delete()
        
        url = reverse('stats')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        
        self.assertEqual(data['total_games'], 0)
        self.assertEqual(data['x_wins'], 0)
        self.assertEqual(data['o_wins'], 0)
        self.assertEqual(data['ties'], 0)
