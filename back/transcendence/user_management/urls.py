from django.contrib import admin
from django.urls import path, re_path, include
from .views import login, signup

urlpatterns = [
	re_path('login', login.as_view()),
	re_path('signup', signup.as_view()),
]