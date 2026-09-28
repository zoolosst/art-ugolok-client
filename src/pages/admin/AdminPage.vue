<script lang="ts" setup>
document.title = 'Арт-уголок | ADMIN'
</script>

<template>
  <main class="container pb-5">
    <div class="admin-card">
      <div class="admin-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
      </div>
      <h1>Админ-панель</h1>
      <p>Добро пожаловать в панель управления магазином "Арт-Уголок"</p>

      <div class="admin-nav">
        <router-link :to="{ name: 'admin-catalog' }">Управление товарами</router-link>
        <router-link :to="{ name: 'admin-category' }">Управление категориями</router-link>
        <router-link :to="{ name: 'admin-order' }">Управление заказами</router-link>
        <router-link :to="{ name: 'admin-request' }">Управление заявками</router-link>
        <router-link :to="{ name: 'admin-rent' }">Управление арендой полок</router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 130vh;
}

.admin-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.admin-card h1 {
  color: #2d3748;
  margin-bottom: 20px;
  font-weight: 700;
}

.admin-card p {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.admin-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-icon svg {
  width: 50px;
  height: 50px;
  fill: white;
}

.admin-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.admin-nav a {
  background: #f7fafc;
  border-radius: 12px;
  padding: 15px 20px;
  text-decoration: none;
  color: #4a5568;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-nav a:hover {
  background: #edf2f7;
  transform: translateY(-2px);
}

.admin-nav a::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
}
</style>
