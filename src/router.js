import { createRouter, createWebHistory } from 'vue-router/auto';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(),
  // You don't need to pass the routes anymore,
  // the plugin writes it for you 🤖
});


router.beforeEach(async (to, from) => {
  const store = useUserStore();
  console.log(to, from);

  // Check if the user is authenticated
  if (to.name !== '/Login' && !store.isAuthenticated()) {
    return '/login';
  }

  if (to.name === '/Login' && store.isAuthenticated()) {
    return '/';
  }

  return true;
});

export default router;