from rest_framework import serializers
from .models import CustomUser
from django.conf import settings
from django.core.validators import validate_email as validate_email_func
from django.core.exceptions import ValidationError

class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('id', 'username', 'email', 'password', 'bio', 'profile_picture')	
		extra_kwargs = {'password': {'write_only': True}}

	def to_internal_value(self, data):
		if 'email' in data and not data['email']:
			raise serializers.ValidationError({'email': 'e-mail-empty-error'})
		if 'username' in data and not data['username']:
			raise serializers.ValidationError({'username': 'username-empty-error'})
		if 'password' in data and not data['password']:
			raise serializers.ValidationError({'password': 'password-empty-error'})
		return super().to_internal_value(data)
		
	def create(self, validated_data):
		return CustomUser.objects.create_user(**validated_data)