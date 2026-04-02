<template>
  <div class="home-container">
    <h1>Bem-vindo à Home!</h1>
    <p>Você está logado com sucesso.</p>
    <button @click="logout">Sair</button>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}
</style>