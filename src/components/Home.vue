<script setup>
import { ref } from 'vue'
import background from '@/assets/main-background.jpg'
import phone from '@/assets/iphone-15-pro.jpg'
import electronics from '@/assets/electronics.jpg'
import clothing from '@/assets/clothing.jpg'
import homeKitchen from '@/assets/home-and-kitchen.jpg'
import books from '@/assets/books.jpg'
import jeans from '@/assets/jeans.jpg'
import blender from '@/assets/blender.jpg'
import novel from '@/assets/novel.jpg'

const categories = ref([
  { name: 'Electronics', image: electronics },
  { name: 'Clothing', image: clothing },
  { name: 'Home & Kitchen', image: homeKitchen },
  { name: 'Books', image: books },
])

const products = ref([
  { id: 1, name: 'Smartphone', price: 129999, description: 'Latest model with amazing features.', image: phone },
  { id: 2, name: 'Jeans', price: 1999, description: 'Comfortable and stylish denim jeans.', image: jeans },
  { id: 3, name: 'Blender', price: 1499, description: 'Powerful blender for smoothies and more.', image: blender },
  { id: 4, name: 'Novel', price: 499, description: 'Bestselling novel by a renowned author.', image: novel },
])
</script>

<template>
  <v-container fluid>

    <!--Hero section -->
    <v-row class="hero-section" align="center" justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="display-2 font-weight-bold">Welcome to THE DUKA</h1>
        <p class="subtitle-1">Shop the best products at unbeatable prices.</p>
        <v-btn color="primary" large class="mt-4">Shop Now</v-btn>
      </v-col>
    </v-row>

    <!--Categories-->
    <v-row class="mt-10">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Categories</h2>
      </v-col>

      <v-col cols="12" sm="6" md="3" v-for="category in categories" :key="category.name">
        <v-card class="pa-4" elevation="3">
          <v-img :src="category.image" height="200"></v-img>
          <v-card-title class="text-center">{{ category.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!--Featured Products-->
    <v-row class="mt-10">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">Featured Products</h2>
      </v-col>

      <v-col cols="12" sm="6" md="3" v-for="product in products" :key="product.id">
        <v-card class="pa-4" elevation="3">
          <v-img :src="product.image" height="200"></v-img>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle class="teal--text text--darken-2 font-weight-bold">KES{{ product.price }}</v-card-subtitle>
          <v-card-text>{{ product.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" block>Add to Cart</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>
.hero-section {
  background: url('@/assets/main-background.jpg') center center / cover no-repeat;
  color: white;
  background-size: cover;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>