<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore();
authStore.init();

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUser()
  }
})
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>