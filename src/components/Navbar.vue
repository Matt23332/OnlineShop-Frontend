<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const scrolled = ref(false);

const handleScroll = () => {
    scrolled.value = window.scrollY > 0;
}
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
    <v-app-bar :elevation="scrolled ? 4 : 0" color="#111">
        <template v-if="auth.isLoggedIn">
            <v-btn to="/" router>Home</v-btn>
            <v-btn to="/products" router>Products</v-btn>
            <v-btn to="/orders" router>Orders</v-btn>

            <v-btn v-if="auth.user?.role?.name === 'admin'" to="/admin" router>Admin</v-btn>

            <v-btn icon="mdi-account">
                <v-icon>mdi-account</v-icon>
                <v-menu activator="parent">
                    <v-list bg-color="#111" border>
                        <v-list-item>
                            <v-btn variant="text" to="/profile" prepend-icon="mdi-account-outline">Profile</v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn variant="text" color="#ff6060" prepend-icon="mdi-logout"
                                @click="auth.logout()">Logout</v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-btn>
        </template>
    </v-app-bar>
</template>