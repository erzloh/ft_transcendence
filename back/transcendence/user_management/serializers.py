from rest_framework import serializers
from .models import CustomUser, PacmanMatch
from django.conf import settings
from django.core.validators import validate_email as validate_email_func
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

class CustomUserSerializer(serializers.ModelSerializer):
	profile_picture_url = serializers.SerializerMethodField()

	class Meta:
		model = CustomUser
		fields = ('id', 'username', 'email', 'password', 'profile_picture', 'profile_picture_url', 'online_status')	
		extra_kwargs = {'password': {'write_only': True}}

	def get_profile_picture_url(self, obj):
		if obj.profile_picture:
			return settings.HOST_NAME + obj.profile_picture.url
		else:
			return None

	def to_internal_value(self, data):
		if 'email' in data and not data['email']:
			raise serializers.ValidationError({'email': ['e-mail-empty-error']})
		if 'username' in data and not data['username']:
			raise serializers.ValidationError({'username': ['username-empty-error']})
		if 'password' in data and not data['password']:
			raise serializers.ValidationError({'password': ['password-empty-error']})
		return super().to_internal_value(data)
		
	def create(self, validated_data):
		return CustomUser.objects.create_user(**validated_data)

	def update(self, instance, validated_data):
		instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
		if 'email' in validated_data:
			email = CustomUser.objects.normalize_email(validated_data['email'])
			try:
				validate_email_func(email)
			except ValidationError:
				raise serializers.ValidationError({'email': ['Saississez une adresse e-mail valide.']})
			if CustomUser.objects.filter(email=email).exclude(id=instance.id).exists():
				raise serializers.ValidationError({'email': ['email-exists-error']})
			instance.email = email
		if 'username' in validated_data:
			username = validated_data['username']
			if CustomUser.objects.filter(username=username).exclude(id=instance.id).exists():
				raise serializers.ValidationError({'username': ['username-exists-error']})
			instance.username = username
		if 'password' in validated_data:
			password = validated_data['password']
			validate_password(password, user=instance)
			instance.set_password(password)
		instance.save()
		return instance

class PacmanMatchSerializer(serializers.ModelSerializer):
	pacman_player = serializers.SlugRelatedField(slug_field='id', queryset=CustomUser.objects.all())
	ghost_player = serializers.SlugRelatedField(slug_field='id', queryset=CustomUser.objects.all())

	class Meta:
		model = PacmanMatch
		fields = ['pacman_player', 'ghost_player', 'map_name', 'match_duration', 'winner', 'pacman_score']

class UserPacmanStatsSerializer(serializers.ModelSerializer):
	total_pacman_matches = serializers.IntegerField()
	total_pacman_wins = serializers.IntegerField()
	total_pacman_as_pacman_matches = serializers.IntegerField()
	total_pacman_as_pacman_wins = serializers.IntegerField()
	total_pacman_as_ghost_matches = serializers.IntegerField()
	total_pacman_as_ghost_wins = serializers.IntegerField()

	class Meta:
		model = CustomUser
		fields = ('total_pacman_matches', 'total_pacman_wins', 'total_pacman_as_pacman_matches', 'total_pacman_as_pacman_wins', 'total_pacman_as_ghost_matches', 'total_pacman_as_ghost_wins')