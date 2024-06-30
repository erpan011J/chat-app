from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = 'name'
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        room_name = request.query_params.get('name', None)
        if room_name is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        room = Room.objects.get(name__iexact=room_name)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None, name=None):
        room = self.get_object()
        messages = room.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)



class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
