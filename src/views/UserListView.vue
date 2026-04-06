<template>
  <div class="user-container">
    <h1 v-if="auth.isAdmin">Lista de Usuários</h1>
    <table class="user-table" v-if="users.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Herói</th>
          <th>Detalhes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.hero_name }}</td>
          <td>
            <router-link :to="`/usuario/${user.id}`">
              <button><i class="fa-solid fa-search"></i></button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Nenhum usuário encontrado.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const users = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/list', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    const data = await response.json()
    users.value = Array.isArray(data.users) ? data.users : []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
})
</script>

<style scoped>
.user-container {
  text-align: center;
  margin-top: 50px;
}

.user-table {
  margin: 20px auto;
  border-collapse: collapse;
  width: 80%;
}

.user-table th,
.user-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
}

.user-table th {
  background-color: #f4f4f4;
}
</style>