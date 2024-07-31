<template>
  <Sidebar />
  <div class="store">
    <h2 class="head">Admin Dashboard</h2>
    <h2 class="heading">Manage Products</h2>

    <!-- Product Form-->
    <div class="input-group">
      <input v-model="newProduct.name" placeholder="Name" class="input-field" />
      <input v-model="newProduct.quantity" placeholder="Quantity" class="input-field" />
      <input v-model="newProduct.price" placeholder="Price" class="input-field" />
      <input v-model="newProduct.description" placeholder="Description" class="input-field" />
      <input type="file" @change="handleImageUpload" />
      <button @click="createProduct" class="btn btn-success">Add Product</button>
    </div>

    <div v-if="editingProduct" class="edit-group">
      <input v-model="updatedProduct.name" placeholder="Updated Name" class="input-field" />
      <input v-model="updatedProduct.quantity" placeholder="Updated Quantity" class="input-field" />
      <input v-model="updatedProduct.price" placeholder="Updated Price" class="input-field" />
      <input v-model="updatedProduct.description" placeholder="Updated Description" class="input-field" />
      <input type="file" @change="handleImageUploadEdit" />
      <button @click="saveUpdatedProduct" class="btn btn-primary">Save</button>
      <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
    </div>

    <div class="product-cards">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img v-if="product.image" :src="`http://localhost:3001${product.image}`" alt="Product Image" class="product-image"/>
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-detail"><strong>Quantity:</strong> {{ product.quantity }}</p>
        <p class="product-detail"><strong>Price:</strong> ${{ product.price }}</p>
        <p class="product-detail"><strong>Description:</strong> {{ product.description }}</p>
        <div class="product-actions">
          <button @click="removeProduct(product.id)" class="btn btn-danger">Delete</button>
          <button @click="editProduct(product)" class="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import axios from 'axios';

const newProduct = ref({
  name: "",
  quantity: "",
  price: "",
  description: "",
  image: null,
});
const updatedProduct = ref({
  id: null,
  name: "",
  quantity: "",
  price: "",
  description: "",
  image: null,
});
const editingProduct = ref(false);
const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/products');
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const createProduct = async () => {
  const formData = new FormData();
  formData.append('name', newProduct.value.name);
  formData.append('quantity', newProduct.value.quantity);
  formData.append('price', newProduct.value.price);
  formData.append('description', newProduct.value.description);
  if (newProduct.value.image) {
    formData.append('image', newProduct.value.image);
  }
  try {
    await axios.post('http://localhost:3001/products', formData),{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    fetchProducts();
    newProduct.value = { name: "", quantity: "", price: "", description: "", image: null };
    ElNotification({
      title: 'Success',
      message: 'Product added successfully',
      type: 'success'
    });
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

const removeProduct = async (productId) => {
  try {
    await axios.delete(`http://localhost:3001/products/${productId}`);
    fetchProducts();
    ElNotification({
      title: 'Success',
      message: 'Product deleted successfully',
      type: 'success'
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

const editProduct = (product) => {
  editingProduct.value = true;
  updatedProduct.value = { ...product };
};

const saveUpdatedProduct = async () => {
  const formData = new FormData();
  formData.append('name', updatedProduct.value.name);
  formData.append('quantity', updatedProduct.value.quantity);
  formData.append('price', updatedProduct.value.price);
  formData.append('description', updatedProduct.value.description);
  if (updatedProduct.value.image) {
    formData.append('image', updatedProduct.value.image);
  }

  try {
    await axios.put(`http://localhost:3001/products/${updatedProduct.value.id}`, formData);
    fetchProducts();
    editingProduct.value = false;
    updatedProduct.value = { id: null, name: "", quantity: "", price: "", description: "", image: null };
    ElNotification({
      title: 'Success',
      message: 'Product updated successfully',
      type: 'success'
    });
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

const cancelEdit = () => {
  editingProduct.value = false;
  updatedProduct.value = { id: null, name: "", quantity: "", price: "", description: "", image: null };
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newProduct.value.image = file;
  }
};

const handleImageUploadEdit = (event) => {
  updatedProduct.value.image = event.target.files[0]; // Check if the file is being correctly assigned
  console.log("Updated Product Image:", updatedProduct.value.image); // Debugging log
};


// Fetch products when the component is created
fetchProducts();
</script>

<style scoped>
.product-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>


<style scoped>
.head {
  display: flex;
  justify-content: center;
}
.heading {
  display: flex;
  justify-content: center;
}
.store {
  margin: 20px;
  padding-left: 220px; 
}

.product-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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
}

.product-name {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-detail {
  font-size: 14px;
  margin-bottom: 5px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.btn {
  margin-left: 10px;
}

.btn-danger {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  flex: 1;
}
.btn-danger:hover {
  background-color: #c78079;
}

.btn-primary {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  flex: 1;
 
}
.btn-primary:hover {
  background-color: #4691c4;
}

.btn-success {
  background-color: #2ecc71;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-left: -5rem;
}
.btn-success:hover {
  background-color: #3ca86b;
}

.btn-secondary {
  background-color: #95a5a6;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 10%;
}
.btn-secondary:hover {
  background-color: #828e8f;
}

.input-group,
.edit-group {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.input-field {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width:0%;
}
.logout-btn {
  float: right;
  margin-top: -3rem;
}
</style>
