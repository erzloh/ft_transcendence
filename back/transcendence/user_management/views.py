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
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from django.http import FileResponse

class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('No jwt cookie found')
        return super().authenticate_credentials(token)

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
        return Response({'error': ['invalid-credentials-error']}, status=status.HTTP_400_BAD_REQUEST)

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

class profile(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)

class logout(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class UpdateUser(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
            except ValidationError as e:
                return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserAvatar(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        if user.profile_picture:
            return FileResponse(open(user.profile_picture.path, 'rb'), content_type='image/jpeg')
        else:
            return Response({"error": "No profile photo found"}, status=status.HTTP_404_NOT_FOUND)


class AddFriend(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        friend_username = request.data.get('username')
        if friend_username == request.user.username:
            return Response({"error": "You cannot add yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)
        friend = get_object_or_404(CustomUser, username=friend_username)
        if friend in request.user.friends.all():
            return Response({"error": "This user is already your friend"}, status=status.HTTP_400_BAD_REQUEST)
        request.user.friends.add(friend)
        return Response(status=status.HTTP_200_OK)

class RemoveFriend(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        friend_username = request.data.get('username')
        if friend_username == request.user.username:
            return Response({"error": "You cannot remove yourself from friends"}, status=status.HTTP_400_BAD_REQUEST)
        friend = get_object_or_404(CustomUser, username=friend_username)
        if friend not in request.user.friends.all():
            return Response({"error": "This user is not your friend"}, status=status.HTTP_400_BAD_REQUEST)
        request.user.friends.remove(friend)
        return Response(status=status.HTTP_200_OK)

class FriendsList(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        friends = request.user.friends.all()
        friends_usernames = [friend.username for friend in friends]
        return Response({"friends": friends_usernames}, status=status.HTTP_200_OK)

class UsersList(views.APIView):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = CustomUser.objects.all()
        users_usernames = [user.username for user in users]
        return Response({"users": users_usernames}, status=status.HTTP_200_OK)