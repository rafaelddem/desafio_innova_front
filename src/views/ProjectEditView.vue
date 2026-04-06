<template>
  <div class="project-page">
    <div class="project-container">
      <h1>Editar Projeto</h1>
      <form @submit.prevent="handleEdit">
        <div>
          <label for="name">Nome:</label>
          <input type="text" v-model="project.name" required />
        </div>
        <div>
          <label for="description">Descrição:</label>
          <textarea 
            id="description" 
            v-model="project.description" 
            rows="5" 
            cols="40"
            placeholder="Descreva a atividade a ser executada...">
          </textarea>
        </div>
        <div>
          <label for="goals">Metas:</label>
          <textarea 
            id="goals" 
            v-model="project.goals" 
            rows="5" 
            cols="40"
            placeholder="Descreva as metas a serem atingidas...">
          </textarea>
        </div>
        <div>
          <label for="status">Status:</label>
          <select v-model="project.status" required>
              <option disabled value="">Selecione o status do projeto</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluído</option>
          </select>
        </div>
        <div>
          <label for="user_id">Personagem:</label>
          <select v-model="project.user_id" required>
            <option disabled value="">Selecione um personagem</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.hero_name }}
            </option>
          </select>
        </div>
        <button type="submit">Editar</button>
      </form>
      <button class="button-return" @click="goBack">Voltar</button>
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
const project = ref({
  name: '',
  description: '',
  goals: '',
  status: '',
  user_id: ''
})
const users = ref([])

onMounted(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/user/list", {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    if (response.ok) {
      const data = await response.json();
      users.value = data.users;
    } else {
      console.error("Erro ao carregar os Heróis");
    }
  } catch (error) {
    console.error("Erro de conexão com API", error);
  }
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

async function handleEdit() {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/project/${route.params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project.value)
    })

    if (response.ok) {
      router.push('/projetos')
    } else {
      console.error('Erro ao salvar projeto')
    }
  } catch (error) {
    console.error('Erro de conexão:', error)
  }
}

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

.project-container textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

.button-return {
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
