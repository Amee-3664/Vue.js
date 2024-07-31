import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export const post = {
  namespaced: true,
  state: {
    products: [],
    user: null,
    users: [], // Add this line to state
  },
  getters: {
    products: state => state.products,
    user: state => state.user,
    users: state => state.users, // Add this line to getters
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product);
    },
    DELETE_PRODUCT(state, productId) {
      state.products = state.products.filter(product => product.id !== productId);
    },
    UPDATE_PRODUCT(state, updatedProduct) {
      const index = state.products.findIndex(product => product.id === updatedProduct.id);
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct);
      }
    },
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      const response = await api.get('/products');
      commit('SET_PRODUCTS', response.data);
    },
    async addProduct({ commit }, product) {
      const response = await api.post('/products', product);
      commit('ADD_PRODUCT', response.data);
    },
    async deleteProduct({ commit }, productId) {
      await api.delete(`/products/${productId}`);
      commit('DELETE_PRODUCT', productId);
    },
    async updateProduct({ commit }, updatedProduct) {
      const response = await api.put(`/products/${updatedProduct.id}`, updatedProduct);
      commit('UPDATE_PRODUCT', response.data);
    },



    async login({ commit }, { username, password }) {
      try {
        const response = await api.post('/login', { username, password });
        const user = response.data.user;
        if (user) {
          commit('SET_USER', user);
          localStorage.setItem('userId', user.id);
          return user;
        } else {
          throw new Error('Invalid Credentials');
        }
      } catch (error) {
        console.error('Error logging in', error);
        throw error;
      }
    },

    logout({ commit }) {
      commit('CLEAR_USER');
      localStorage.removeItem('userId');
    },
    async signup({ commit }, userData) {
      try {
        const response = await api.post('/user', userData);
        commit('SET_USER', response.data);
        return response.data;
      } catch (error) {
        console.error('Error signing up', error);
        throw error;
      }
    },
    async fetchUser({ commit }, userId) {
      try {
        const response = await api.get(`/user/${userId}`);
        commit('SET_USER', response.data.user);
        return response.data.user;
      } catch (error) {
        console.error('Error fetching user', error);
        throw error;
      }
    },
    async deleteUser({ commit }, userId) {
      try {
        await api.delete(`/user/${userId}`);
        commit('CLEAR_USER');
      } catch (error) {
        console.error('Error deleting user', error);
        throw error;
      }
    },
    async updateUser({ commit }, { id, username, email, password, gender, age }) {
      try {
        const response = await api.put(`/user/${id}`, { username, email, password, gender, age });
        commit('SET_USER', response.data.user);
        return response.data.user;
      } catch (error) {
        console.error('Error updating user', error);
        throw error;
      }
    },
    async addUser({ commit }, userData) {
      try {
        const response = await api.post('/user', userData);
        commit('SET_USER', response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding user', error);
        throw error;
      }
    },
    async fetchUsers({ commit }) {
      try {
        const response = await api.get('/users');
        commit('SET_USERS', response.data);
      } catch (error) {
        console.error('Error fetching users', error);
        throw error;
      }
    },
  },
};
