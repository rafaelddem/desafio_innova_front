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

<script>
export default {
  name: "EditUserView",
  data() {
    return {
      id: null,
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      hero_id: "",
      heroes: [],
      role: "",
      successMessage: "",
      errorMessage: ""
    };
  },
  async mounted() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/heroes");
      if (response.ok) {
        const data = await response.json();
        this.heroes = data.heroes;
      }
    } catch (error) {
      console.error("Erro ao carregar heroes", error);
    }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      this.id = data.user.id;
      this.username = data.user.username;
      this.email = data.user.email;
      this.hero_id = data.user.hero_id;
      this.role = data.user.role;
    } else {
      console.error("Erro ao carregar usuário");
    }
  } catch (error) {
    console.error("Erro de conexão com API", error);
  }

  },
  methods: {
    async handleUpdate() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password || undefined,
            password_confirmation: this.password_confirmation || undefined,
            hero_id: this.hero_id,
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Validation Exception" && errorData.errors) {
            const firstError = Object.values(errorData.errors)[0][0];
            this.errorMessage = firstError;
          } else {
            this.errorMessage = errorData.message || "Erro ao atualizar.";
          }
          return;
        }

        this.successMessage = "Usuário atualizado com sucesso!";
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage = "Erro de conexão com o servidor.";
      }
    }
  }
};
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