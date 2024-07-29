from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def login(resquest):
    return Response({})

@api_view(['POST'])
def signup(resquest):
    return Response({})

@api_view(['GET'])
def test_token(resquest):
    return Response({})