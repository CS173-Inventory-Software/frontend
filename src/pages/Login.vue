<template>
  <form @submit.prevent="login">
    <Card style="width: 25rem; overflow: hidden">
      <template #title>Login</template>

      <template #content>
        <div class="flex flex-column gap-2">
          <InputText v-model="form.email" placeholder="Email" />
          <div class="flex flex-row">
            <InputText v-model="form.code" placeholder="Code" class="flex-grow-1" id="code-input" />
            <Button :label="requestCodeText" :disabled="!form.email || timer > 0 || sendingCode" id="code-send-button"
              @click="requestCode" />

          </div>
        </div>

      </template>

      <template #footer>
        <div class="flex gap-3 mt-1">

          <Button label="Login" class="w-full" type="submit" :disabled="!(form.email && form.code)" />
        </div>
      </template>
    </Card>
  </form>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useToast } from 'primevue/usetoast';

const store = useUserStore();

const toast = useToast();

const form = ref({
  email: '',
  code: '',
});

const timer = ref(0);

const sendingCode = ref(false);

const requestCodeText = computed(() => {
  if (sendingCode.value) {
    return "Sending...";
  }
  if (timer.value > 0) {
    return `${timer.value}s`;
  }
  return 'Send';
});

const requestCode = async () => {
  const { email } = form.value;
  await axios.post('/request-code/', { email });
  timer.value = 60;
  const interval = setInterval(() => {
    timer.value--;
    if (timer.value === 0) {
      clearInterval(interval);
    }
  }, 1000);
  toast.add({ severity: 'success', summary: 'Code sent', detail: 'Check your email' });
};

const login = async () => {
  const { email, code } = form.value;
  const { data } = await axios.post('/login/', { email, code });
  window.axios.defaults.headers.common['Authorization'] = `Token ${data.token}`;

  getUserData();
};

const getUserData = async () => {
  const { data } = await axios.get('/get-user/');
  store.setUser(data);
};
</script>

<style>
#code-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

#code-send-button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>