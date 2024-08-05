from django.contrib import admin
from django.urls import path, re_path, include
from .views import *

urlpatterns = [
	re_path('login', login.as_view()),
	re_path('signup', signup.as_view()),
	re_path('logout', logout.as_view()),
	re_path('test_token', test_token.as_view()),
	re_path('update_bio', UpdateBio.as_view()),
	re_path('update_profile_picture', UpdateProfilePicture.as_view()),
]