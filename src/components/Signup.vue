<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import {useAuth} from '../services/auth'

const router = useRouter();
const { register, loading, error } = useAuth()
  const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
    passwordMatch: () => password === confirmPassword || 'Passwords must match'
  }

  const password = ref(null) 
  const confirmPassword= ref(null)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  //models
  const fullName =ref(null)
  const email =ref(null)
  const phone =ref(null)
  const deliveryAddress =ref(null)

  const signUp = async () => {

    loading.value = true;
    error.value = "";

    const formData = new FormData();
    formData.append("name", fullName.value,);
    formData.append("email", email.value);
    formData.append("phone", phone.value);
    formData.append("delivery_address", deliveryAddress.value);
    formData.append("password", password.value);
    formData.append("role_id", 2);

    try {
        await register(formData)
    
        // Redirect after successful signup
        router.push('/login').then(() => {
            router.go(0); // Reloads the current route
        });
    } catch (err) {
        // Error is already handled by the auth service
        console.error('Sign up failed', err)
    }
};

</script>
<template>
    <v-container fluid fill-height>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="10" class="pa-6 rounded-lg">
          <v-form @submit.prevent="signUp" ref="form">
            <div class="text-center mb-6">
              <h1 class="text-h4 font-weight-bold teal--text text--darken-2"> Join The Duka </h1>
            </div>
            <v-text-field v-model="fullName" label="Full Name" prepend-inner-icon="mdi-account" :rules="[(v) => !!v || 'Name is required']" required outlined dense ></v-text-field>
            <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email" :rules="[ (v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'Email must be valid', ]" required outlined dense ></v-text-field>
            <v-text-field v-model="phone" label="Phone Number" prepend-inner-icon="mdi-phone" :rules="[(v) => !!v || 'Phone is required']" required outlined dense ></v-text-field>
            <v-text-field v-model="deliveryAddress" label="Delivery Address" prepend-inner-icon="mdi-home-map-marker" :rules="[(v) => !!v || 'Address is required']" required outlined dense ></v-text-field>
            <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :rules="[ (v) => !!v || 'Password is required', (v) => v.length >= 8 || 'Password must be at least 8 characters', ]" required outlined dense ></v-text-field>
            <v-text-field v-model="confirmPassword" label="Confirm Password" prepend-inner-icon="mdi-lock-check" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showConfirmPassword ? 'text' : 'password'" @click:append="showConfirmPassword = !showConfirmPassword" :rules="[ (v) => !!v || 'Please confirm your password', (v) => v === password || 'Passwords must match', ]" required outlined dense ></v-text-field>
            <v-btn block color="primary" dark class="mt-4" large type="submit"> Sign Up </v-btn>

            <div class="text-center mt-6">
              <p>
                Already have an account?
                <router-link to="/login" class="teal--text text--darken-2 font-weight-medium" >Log In</router-link >
              </p>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>