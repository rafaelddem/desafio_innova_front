<template>
  <div class="project-container">
    <h1 v-if="auth.isAdmin">Listagem de Projetos</h1>
    <h1 v-else>Meus Projetos</h1>

    <table class="project-table" v-if="projects.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Status</th>
          <th>Detalhes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.id }}</td>
          <td>{{ project.name }}</td>
          <td>{{ statusMap[project.status] || project.status }}</td>
          <td>
            <router-link :to="`/projetos/${project.id}`">
              <button><i class="fa-solid fa-search"></i></button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Nenhum projeto encontrado.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const projects = ref([])

const statusMap = {
  in_progress: 'Em andamento',
  completed: 'Concluído',
  pending: 'Pendente'
}

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/project', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    const data = await response.json()
    projects.value = Array.isArray(data.projects) ? data.projects : []
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
  }
})
</script>

<style scoped>
.project-container {
  text-align: center;
  margin-top: 50px;
}

.project-table {
  margin: 20px auto;
  border-collapse: collapse;
  width: 80%;
}

.project-table th,
.project-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
}

.project-table th {
  background-color: #f4f4f4;
}
</style>