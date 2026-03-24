<script setup>
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import api  from '../services/api';

const router = useRouter()
const error = ref('')
const loading = ref(false)
const products= ref([])
const selectedProduct = ref(null)
const showProductDialog = ref(false)

async function fetchProducts(){

    try {
        await api.get('fetchAllProducts')
        .then(function (response) {
            if(response.data){
                products.value = response.data
            }
        })
    } catch (err) {
        error.value = err.response?.data?.message || 'Retrieving data failed'
        throw err
    } 
}

function view(product){
   selectedProduct.value = product // keep track of the course selected
   showProductDialog.value = true
}

const message = ref('')
const quantity = ref(null)
const token = localStorage.getItem( "authToken")

async function buy(productId){
    if(token){
        const userId = JSON.parse(localStorage.getItem("user")).id
        const formData = new FormData()
        formData.append("user_id", userId,);
        formData.append("product_id", productId);
        formData.append("quantity", quantity.value);
        
        try {
            await api.post('orders', formData,
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                error.value = ''
                loading.value = false
                showProductDialog.value = false
            })
        } catch (err) {
            error.value = err.response?.data?.message || 'Creating order failed'
            throw err
        }
    }else{
        router.push('/login')
    }

    }

onMounted(() => {
    fetchProducts();
}); 
</script>

<template>
   <v-container>
       <v-row>
               <p class="text-h3 text-right"> The Duka Products</p>
       </v-row>
   </v-container>
   <v-container>
       <v-row>
           <v-col md="4" v-for="item in products" :key="item">
               <v-card color = "secondary">
               <v-card-item>
                   <v-img class="align-end text-white" height="300" :src="'/' + item.image" cover ></v-img>
                   <v-card-title>{{item.name}}</v-card-title>
                   <v-card-subtitle>{{item.price}}</v-card-subtitle>
                   <v-card-text> {{item.description}} </v-card-text>
               </v-card-item>
               <v-card-actions>
                   <v-btn elevation="4" @click="view(item)" block> View </v-btn>
               </v-card-actions>
           </v-card>
           </v-col>
       </v-row>
   </v-container>

    <!-- View Product Dialog -->
    <v-dialog v-model="showProductDialog" max-width="600">
        <v-card>
            <v-row>
                <v-col md="6">
                    <v-card>
                        <v-img class="align-end text-white" height="500" :src="'/' + selectedProduct.image" cover ></v-img>
                    </v-card>
                </v-col>
                <v-col md="6">
                        <v-card-item>
                            <v-card-title>{{selectedProduct.name}}</v-card-title>
                            
                                <v-row>
                                    <v-col md="6">
                                        <v-rating :model-value="4" :size="24" readonly ></v-rating>
                                    </v-col>
                                </v-row>
                                <v-row>
                                   
                                    <v-col md="6">
                                        <v-btn color="lime-lighten-2" variant="outlined" density="compact" readonly> In Stock</v-btn>
                                    </v-col>
                                </v-row>
                            <v-card-text> {{selectedProduct.description}} </v-card-text>
                            <v-card-title>{{selectedProduct.price}}</v-card-title>
                           
                                <v-row>
                                    <v-col md="4">Quantity</v-col>
                                    <v-col md="4">
                                        <v-number-input v-model="quantity" control-variant="split" density="compact" :min="1" :max="10" > </v-number-input>
                                    </v-col>
                                </v-row>
                        </v-card-item>
                        <v-card-actions>
                            <v-btn elevation="4" color="primary" variant="elevated" @click="buy(selectedProduct.id)" > Buy </v-btn>
                        </v-card-actions>
                        <v-alert v-if="message" type="info" class="mb-4">{{ message }}</v-alert>
                </v-col>
            </v-row>    
        </v-card>
    </v-dialog>

</template>
