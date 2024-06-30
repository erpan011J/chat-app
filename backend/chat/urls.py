from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('rooms/<str:name>/messages/', RoomViewSet.as_view({'get': 'messages'}), name='room-messages'),
    path('', include(router.urls)),
]
