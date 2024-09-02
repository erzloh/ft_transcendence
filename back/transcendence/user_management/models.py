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
	objects = CustomUserManager()

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