from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(self, username, email, password=None, **extra_fields):
		if not email:
			raise ValueError('e-mail-empty-error')
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
			'unique': "username-exists-error",
		}
	)
	email = models.EmailField(
		unique=True,
		error_messages={
			'unique': "email-exists-error",
		}
	)
	bio = models.TextField(blank=True, null=True)
	profile_picture = models.ImageField(upload_to='profile_pictures/', default='default.jpg')
	objects = CustomUserManager()

	def __str__(self):
		return self.username