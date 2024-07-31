<template>
  <div class="page-container">
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="heading">Admin Login</h2>
        <!-- <img src="@/assets/logo.webp" alt="Logo" class="logo" /> -->
        <el-form :model="loginForm" @submit.prevent="handleLogin">
          <el-form-item label="Username">
            <el-input v-model="loginForm.username" placeholder="Enter your username" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin">Login</el-button>
            <router-link to="/" class="btna">User Login</router-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = () => {
  // Hardcoded admin credentials
  const adminUsername = "admin";
  const adminPassword = "123";

  if (
    loginForm.value.username === adminUsername &&
    loginForm.value.password === adminPassword
  ) {
    ElMessage.success("Login successful!");

  
    const userInfo = JSON.stringify({ username: adminUsername }); 
    localStorage.setItem("user-info", userInfo);

    router.push("/productsPanel"); // Redirect to Admin panel
  } else {
    ElMessage.error("Invalid username or password.");
  }
};
</script>
<style scoped>
/* .logo {
  width: 10rem;
  border-radius: 5rem;
  margin-left: 16%;
  margin-bottom: 15%;
} */
.btna {
  background-color: #151a14;
  color: white;
  border: 1px solid #151a14;
  margin-left: 67%;
  text-decoration: none;
  padding: 0%;
  border-radius: 5px;
  width: 6rem;
  margin-top: -2rem;
  font-size:14px;
  font-family: Arial, Helvetica, sans-serif;
}
.btna:hover {
  background-color: #383438;
  border:none;
}

.page-container {
  background-image: url("@/assets/img11.jpg");
  background-size: cover;
  background-position: center;
  color: #fff;
  text-align: center;
  height: 99vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: -1rem;
  width: 86rem;
  margin-left: -1rem;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 300px;
  padding: 54px;
  margin-top: 7%;
  border: 2px solid #ffffff;
}

.login-card button {
  background-color: #151a14;
  color: white;
  border: 1px solid #151a14;
}

.login-card button:hover {
  background-color: rgb(53, 45, 45);
  color: white;
  border: 1px solid rgb(53, 45, 45);
}

.el-button + .el-button {
  margin-left: 118px;
}

.heading {
  font-size: 1.7rem;
  display: flex;
  justify-content: center;
}
</style>
