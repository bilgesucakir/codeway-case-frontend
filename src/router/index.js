import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import Home from '@/views/ConfigurationPanel.vue';

const routes = [
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/signup', name: 'SignUp',component: SignUp },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/signin');
  } else {
    next();
  }
});


export default router;
