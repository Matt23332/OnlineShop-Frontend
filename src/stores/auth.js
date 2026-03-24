import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api.js'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    const isLoggedIn = computed(() => !!token.value)

    async function init() {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
            token.value = savedToken
            fetchUser();
        }
    }

    async function login(credentials) {
        try {
            const response = await api.post('/login', credentials)
            token.value = response.data.token
            user.value = response.data.user
            localStorage.setItem('token', token.value)
            router.push('/')
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    async function fetchUser() {
        const response = await api.get('/user', {
            headers: { Authorization: `Bearer ${token.value}`}
        });
        user.value = response.data;
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        router.push('/login')
    }

    return { user, token, isLoggedIn, login, logout, fetchUser, init }
})