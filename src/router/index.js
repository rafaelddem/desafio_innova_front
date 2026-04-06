import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import EditUserView from '@/views/EditUserView.vue'
import ProjectCreateView from '@/views/ProjectCreateView.vue'
import ProjectListView from '@/views/ProjectListView.vue'
import ProjectEditView from '@/views/ProjectEditView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastrar', name: 'Register', component: RegisterView },
  { path: '/editar', name: 'Edit', component: EditUserView, meta: { requiresAuth: true } },
  { path: '/projeto', name: 'ProjectCreate', component: ProjectCreateView, meta: { requiresAuth: true } },
  { path: '/projetos', name: 'ProjectList', component: ProjectListView, meta: { requiresAuth: true } },
  { path: '/projetos/:id', name: 'ProjectDetails', component: ProjectEditView, meta: { requiresAuth: true } }
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
    return '/projetos'
  }

  return true
})

export default router