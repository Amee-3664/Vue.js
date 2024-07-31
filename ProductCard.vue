<template>
   <!-- <div class="banner">
      <img src="@/assets/img12.jpg" alt="Contact Us Banner" class="banner-image" />
      <div class="banner-text">
        <h1>Watch our Products</h1>
        <p>Your Beauty Journey Starts Here.</p>
        <router-link class="logout-button" to="/home">Home</router-link>
      </div>
    </div> -->
  <h2 class="pro">Our Products</h2>
  <router-link class="logout-button" to="/home">Home</router-link>
  <div class="product-cards">
    <div v-for="product in products" :key="product.id" class="product-card">
      <img v-if="product.image" :src="`http://localhost:3001${product.image}`" alt="Product Image" class="product-image"/>
      <h3 class="product-name">{{ product.name }}</h3>
      <!-- <p class="product-detail"><strong>Quantity:</strong> {{ product.quantity }}</p> -->
      <p class="product-detail"><strong>Price:</strong> ${{ product.price }}</p>
      <p class="product-detail"><strong>Description:</strong> {{ product.description }}</p>
    </div>
  </div>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/products');
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.pro{
display: flex;
justify-content: center;
font-family:'Times New Roman', Times, serif;
color:#ca7c4e;
font-size: 27px;
}

.product-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 8rem;
  margin-top: -7rem;
}

.product-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: calc(29.33% - 20px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.product-card:hover {
  transform: scale(1.05); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
}

.product-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  
}

.product-name {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-detail {
  font-size: 14px;
  margin-bottom: 5px;
}
/* .banner {
  position: relative;
  margin-bottom: 40px;
}

.banner-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.banner-text h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.banner-text p {
  font-size: 1.2rem;
} */
.logout-button {
  background-color: #ca7c4e;
  color: white;
  border: none;
  margin-left: 39rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  justify-content: center;
  width: 4rem;
} 
.logout-button:hover {
  background-color: #85573c;
}
.footer {
  background-color: #a77558;
  color: #fff;
  padding: 1rem;
  text-align: center;
  margin-top: -5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
