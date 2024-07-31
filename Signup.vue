<template>
  <div class="page-container">
    <h2 class="name">BEAUTYBLISS</h2>
    <div class="signup-container">
      <el-card class="signup-card">
        <h2 class="header">Signup</h2>
        <el-form :model="signupForm" @submit.prevent="handleSignup">
          <el-form-item label="">
            <el-input
              v-model="signupForm.username"
              placeholder="Enter your username"
            />
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="signupForm.email"
              placeholder="Enter your email"
            />
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="signupForm.password"
              type="password"
              placeholder="Set your password"
              @keydown="handleKeydown"
              @keyup="handleKeyup"
            />
            <p v-if="capsLockWarning" class="caps-lock-warning">
              Caps Lock is on!
            </p>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="signupForm.gender"
              placeholder="Select your gender"
            >
              <el-option label="Male" value="male"></el-option>
              <el-option label="Female" value="female"></el-option>
              <el-option label="Other" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input-number
              v-model="signupForm.age"
              :min="0"
              placeholder="age"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="btn" type="primary" @click="handleSignup">
              Signup
            </el-button>
            <el-button class="btn" type="default" @click="goToLogin">
              Already have an account?
            </el-button>
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
const signupForm = ref({
  username: "",
  email: "",
  password: "",
  gender: "",
  age: null,
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

const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const validatePassword = (password) => {
  const minLength = 6;
  const hasNumber = /\d/; // Checks for at least one digit
  const hasAlphabet = /[a-zA-Z]/; // Checks for at least one alphabet character
  const hasSpecialChar = /[@#%&*!]/; // Checks for at least one special character

  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasAlphabet.test(password) &&
    hasSpecialChar.test(password)
  );
};

const handleSignup = async () => {
  if (!validateEmail(signupForm.value.email)) {
    ElMessage.error("Please enter a valid email address.");
    return;
  }

  if (!validatePassword(signupForm.value.password)) {
    ElMessage.error(
      "Password must be 6+ characters with at least one number, letter, and special character."
    );
    return;
  }

  if (
    signupForm.value.username &&
    signupForm.value.email &&
    signupForm.value.password &&
    signupForm.value.gender &&
    signupForm.value.age
  ) {
    try {
      const response = await axios.post("http://localhost:3000/", {
        transition: "SIGNUP",
        data: {
          username: signupForm.value.username,
          email: signupForm.value.email,
          password: signupForm.value.password,
          gender: signupForm.value.gender,
          age: signupForm.value.age,
        },
      });

      console.log(response.data);

      if (response.data.errorMessage) {
        // Handle different error cases
        if (response.data.errorMessage === '409 Conflict') {
          ElMessage.error("Username or email already exists");
        } else {
          ElMessage.error("An error occurred. Please try again later.");
        }
      } else {
        const userInfo = JSON.stringify(signupForm.value);
        localStorage.setItem("user-info", userInfo);
        sessionStorage.setItem("user-info", userInfo);
        ElMessage.success("Signup successful!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      ElMessage.error("An error occurred. Please try again later.");
    }
  } else {
    ElMessage.error("Please fill in all fields.");
  }
};

const goToLogin = () => {
  router.push("/");
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
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-card {
  width: 400px;
  padding: 20px;
  margin-top: 1%;
  border: 2px solid #ffffff;
}

.btn {
  background-color: #151a14;
  color: white;
  border: 1px solid #151a14;
  margin-left: 2%;
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
