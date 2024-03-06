<script setup>
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
import { useUserStore } from '@/stores/user';
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useUserStore();

onMounted(async () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
  }

  await store.getUser();

  if (!store.isAuthenticated) {
    router.push('/login');
  }
});

// Attempt to retrieve the user from 

</script>

<template>
  <RouterView />
  <Toast />
</template>

<style lang="scss">
/* Sizing */
html,
body {
  height: 100%;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  main {
    flex-grow: 1;
  }
}


.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
