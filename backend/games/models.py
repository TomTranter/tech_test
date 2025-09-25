from django.db import models

class Game(models.Model):
    id = models.AutoField(primary_key=True)
    board_size = models.IntegerField()
    winner = models.CharField(max_length=1, choices=[('X', 'X'), ('O', 'O')], null=True, blank=True)
    is_tie = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# Move model (for detailed tracking)
class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='moves')
    player = models.CharField(max_length=1, choices=[('X', 'X'), ('O', 'O')])
    row = models.IntegerField()
    column = models.IntegerField()
    move_number = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
