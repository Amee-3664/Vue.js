<template>
  <div class="about-us">
    <div class="banner">
      <img src="@/assets/img12.jpg" alt="About Us Banner" class="banner-image">
      <div class="banner-text">
        <h1>About Our Makeup Products</h1>
        <p>Discover beauty in every shade with our exclusive makeup collection.</p>
        <router-link class="logout-button" to="/home">Home</router-link>
      </div>
    </div>

    <div class="content">
      <section class="section">
        <div class="section-content">
          <div class="section-image">
            <img src="@/assets/img13.jpg" alt="Our Story Image">
          </div>
          <div class="section-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, BeautyBliss has been dedicated to creating high-quality makeup products
              that celebrate diversity and empower individuals to express their unique beauty.
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-content">
          <div class="section-image">
            <img src="@/assets/img12.jpg" alt="Our Mission Image">
          </div>
          <div class="section-text">
            <h2>Our Mission</h2>
            <p>
              At BeautyBliss, we believe that beauty should be inclusive and accessible to everyone. 
              We strive to innovate and create makeup products that cater to diverse skin tones and types,
              while promoting sustainability and ethical practices.
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-content">
          <div class="section-image">
            <img src="@/assets/img3.jpg" alt="Why Choose Us Image">
          </div>
          <div class="section-text2">
            <h2>Why Choose Us?</h2>
            <p>
              <span>
                Wide range of shades to match every skin tone.<br>
                Cruelty-free and vegan options available.<br>
                Commitment to using high-quality ingredients.<br>
                Dedicated to customer satisfaction and beauty education.
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
}
</script>

<style scoped>
.section-text2{
 
    max-width: 600px;
    text-align: left;
    margin-right: 2rem;

}
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

.about-us {
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
  flex-direction: row; 
  align-items: center;
  justify-content: space-between; 
}

.section-text {
  max-width: 600px;
    text-align: left;
    margin-right: -10rem;
}

.section h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.section p {
  line-height: 1.6;
  font-size: 1.1rem;
}

.section-image {
  max-width: 40%; 
  flex: 1; 
}

.section-image img {
  width: 94%;
  height: auto;
  border-radius: 10px;
}
</style>
