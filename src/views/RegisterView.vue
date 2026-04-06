<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Cadastrar Usuário</h1>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="username">Nome:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Senha:</label>
          <input type="password" v-model="password" required />
        </div>
        <div>
          <label for="password_confirmation">Confirmação de Senha:</label>
          <input type="password" v-model="password_confirmation" required />
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
          <select v-model="role" required>
              <option disabled value="">Selecione uma função</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuário</option>
          </select>
        </div>
        <button type="submit">Cadastrar</button>
      </form>

      <button v-if="auth.token == null" @click="goToLogin" class="register-btn">Login</button>

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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const hero_id = ref("");
const heroes = ref([]);
const role = ref("");
const successMessage = ref("");
const errorMessage = ref("");

onMounted(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/heroes");
    if (response.ok) {
      const data = await response.json();
      heroes.value = data.heroes;
    } else {
      console.error("Erro ao carregar os Heróis");
    }
  } catch (error) {
    console.error("Erro de conexão com API", error);
  }
});

async function handleRegister() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
        hero_id: hero_id.value,
        role: role.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Validation Exception" && errorData.errors) {
        const firstError = Object.values(errorData.errors)[0][0];
        errorMessage.value = firstError;
      } else {
        errorMessage.value = errorData.message || "Erro ao cadastrar.";
      }
      return;
    }

    successMessage.value = "Usuário cadastrado com sucesso!";
    errorMessage.value = "";username.value = "";
    email.value = "";
    password.value = "";
    password_confirmation.value = "";
    hero_id.value = "";
    role.value = "";
  } catch (error) {
    errorMessage.value = "Erro de conexão com o servidor.";
  }
}

function goToLogin() {
  router.push("/login");
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.login-container form div {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.login-container label {
  margin-bottom: 5px;
  font-weight: bold;
}

.login-container input {
  height: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container select {
  height: 40px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container button {
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