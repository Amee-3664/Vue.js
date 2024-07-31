<template>
  <div class="page-container">
    <!-- Navbar -->
    <div class="navbar">
      <div class="menu-items">
        <router-link to="/home" class="menu-item">Home</router-link>
        <router-link to="/About" class="menu-item">About Us</router-link>
        <router-link to="/Contact" class="menu-item">Contact Us</router-link>
        <router-link to="/ProductCard" class="menu-item">Our Products</router-link>
      </div>
      <el-button type="danger" class="logout-button" @click="handleLogout"
        >Logout</el-button
      >
    </div>

    <!-- Header with Background Image -->
    <div class="header">
      <div class="header-content">
        <!-- Content for the header -->
        <h1>Welcome to Our Website</h1>
        <p>Explore our services and products</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem("userId");
  ElMessage.success("Logout successful!");
  router.push("/");
};
</script>

<style scoped>
.page-container {
  background-image: url("@/assets/img12.jpg");
  background-size: cover;
  background-position: center;
  color: #fff;
  text-align: center;
  height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: -1rem;
  width: 86rem;
  margin-left: -1rem;
}

.navbar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.menu-items {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-item {
  color: #2f1c11;
  font-weight: bold;
  text-decoration: none;
  margin: 0 3rem;
  position: relative;
}

.menu-item:hover::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  border-bottom: 2px solid #ca7c4e;
}
.logout-button {
  background-color: #ca7c4e;
  color: white;
  border: none;
  margin-left: auto;
  padding: 0.5rem 1rem;
  cursor:pointer;
}

.logout-button:hover {
  background-color: #85573c;
}

.header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:-2%;
}

.header-content {
  text-align: center;
}

.header-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.header-content p {
  font-size: 1.5rem;
  font-weight: 300;
}
</style>
