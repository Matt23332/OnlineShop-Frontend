<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth'

const credentials = ref({ email: '', password: '' })
const showPassword = ref(false)
const auth = useAuthStore();
const error = ref(null);

async function handleLogin() {
  try {
    error.value = null;
    await auth.login(credentials.value);
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.';
  }
}
</script>

<template>
  <v-container fluid fill-height>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="10" class="pa-6 rounded-lg">
          <v-form @submit.prevent="handleLogin">
            <div class="text-center mb-6">
              <h1 class="text-h4 font-weight-bold teal--text text--darken-2">Login to Duka</h1>
            </div>

            <v-text-field v-model="credentials.email" label="Email" prepend-inner-icon="mdi-email" :rules="[(v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'Email must be valid',]" required outlined dense></v-text-field>
            <v-text-field v-model="credentials.password" :type="showPassword ? 'text' : 'password'" label="Password" prepend-inner-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showPassword = !showPassword" :rules="[ (v) => !!v || 'Password is required', (v) => v.length >= 8 || 'Min 8 characters', ]" required outlined dense></v-text-field>
            <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>
            <v-btn block color="primary" dark class="mt-4" large type="submit">Login</v-btn>

            <div class="text-center mt-4">
              <span class="mr-2">Don't have an account?</span>
              <router-link to="/signup" class="teal--text text--darken-2 font-weight-medium">Sign Up</router-link>
            </div>

          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>