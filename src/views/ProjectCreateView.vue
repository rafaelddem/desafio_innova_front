<template>
  <div class="project-page">
    <div class="project-container">
      <h1>Cadastrar Projeto</h1>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="name">Nome:</label>
          <input type="text" v-model="name" required />
        </div>
        <div>
          <label for="description">Descrição:</label>
          <textarea 
            id="description" 
            v-model="description" 
            rows="5" 
            cols="40"
            placeholder="Descreva a atividade a ser executada...">
          </textarea>
        </div>
        <div>
          <label for="goals">Metas:</label>
          <textarea 
            id="goals" 
            v-model="goals" 
            rows="5" 
            cols="40"
            placeholder="Descreva as metas a serem atingidas...">
          </textarea>
        </div>
        <div>
          <label for="status">Status:</label>
          <select v-model="status" required>
              <option disabled value="">Selecione o status do projeto</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluído</option>
          </select>
        </div>
        <div>
          <label for="user_id">Personagem:</label>
          <select v-model="user_id" required>
            <option disabled value="">Selecione um personagem</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.hero_name }}
            </option>
          </select>
        </div>
        <button type="submit">Cadastrar</button>
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

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: "ProjectCreateView",
  data() {
    return {
      name: "",
      description: "",
      goals: "",
      status: "",
      user_id: "",
      users: [],
      successMessage: "",
      errorMessage: ""
    };
  },
  async mounted() {
    try {
      const auth = useAuthStore()
      const response = await fetch("http://127.0.0.1:8000/api/user/list", {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      if (response.ok) {
        const data = await response.json();
        this.users = data.users;
      } else {
        console.error("Erro ao carregar os Heróis");
      }
    } catch (error) {
      console.error("Erro de conexão com API", error);
    }
  },

  methods: {
    async handleRegister() {
      try {
        const auth = useAuthStore()
        const response = await fetch("http://127.0.0.1:8000/api/project", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            name: this.name,
            description: this.description,
            goals: this.goals,
            status: this.status,
            user_id: this.user_id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Validation Exception" && errorData.errors) {
              const firstError = Object.values(errorData.errors)[0][0];
              this.errorMessage = firstError;
          } else {
              this.errorMessage = errorData.message || "Erro ao cadastrar.";
          }
          return;
        }

        this.successMessage = "Usuário cadastrado com sucesso!";
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage = "Erro de conexão com o servidor.";
      }
    }
  }
};
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

.register-btn {
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>