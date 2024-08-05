from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(self, username, email, password=None, **extra_fields):
		if not email:
			raise ValueError('The email field must be set')
		email = self.normalize_email(email)
		user = self.model(username=username.strip(), email=email, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

class CustomUser(AbstractUser):
	username = models.CharField(
		max_length=15,
		unique=True,
		validators=[],
		error_messages={
			'unique': "A user with that username already exists.",
		}
	)
	email = models.EmailField(unique=True)
	bio = models.TextField(blank=True, null=True)
	profile_picture = models.ImageField(upload_to='profile_pictures/', default='default.jpg')
	objects = CustomUserManager()

	def __str__(self):
		return self.username