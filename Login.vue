<template>
  <div class="page-container">
    <h2 class="name">BEAUTYBLISS</h2>
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="header">Login</h2>
        <el-form :model="loginForm" @submit.prevent="handleLogin">
          <el-form-item label="Username">
            <el-input
              v-model="loginForm.username"
              placeholder="Enter your username"
            />
          </el-form-item>
          <el-form-item label="Password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              @keydown="handleKeydown"
              @keyup="handleKeyup"
            />
            <p v-if="capsLockWarning" class="caps-lock-warning">
              Caps Lock is on!
            </p>
          </el-form-item>
          <el-form-item>
            <el-button class="btn" type="primary" @click="handleLogin">
              Login
            </el-button>
            <el-button class="btn" type="default" @click="goToSignup">
              Don't have an account yet?
            </el-button>
            <router-link to="/AdminLogin" class="btna">Admin Login</router-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import axios from "axios"; 

const store = useStore();
const router = useRouter();
const loginForm = ref({
  username: "",
  password: "",
});

const capsLockWarning = ref(false);

const handleKeydown = (event) => {
  capsLockWarning.value = isCapsLockOn(event);
};

const handleKeyup = (event) => {
  capsLockWarning.value = isCapsLockOn(event);
};

const isCapsLockOn = (event) => {
  // Check if the key event has a non-standard property for Caps Lock status
  return event.getModifierState && event.getModifierState("CapsLock");
};

const handleLogin = async () => {
  try {
    if (!loginForm.value.username || !loginForm.value.password) {
      ElMessage.error("Please fill out all the fields");
      return;
    }

    console.log("Connecting with the server...");

    const response = await axios.post("http://localhost:3000/", {
      transition: "LOGIN",
      data: {
        username: loginForm.value.username,
        password: loginForm.value.password,
      },
    });

    console.log(response.data);

    if (response.data.errorMessage) {
      // Handle different error cases
      if (response.data.errorMessage === '401 Unauthorized') {
        ElMessage.error("Incorrect username or password");
      } else {
        ElMessage.error("An error occurred. Please try again later.");
      }
    } else {
      localStorage.setItem("userId", JSON.stringify(response.data.users));
      ElMessage.success("Login successful!");
      router.push({ name: "home" });
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    ElMessage.error("An error occurred. Please try again later.");
  }
};

const goToSignup = () => {
  router.push("/Signup");
};
</script>

<style scoped>
.name {
  color: #c9c9c9;
  margin-top: 3rem;
  font-family: "Bebas Neue", cursive;
  justify-content: start;
  margin-left: 3rem;
  font-size: 20px;
}
.page-container {
  background-image: url("@/assets/img4.jpg");
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
  width: 400px;
  padding: 20px;
  margin-top: 5%;
  border: 2px solid #ffffff;
}

.btn {
  background-color: #151a14;
  color: white;
  border: 1px solid #151a14;
  margin-left: 3%;
}
.btna {
  background-color: #151a14;
  color: white;
  border: 1px solid #151a14;
  margin-left: 73%;
  text-decoration: none;
  padding: 0%;
  border-radius: 5px;
  width: 6rem;
  margin-top: 1rem;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
.btna:hover {
  background-color: #302c30;
  border: #302c30;
}
.btn:hover {
  background-color: rgb(53, 45, 45);
  color: white;
  border: 1px solid rgb(53, 45, 45);
}

.el-button + .el-button {
  margin-left: 5rem;
}

h2 {
  font-size: 1.7rem;
  display: flex;
  justify-content: center;
}
.caps-lock-warning {
  color: #47ab2e;
  font-size: 15px;
  margin-top: 5px;
}
</style>
