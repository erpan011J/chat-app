from asgiref.sync import sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.apps import apps

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        content = text_data_json['content']
        author = text_data_json['author']

        Room = apps.get_model('chat', 'Room')
        Message = apps.get_model('chat', 'Message')

        room, _ = await sync_to_async(Room.objects.get_or_create)(name=self.room_name)
        message_instance = await sync_to_async(Message.objects.create)(room=room, author=author, content=content)

        message = {
            'id': message_instance.id,
            'author': author,
            'content': content,
            'timestamp': message_instance.timestamp.isoformat(),
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps(message))
