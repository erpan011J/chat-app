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
            <v-form ref="formRef" @submit.prevent="handleRoomAction">
              <v-text-field v-model="roomName" label="Room Name" required :rules="roomNameRules"></v-text-field>
              <v-text-field v-model="username" label="User Name" required :rules="usernameRules"></v-text-field>
              <div class="btn-container">
                <v-btn @click="handleCreateRoom" color="primary" class="mr-2">Create</v-btn>
                <v-btn @click="handleJoinRoom" color="primary" class="mr-2">Join</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <ErrorSnackbar :message="errorMessage" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createRoom, joinRoom } from '@/services/api';
import ErrorSnackbar from '@/components/ErrorSnackbar.vue';

const roomName = ref('');
const username = ref('');
const router = useRouter();
const errorMessage = ref('');
const formRef = ref('');

const roomNameRules = [
  (v) => !!v || 'Room Name is required.'
];
const usernameRules = [
  (v) => !!v || 'User Name is required.'
];

const handleCreateRoom = async () => {
  await handleRoomAction('create');
};

const handleJoinRoom = async () => {
  await handleRoomAction('join');
};

const handleRoomAction = async (action) => {
  const isValid = await formRef.value.validate();
  if (!isValid.valid) {
    return;
  }

  try {
    const roomId = action === 'create' ? await createRoom(roomName.value, username.value) : await joinRoom(roomName.value, username.value);
    router.push({ name: 'room', params: { id: roomId } });
  } catch (error) {
    errorMessage.value = error.message;
    setTimeout(() => {
        errorMessage.value = '';
    }, 2000)
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
  justify-content: flex-end;
}
</style>
