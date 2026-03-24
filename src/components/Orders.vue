<script setup>
import {ref, onMounted} from 'vue'
import api  from '../services/api';

const error = ref('')
const loading = ref(false)
const token = localStorage.getItem( "authToken")
const orders= ref([])

async function fetchOrders(){

    const userId = JSON.parse(localStorage.getItem("user")).id
    try {
        await api.get('ordersPerUser/'+ userId, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(function (response) {
            if(response.data){
                orders.value = response.data
            }
        })
    } catch (err) {
        error.value = err.response?.data?.message || 'Retrieving data failed'
        throw err
    } 
}

onMounted(() => {
    fetchOrders();
}); 
</script>
<template>
    <v-container>
        <v-row>
            <v-col cols="12" align="right">
                <v-btn> Checkout </v-btn>
            </v-col>
            <v-col v-for="order in orders" :key="order" cols="12" >
                <v-card border="opacity-50 sm primary" variant="elevated" class="mx-auto" >
                    <v-row>
                    <v-col md="4" >
                        <v-container class="d-flex align-center justify-center fill-height">
                            <v-img :src = "order.product.image" width="150px" height="150px"></v-img>
                        </v-container>    
                    </v-col>
                    <v-col md="6">
                        <v-card-item>
                            <div>
                                <div class="text-overline mb-1"> {{order.product.name}} </div>
                                <div class="text-caption"> {{order.product.price}} </div>
                                <div class="text-caption">No of Items: {{ order.quantity }}</div>
                                <div class="text-h6 mb-1">Total: {{ order.quantity * Number(order.product.price) }}</div>
                            </div>
                        </v-card-item>
                        <v-card-actions>
                            
                        </v-card-actions>
                    </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
   </v-container>
</template>