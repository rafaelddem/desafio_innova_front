<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/home">Home</router-link></li>
      <li><router-link to="/editar">Edição de Usuário</router-link></li>
      <li v-if="auth.isAdmin"><router-link to="/projeto">Cadastro de Projeto</router-link></li>
      <li><router-link to="/projetos">Lista de Projetos</router-link></li>
      <li>
        <a href="#" @click.prevent="handleLogout">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  try {
    await fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Erro ao chamar logout no backend:', error)
  } finally {
    auth.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 20px;
  z-index: 1000;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar li {
  display: inline;
}

.navbar a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>