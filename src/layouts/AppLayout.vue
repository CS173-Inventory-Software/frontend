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
  </Menubar>
  <main class="container">
    <slot></slot>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';

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
    label: 'Users',
    icon: 'pi pi-user',
    route: '/users',
  },
]);
</script>