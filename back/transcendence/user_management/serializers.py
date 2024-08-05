from rest_framework import serializers
from .models import CustomUser
from django.conf import settings

class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('id', 'username', 'email', 'password', 'bio', 'profile_picture')	
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		return CustomUser.objects.create_user(**validated_data)