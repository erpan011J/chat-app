<template>
    <v-snackbar v-model="snackbar.show" variant="tonal" timeout="2000" color="error" location="top" class="centered-snackbar">
        <v-icon left>mdi-alert-circle-outline</v-icon>
        <span>{{ snackbar.message }}</span>
    </v-snackbar>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    message: {
        type: String,
        default: ''
    }
});

const snackbar = ref({
    show: false,
});

watch(() => props.message, (newValue) => {
    if (newValue) {
        snackbar.value.show = true;
        snackbar.value.message = newValue;
    }
});

onMounted(() => {
    snackbar.value.show = false;
});
</script>

<style scoped>
::v-deep .v-snackbar__content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    font-size:15px;

}

::v-deep .v-icon {
    margin-right: 8px;
}
</style>
