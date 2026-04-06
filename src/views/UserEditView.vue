<template>
  <div class="user-edit-page">
    <div class="user-edit-container">
      <h1>Editar Usuário</h1>
      <form @submit.prevent="handleUpdate">
        <div>
          <label for="username">Nome:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" disabled />
        </div>
        <div>
          <label for="password">Senha:</label>
          <input type="password" v-model="password" />
        </div>
        <div>
          <label for="password_confirmation">Confirmação de Senha:</label>
          <input type="password" v-model="password_confirmation" />
        </div>
        <div>
          <label for="hero_id">Personagem:</label>
          <select v-model="hero_id" required>
            <option disabled value="">Selecione um personagem</option>
            <option v-for="item in heroes" :key="item.id" :value="item.id">
              {{ item.name }} - {{ item.origin.toUpperCase() }}
            </option>
          </select>
        </div>
        <div>
          <label for="role">Função:</label>
          <select v-model="role" disabled>
            <option disabled value="">Selecione uma função</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuário</option>
          </select>
        </div>
        <button type="submit">Editar</button>
      </form>

      <p v-if="successMessage" style="color:green; margin-top:10px;">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

const route = useRoute()
const auth = useAuthStore()
const id = ref(null)
const username = ref("")
const email = ref("")
const password = ref("")
const password_confirmation = ref("")
const hero_id = ref("")
const heroes = ref([])
const role = ref("")
const successMessage = ref("")
const errorMessage = ref("")

onMounted(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/heroes")
    if (response.ok) {
      const data = await response.json()
      heroes.value = data.heroes
    }
  } catch (error) {
    console.error("Erro ao carregar heroes", error)
  }

  try {
    let url = "http://127.0.0.1:8000/api/user/";

    url += (route.params && route.params.id) 
      ? `${route.params.id}`
      : `${localStorage.getItem("user.user_id")}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      id.value = data.user.id
      username.value = data.user.username
      email.value = data.user.email
      hero_id.value = data.user.hero_id
      role.value = data.user.role
    } else {
      console.error("Erro ao carregar usuário")
    }
  } catch (error) {
    console.error("Erro de conexão com API", error)
  }
})

async function handleUpdate() {
  try {
    let url = "http://127.0.0.1:8000/api/user/";

    url += (route.params && route.params.id) 
      ? `${route.params.id}`
      : `${localStorage.getItem("user.user_id")}`;

    console.log(url);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value || undefined,
        password_confirmation: password_confirmation.value || undefined,
        hero_id: hero_id.value,
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (errorData.message === "Validation Exception" && errorData.errors) {
        const firstError = Object.values(errorData.errors)[0][0]
        errorMessage.value = firstError
      } else {
        errorMessage.value = errorData.message || "Erro ao atualizar."
      }
      return
    }

    successMessage.value = "Usuário atualizado com sucesso!"
    errorMessage.value = ""

    password.value = ""
    password_confirmation.value = ""
  } catch (error) {
    errorMessage.value = "Erro de conexão com o servidor."
  }
}
</script>

<style scoped>
.user-edit-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.user-edit-container {
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-edit-container form div {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.user-edit-container label {
  margin-bottom: 5px;
  font-weight: bold;
}

.user-edit-container input {
  height: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-edit-container select {
  height: 40px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-edit-container button {
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