<template>
  <div class="contact-us">
    <div class="banner">
      <img src="@/assets/img12.jpg" alt="Contact Us Banner" class="banner-image" />
      <div class="banner-text">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any inquiries or collaborations.</p>
        <router-link class="logout-button" to="/home">Home</router-link>
      </div>
    </div>

    <div class="content">
      <section class="section">
        <div class="section-content">
          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon">
                <!-- <font-awesome-icon icon="box-open" class="icon" /> -->
              </div>
              <div class="contact-info">
                <strong>Address:</strong><br />
                BeautyBliss Cosmetics<br />
                123 Beauty Street, Makeup City<br />
                Pakistan, ZIP Code
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <!-- <font-awesome-icon icon="box-open" class="icon" /> -->
              </div>
              <div class="contact-info">
                <strong>Email:</strong><br />
                info@beautybliss.com
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <!-- <font-awesome-icon icon="box-open" class="icon" /> -->
              </div>
              <div class="contact-info">
                <strong>Phone:</strong><br />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHome, faUsers, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

library.add(faHome, faUsers, faBoxOpen);
export default {
  name: "ContactUs",
  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
.logout-button {
  background-color: #ca7c4e;
  color: white;
  border: none;
  margin-left: auto;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-decoration: none;
}
.logout-button:hover {
  background-color: #85573c;
}
.contact-us {
  padding: 20px;
}

.banner {
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
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.section {
  margin-bottom: 60px;
}

.section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  align-items: flex-start; /* Align items to the top */
}

.contact-icon {
  margin-right: 10px;
  width: 50px;
  text-align: center;
}

.contact-info {
  flex: 1;
}

.contact-info strong {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
</style>
