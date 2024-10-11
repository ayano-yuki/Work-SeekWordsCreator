from django.urls import path
from . import views

app_name = '<アプリ名>'
urlpatterns = [
    path(r'', views.index, name='index'),
]
