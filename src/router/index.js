import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import EditUserView from '@/views/EditUserView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import ProjectDetailsView from '@/views/ProjectDetailsView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastrar', name: 'Register', component: RegisterView },
  { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/editar', name: 'Edit', component: EditUserView, meta: { requiresAuth: true } },
  { path: '/projetos', name: 'Project', component: ProjectListView, meta: { requiresAuth: true } },
  { path: '/projetos/:id', name: 'ProjectDetails', component: ProjectDetailsView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return '/home'
  }

  return true
})

export default router