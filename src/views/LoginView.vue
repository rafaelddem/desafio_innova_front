<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Senha:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Entrar</button>
      </form>

      <button @click="goToRegister" class="register-btn">Cadastrar</button>

      <p v-if="errorMessage" style="color:red; margin-top:10px;">
      {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          this.errorMessage = "Credenciais inválidas.";
          return;
        }

        const data = await response.json();

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user.id", data.user.id);
        localStorage.setItem("user.username", data.user.username);
        localStorage.setItem("user.role", data.user.role);

        this.$router.push("/home");
      } catch (error) {
        this.errorMessage = "Erro de conexão com o servidor.";
        console.error(error);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    }
  }
};
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
.login-container button {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
}

.login-container input,
.login-container select {
  height: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
