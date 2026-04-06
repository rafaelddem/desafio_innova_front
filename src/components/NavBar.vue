<template>
  <nav class="navbar">
    <ul>
      <li>
        <a href="#" @click.prevent="toggleProjects">Projetos</a>
        <ul v-if="subMenuProject" class="submenu">
          <li v-if="auth.isAdmin"><router-link to="/projeto" @click="closeSubmenu">Cadastro de Projeto</router-link></li>
          <li><router-link to="/projetos" @click="closeSubmenu">Lista de Projetos</router-link></li>
        </ul>
      </li>
      <li v-if="auth.isAdmin">
        <a href="#" @click.prevent="toggleUser">Usuários</a>
        <ul v-if="subMenuUser" class="submenu">
          <li><router-link to="/cadastrar" @click="closeSubmenu">Cadastro de Usuário</router-link></li>
          <li><router-link to="/usuarios" @click="closeSubmenu">Lista de Usuários</router-link></li>
        </ul>
      </li>
      <li><router-link :to="`/usuario/${userId}`" @click="closeSubmenu">Perfil</router-link></li>
      <li><a href="#" @click.prevent="handleLogout" @click="closeSubmenu">Logout</a></li>
    </ul>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const subMenuProject = ref(false)
const subMenuUser = ref(false)
const userId = ref(localStorage.getItem('user.user_id'))

function toggleProjects() {
  closeSubmenu()
  subMenuProject.value = !subMenuProject.value
}

function toggleUser() {
  closeSubmenu()
  subMenuUser.value = !subMenuUser.value
}

function closeSubmenu() {
  subMenuProject.value = false
  subMenuUser.value = false
}

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
  position: relative;
}

.navbar a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.navbar a:hover {
  text-decoration: none;
}

.navbar .submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #444;
  padding: 10px;
  list-style: none;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}
</style>