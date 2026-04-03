<template>
  <div class="project-page" v-if="project">
    <div class="project-container">
      <h1>{{ project.name }}</h1>
      <p>Status: {{ statusMap[project.status] || project.status }}</p>
      <p>Descrição: {{ project.description }}</p>
      <p>Metas: {{ project.goals }}</p>
      <button class="back-button" @click="goBack">Voltar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const project = ref(null)

const statusMap = {
  in_progress: 'Em andamento',
  completed: 'Concluído',
  pending: 'Pendente'
}

onMounted(async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/project/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    const data = await response.json()
    project.value = data.project
  } catch (error) {
    console.error('Erro ao carregar projeto:', error)
  }
})

const goBack = () => {
  router.push('/projetos')
}
</script>

<style scoped>
.project-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.project-container {
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.project-container form div {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.project-container label {
  margin-bottom: 5px;
  font-weight: bold;
}

.project-container input {
  height: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.project-container select {
  height: 40px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.project-container button {
  width: 100%;
  padding: 10px;
}

.register-btn {
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
