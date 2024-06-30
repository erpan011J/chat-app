<template>
  <v-container fluid>
    <v-card class="chat-room-card">
      <v-card-title>
        <h2>Chat Room: {{ roomName }}</h2>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="message-container">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <div class="message-list">
                <div v-for="message in messages" :key="message.id" class="message">
                  <p :class="{ 'user-message': message.author === username, 'other-message': message.author !== username }">
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMessages } from '@/services/api';

const route = useRoute();
const roomName = ref(localStorage.getItem('roomName'));
const username = ref(localStorage.getItem('username'));
const messages = ref([]);
const newMessage = ref('');

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsHost = window.location.hostname;
const wsPort = '8000';
const wsPath = `${wsProtocol}//${wsHost}:${wsPort}/ws/chat/${roomName.value}/`;
const websocket = new WebSocket(wsPath);
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


const handleFetchMessages = () => {
  fetchMessages(roomName.value)
    .then(data => {
      messages.value = data;
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
};

const handleSendMessage = () => {
  if (newMessage.value.trim() === '') {
    return; // Don't send empty messages
  }

  const message = {
    content: newMessage.value,
    author: username.value,
  };

  // Send message data as JSON over WebSocket
  websocket.send(JSON.stringify(message));

  // Clear the message input field
  newMessage.value = '';
};

onMounted(() => {
  handleFetchMessages();
  // Nothing needed here if no specific action on mount
});
</script>

<style scoped>
.message-container {
  height: 50vh; /* Adjust height as needed */
  overflow-y: auto; /* Enable vertical scrolling */
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
  /* Light blue background for user's messages */
  border-radius: 15px;
  padding: 10px;
  max-width: 70%;
  align-self: flex-end;
}

.other-message {
  background-color: #f0f0f0;
  /* Light grey background for other users' messages */
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
