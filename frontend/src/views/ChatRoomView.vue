<template>
  <v-container fluid>
    <v-card class="chat-room-card">
      <v-card-title>
        <h2>Chat Room: {{ chatStore.roomName }}</h2>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="message-container">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <div class="message-list">
                <div v-for="message in messages" :key="message.id" class="message">
                  <p
                    :class="{ 'user-message': message.author === chatStore.userName, 'other-message': message.author !== chatStore.userName }">
                    <strong>{{ message.author }}:</strong> {{ message.content }}
                  </p>
                  <small>{{ new Date(message.timestamp).toLocaleString() }}</small>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="message-input">
        <v-form @submit.prevent="handleSendMessage" class="message-form">
          <v-text-field v-model="newMessage" label="Type a message" auto-grow rows="1"></v-text-field>
          <v-btn type="submit" class="ma-2" color="grey darken-2" icon="mdi-send" style="padding-left: 30px;"></v-btn>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-container>
  <ErrorSnackbar :message="errorMessage" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { fetchMessages } from '@/services/api';
import ErrorSnackbar from '@/components/ErrorSnackbar.vue';

const chatStore = useChatStore();
const messages = ref([]);
const newMessage = ref('');
const errorMessage = ref('');

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsHost = window.location.hostname;
const wsPort = '8000';

let websocket = null;

const setupWebSocket = () => {
  const wsPath = `${wsProtocol}//${wsHost}:${wsPort}/ws/chat/${chatStore.roomName}/`;
  websocket = new WebSocket(wsPath);

  websocket.onopen = () => {
    console.log('WebSocket connected');
  };

  websocket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    messages.value.push(message);
  };

  websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  websocket.onclose = () => {
    console.log('WebSocket closed');
  };
};

const handleFetchMessages = async () => {
    try {
        const data = await fetchMessages(chatStore.roomName);
        messages.value = data;
    } catch (error) {
        errorMessage.value = error.message;
        setTimeout(() => {
            errorMessage.value = '';
        }, 2000);
    }
};

const handleSendMessage = () => {
  if (newMessage.value.trim() === '') {
    return;
  }

  const message = {
    content: newMessage.value,
    author: chatStore.userName,
  };

  websocket.send(JSON.stringify(message));
  newMessage.value = '';
};

onMounted(() => {
  if (!chatStore.userName) {
    chatStore.setUserName(localStorage.getItem('username') || '');
  }

  if (!chatStore.roomName) {
    chatStore.setRoomName(localStorage.getItem('roomName') || '');
  }
  setupWebSocket();
  handleFetchMessages();
});
</script>

<style scoped>
.message-container {
  height: 50vh;
  overflow-y: auto;
}

.chat-room-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.message {
  margin-bottom: 10px;
}

.user-message {
  background-color: #dff9fb;
  border-radius: 15px;
  padding: 10px;
  max-width: 70%;
  align-self: flex-end;
}

.other-message {
  background-color: #f0f0f0;
  border-radius: 15px;
  padding: 10px;
  max-width: 70%;
}

.message-input {
  display: flex;
  align-items: center;
}

.message-form {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  height: 100%;
}

.v-form {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
