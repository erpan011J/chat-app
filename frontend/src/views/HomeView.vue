<template>
  <v-container>
    <div class="text-center mb-6 mt-2" style="font-size: 30px;">
      <h2>Simple Chat App</h2>
    </div>
    <v-row class="d-flex justify-center align-center" style="height: 70vh;">
      <v-col cols="12" md="6">
        <v-card class="mx-auto" elevation="16">
          <v-card-title>Create or Join Room</v-card-title>
          <v-card-text class="card-content">
            <v-form @submit.prevent="handleRoomAction">
              <v-text-field v-model="roomName" label="Room Name" required></v-text-field>
              <v-text-field v-model="username" label="User Name" required></v-text-field>
              <div class="btn-container">
                <v-btn @click="handleRoomAction('create')" color="primary" class="mr-2">Create</v-btn>
                <v-btn @click="handleRoomAction('join')" color="primary" class="mr-2">Join</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createRoom, joinRoom } from '@/services/api';

const roomName = ref('');
const username = ref('');
const router = useRouter();

const handleRoomAction = async (action) => {
  try {
    if (action === 'create') {
      const roomId = await createRoom(roomName.value, username.value);
      console.log('Room created. Redirecting to room:', roomId);
      // Save room name and username to local storage
      localStorage.setItem('roomName', roomName.value);
      localStorage.setItem('username', username.value);
      router.push({ name: 'room', params: { id: roomId } });
    } else if (action === 'join') {
      const roomId = await joinRoom(roomName.value);
      console.log('Joined room. Redirecting to room:', roomId);
      // Save room name and username to local storage
      localStorage.setItem('roomName', roomName.value);
      localStorage.setItem('username', username.value);
      router.push({ name: 'room', params: { id: roomId } });
    }
  } catch (error) {
    console.error(`Error ${action}ing room:`, error.message);
    // Handle error (e.g., show an error message to the user)
  }
};

</script>

<style scoped>
.card-content {
  padding: 24px;
  text-align: center;
}

.v-card {
  width: 100%;
  min-height: 400px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
}

.v-form {
  padding: 20px;
}

.v-card-title {
  text-align: center;
  margin: 20px;
}

.btn-container {
  display: flex;
  justify-content:flex-end;
}
</style>
