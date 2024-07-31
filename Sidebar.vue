<template>
  <div class="sidebar">
    <ul>
      <li class="main"><router-link to="">ADMIN DASHBOARD</router-link></li>
      <li>
        <router-link to="/home">
          <font-awesome-icon icon="home" class="icon" />
          Home
        </router-link>
      </li>
      <li>
        <router-link to="/UserPanel">
          <font-awesome-icon icon="users" class="icon" />
          Manage Users
        </router-link>
      </li>
      <li>
        <router-link to="/ProductsPanel">
          <font-awesome-icon icon="box-open" class="icon" />
          Manage Products
        </router-link>
      </li>
    </ul>
     <!-- Logout Button -->
     <el-button class="logout-btn" type="danger" @click="handleLogouts">Logout</el-button>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUsers, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { ElNotification } from 'element-plus';

library.add(faHome, faUsers, faBoxOpen);

export default {
  name: "Sidebar",
  components: {
    FontAwesomeIcon
  },
  methods: {
  handleLogouts() {
      // Clear user info from localStorage or Vuex store
      localStorage.removeItem("user-info");

      // Redirect to AdminLogin page
      this.$router.push("/AdminLogin");

      // Show logout success notification
      ElNotification({
        title: 'Success',
        message: 'Logged out successfully',
        type: 'success'
      });
    },
}
};
</script>

<style scoped>
.logout-btn{
margin-left: 9%;
}
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #2c3e50;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  color: #ecf0f1;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.main {
  margin-top: 1rem;
}

.sidebar li {
  margin-bottom: 4rem; /* Increase the bottom margin to add space */
}

.sidebar a {
  text-decoration: none;
  color: #ecf0f1;
  margin-left:6%;
  display: flex;
  align-items: center;
}

.sidebar a:hover {
  color: #3498db;
}

.icon {
  margin-right: 0.5rem; /* Adjust spacing between icon and text */
}
</style>
