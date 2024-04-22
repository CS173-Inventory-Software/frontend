import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', () => {
  const user = useStorage('user', {});

  function setUser(userData) {
    user.value = userData;
  }

  async function getUser() {
    try {
      const { data } = await axios.get('/get-user/');
      setUser(data);
    } catch (error) {
      console.error(error);
      setUser({});
    }
  }

  function isViewer() {
    return user.value?.role === 5;
  }

  function isClerk() {
    return user.value?.role === 4;
  }

  function isAdmin() {
    return user.value?.role === 3;
  }

  function isSuperAdmin() {
    return user.value?.role === 2;
  }

  function isRootAdmin() {
    return user.value?.role === 1;
  }

  function isAuthenticated() {
    // Check if user is an empty object
    return Object.keys(user.value).length > 0;
  }

  return {
    user,
    getUser,
    setUser,
    isAuthenticated,
    isViewer,
    isClerk,
    isAdmin,
    isSuperAdmin,
    isRootAdmin,
  };
});