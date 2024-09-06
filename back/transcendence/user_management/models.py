from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.password_validation import validate_password

class CustomUserManager(BaseUserManager):
	def create_user(self, username, email, password=None, **extra_fields):
		email = self.normalize_email(email)
		user = self.model(username=username.strip(), email=email, **extra_fields)
		validate_password(password, user)
		user.set_password(password)
		user.save(using=self._db)
		return user

class CustomUser(AbstractUser):
	username = models.CharField(
		max_length=15,
		unique=True,
		validators=[],
		error_messages={
			'unique': "username-exists-error",
		}
	)
	email = models.EmailField(
		unique=True,
		error_messages={
			'unique': "email-exists-error",
		}
	)
	profile_picture = models.ImageField(upload_to='profile_pictures/', default='profile_pictures/default.jpg')
	friends = models.ManyToManyField('self', blank=True)
	online_status = models.BooleanField(default=False)
	max_endless_score = models.IntegerField(default=0)
	objects = CustomUserManager()

	total_pong_matches = models.IntegerField(default=0)
	total_pong_wins = models.IntegerField(default=0)
	total_pong_ai_matches = models.IntegerField(default=0)
	total_pong_ai_wins = models.IntegerField(default=0)
	total_pong_pvp_matches = models.IntegerField(default=0)
	total_pong_pvp_wins = models.IntegerField(default=0)
	total_tournament_played = models.IntegerField(default=0)
	total_tournament_wins = models.IntegerField(default=0)

	def __str__(self):
		return self.username
	
	def total_pacman_matches(self):
		return self.pacman_matches_as_pacman.count() + self.pacman_matches_as_ghost.count()

	def total_pacman_wins(self):
		return self.pacman_matches_won.count()

	def total_pacman_as_pacman_matches(self):
		return self.pacman_matches_as_pacman.count()

	def total_pacman_as_pacman_wins(self):
		return self.pacman_matches_won.filter(pacman_player=self).count()

	def total_pacman_as_ghost_matches(self):
		return self.pacman_matches_as_ghost.count()

	def total_pacman_as_ghost_wins(self):
		return self.pacman_matches_won.filter(ghost_player=self).count()


class PacmanMatch(models.Model):
	pacman_player = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='pacman_matches_as_pacman')
	ghost_player = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='pacman_matches_as_ghost')
	map_name = models.CharField(max_length=255)
	match_duration = models.DurationField()
	winner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='pacman_matches_won')
	pacman_score = models.IntegerField()

	def __str__(self):
		return f"Pacman: {self.pacman_player.username}, Ghost: {self.ghost_player.username}, Winner: {self.winner.username}"


class AIPongMatch(models.Model):
	player_one = models.CharField(max_length=255)
	winner = models.CharField(max_length=255)
	match_score = models.CharField(max_length=255)
	match_duration = models.DurationField()
	match_date = models.DateTimeField(auto_now_add=True)

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)
		try:
			user = CustomUser.objects.get(username=self.player_one)
			user.total_pong_matches += 1
			user.total_pong_ai_matches += 1
			if self.winner == self.player_one:
				user.total_pong_wins += 1
				user.total_pong_ai_wins += 1
			user.save()
		except CustomUser.DoesNotExist:
			pass

	def __str__(self):
		return f"{self.player_one} ({'won' if self.winner == self.player_one else 'lost'})"

class PvPongMatch(models.Model):
	player_one = models.CharField(max_length=255)
	player_two = models.CharField(max_length=255)
	winner = models.CharField(max_length=255)
	match_score = models.CharField(max_length=255)
	match_duration = models.DurationField()
	match_date = models.DateTimeField(auto_now_add=True)

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)
		try:
			user_one = CustomUser.objects.get(username=self.player_one)
			user_one.total_pong_matches += 1
			user_one.total_pong_pvp_matches += 1
			if self.winner == self.player_one:
				user_one.total_pong_wins += 1
				user_one.total_pong_pvp_wins += 1
			user_one.save()
		except CustomUser.DoesNotExist:
			pass
		try:
			user_two = CustomUser.objects.get(username=self.player_two)
			user_two.total_pong_matches += 1
			user_two.total_pong_pvp_matches += 1
			if self.winner == self.player_two:
				user_two.total_pong_wins += 1
				user_two.total_pong_pvp_wins += 1
			user_two.save()
		except CustomUser.DoesNotExist:
			pass

	def __str__(self):
		return f"{self.player_one} vs {self.player_two} - Winner: {self.winner}"


class PongTournament(models.Model):
	name = models.CharField(max_length=255)
	matches = models.ManyToManyField(PvPongMatch)
	ranking = models.TextField()

	def __str__(self):
		return self.name