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
from django.core.exceptions import ValidationError

class login(views.APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            serializer = CustomUserSerializer(instance=user)
            response = Response(status=status.HTTP_200_OK)
            response.set_cookie(key='jwt', value=token.key, httponly=True, secure=True)
            return response
        return Response({'error': ' invalid-credentials-error'}, status=status.HTTP_400_BAD_REQUEST)

class signup(views.APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
            except ValidationError as e:
                return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)
            user = CustomUser.objects.get(username=serializer.data['username'])
            token = Token.objects.create(user=user)
            response = Response(status=status.HTTP_200_OK)
            response.set_cookie(key='jwt', value=token.key, httponly=True, secure=True)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class test_token(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)

class logout(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class UpdateBio(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateProfilePicture(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)