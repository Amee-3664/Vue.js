<template>
  <Sidebar />
  <div class="color">
    <!-- User Table -->
    <div class="table-container">
      <h2 class="head">Admin Dashboard</h2>
      <!-- Logout Button
      <el-button class="logout-btn" type="danger" @click="handleLogouts">Logout</el-button> -->
      <h2 class="header">Manage Users</h2>
      <el-table :data="users" class="custom-table">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="username" label="Username" width="200"></el-table-column>
        <el-table-column prop="email" label="Email" width="250"></el-table-column>
        <el-table-column prop="gender" label="Gender" width="100"></el-table-column>
        <el-table-column prop="age" label="Age" width="100"></el-table-column>
        <el-table-column label="Actions" width="180">
          <template v-slot="scope">
            <el-button class="btn" type="primary" size="mini" @click="editUser(scope.row)">Update</el-button>
            <el-button
              class="btn"
              type="danger"
              size="mini"
              @click="confirmDelete(scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Forms Section -->
    <div class="forms-section">
      <!-- Add User Form -->
      <div class="form-container">
        <h2 class="header">Add User</h2>
        <el-card class="add-card">
          <el-form :model="addForm" @submit.prevent="handleAdd">
            <el-form-item label="">
              <el-input v-model="addForm.username" placeholder="Enter username" />
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="addForm.email" placeholder="Enter email" />
            </el-form-item>
            <el-form-item label="">
              <el-input
                v-model="addForm.password"
                type="password"
                placeholder="Enter password"
              />
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="addForm.gender" placeholder="Select gender">
                <el-option label="Male" value="male"></el-option>
                <el-option label="Female" value="female"></el-option>
                <el-option label="Other" value="other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input-number v-model="addForm.age" :min="0" placeholder="Enter age" />
            </el-form-item>
            <el-form-item>
              <el-button class="btn2" type="primary" @click="handleAdd"
                >Add User</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- Update User Form -->
      <div class="form-container">
        <h2 class="header">Update User</h2>
        <el-card class="update-delete-card" v-if="user">
          <el-form :model="updateForm" @submit.prevent="handleUpdate">
            <el-form-item label="">
              <el-input v-model="updateForm.username" placeholder="Enter username" />
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="updateForm.email" placeholder="Enter email" />
            </el-form-item>
            <el-form-item label="">
              <el-input
                v-model="updateForm.password"
                type="password"
                placeholder="Enter password"
              />
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="updateForm.gender" placeholder="Select gender">
                <el-option label="Male" value="male"></el-option>
                <el-option label="Female" value="female"></el-option>
                <el-option label="Other" value="other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input-number
                v-model="updateForm.age"
                :min="0"
                placeholder="Enter age"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="btn2" type="primary" @click="handleUpdate"
                >Update User</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import { ElMessage } from "element-plus";
</script>

<script>
import { useRouter } from "vue-router";
export default {
  data() {
    return {
      userId: "",
      user: null,
      updateForm: {
        id: "",
        username: "",
        email: "",
        password: "",
        gender: "",
        age: "",
      },
      deleteForm: {
        id: "",
      },
      addForm: {
        username: "",
        email: "",
        password: "",
        gender: "",
        age: "",
      },
    };
  },
  computed: {
    users() {
      return this.$store.getters["post/users"];
    },
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUser(userId) {
      try {
        const user = await this.$store.dispatch("post/fetchUser", userId);
        this.user = user;
        this.updateForm = { ...user };
        this.userId = userId;
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    editUser(user) {
      this.user = user;
      this.updateForm = { ...user };
      this.userId = user.id;
    },
    async handleUpdate() {
      try {
        await this.$store.dispatch("post/updateUser", {
          id: this.userId,
          ...this.updateForm,
        });
        this.$message.success("User updated successfully");
        this.user = null;
        this.updateForm = {
          id: "",
          username: "",
          email: "",
          password: "",
          gender: "",
          age: "",
        };
        this.fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        this.$message.error("Error updating user");
      }
    },
    confirmDelete(user) {
      this.$confirm(
        `Are you sure you want to delete user ${user.username}?`,
        "Confirm Delete",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          this.handleDelete(user.id);
        })
        .catch(() => {
          this.$message.info("Delete canceled");
        });
    },
    async handleDelete(userId) {
      try {
        await this.$store.dispatch("post/deleteUser", userId);
        this.$message.success("User deleted successfully");
        this.user = null;
        this.updateForm = {
          id: "",
          username: "",
          email: "",
          password: "",
          gender: "",
          age: "",
        };
        this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        this.$message.error("Error deleting user");
      }
    },
    async handleAdd() {
      try {
        await this.$store.dispatch("post/addUser", this.addForm);
        this.$message.success("User added successfully");
        this.addForm = {
          username: "",
          email: "",
          password: "",
          gender: "",
          age: "",
        };
        this.fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
        this.$message.error("Error adding user");
      }
    },
    async fetchUsers() {
      try {
        await this.$store.dispatch("post/fetchUsers");
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  //   handleLogouts() {
  //     // Clear user info from localStorage or Vuex store
  //     localStorage.removeItem("user-info");

  //     // Redirect to AdminLogin page
  //     this.$router.push("/AdminLogin");
  //     // Show logout success message
  // ElMessage.success("Logout successful!");
  //   },
  },
};
</script>

<style scoped>
.color{
  background-image: url("@/assets/img15.jpg");
  margin-top: -1rem;
}
.head {
  display: flex;
  justify-content: center;
  margin-right: 5rem;
}
.header {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 20px 0;
  margin-left: 21.5rem;
}
.table-container {
  
  margin-left: 20rem;
    width: 56rem;
}

.add-card,
.update-delete-card {
  max-width: 400px;
  margin-bottom: 20px;
  max-width: 226px;
  margin-bottom: 20px;
  padding: 2rem;
  margin-left: 16rem;
}

.forms-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.form-container {
  flex: 0 1 calc(50% - 20px);
}

.custom-table .el-table__header,
.custom-table .el-table__body {
  background-color: #f9fafb;
  color: #333;
}

.custom-table .el-table__header th {
  background-color: #1f2d3d;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.custom-table .el-table__body td {
  background-color: #fff;
  text-align: center;
  padding: 10px;
}

.custom-table .el-table__body tr:nth-child(even) {
  background-color: #f2f2f2;
}

.custom-table .el-table__body tr:hover {
  background-color: #e0e0e0;
}

.custom-table .el-table__header th,
.custom-table .el-table__body td {
  border-bottom: 1px solid #ddd;
}

.btn {
  margin-right: -4px;
}
.btn2[data-v-3b5b508e] {
    margin-right: -4px;
    background-color: #46a346;
    border: green;
}
.logout-btn{
  float:right;
  margin-top: -3rem;
}
</style>
