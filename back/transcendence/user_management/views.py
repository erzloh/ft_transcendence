from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from .models import CustomUser
from rest_framework import status
from rest_framework import serializers
from rest_framework import views
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class login(views.APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            serializer = CustomUserSerializer(instance=user)
            return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid login credentials'}, status=status.HTTP_400_BAD_REQUEST)

class signup(views.APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = CustomUser.objects.get(username=serializer.data['username'])
            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
class test_token(views.APIView):
    def get(self, request):
        return Response({"message": "You are authenticated"}, status=status.HTTP_200_OK)