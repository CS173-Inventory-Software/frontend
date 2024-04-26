<template>
  <Menubar :model="menuItems">
    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
      </a>
    </template>
    <template #end>
      <button @click="logout" class="p-button p-button-text">
        <i class="pi pi-power-off" />
        <span class="ml-2">Logout</span>
      </button>
    </template>
  </Menubar>
  <main class="container">
    <slot></slot>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const store = useUserStore();

const logout = async () => {
  document.cookie = "";
  store.setUser({});
  await axios.post('/logout/');
  window.axios.defaults.headers.common['Authorization'] = null;
  router.push('/login');
};

const menuItems = ref([
  {
    label: 'Reports',
    icon: 'pi pi-file',
    route: '/'
  },
  {
    label: 'Hardware',
    icon: 'pi pi-desktop',
    route: '/hardware',
  },
  {
    label: 'Software',
    icon: 'pi pi-cloud',
    route: '/software'
  },
  {
    label: 'Assigned',
    icon: 'pi pi-clipboard',
    route: '/equipment'
  },
]);

if (store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()) {
  menuItems.value.push({
    label: 'Users',
    icon: 'pi pi-user',
    route: '/users',
  });
}
</script>