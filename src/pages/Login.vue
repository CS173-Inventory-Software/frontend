<template>
  <form @submit.prevent="login">
    <Card style="width: 25rem; overflow: hidden">
      <template #title>Login</template>

      <template #subtitle>Card subtitle</template>

      <template #content>
        <div class="flex flex-col gap-2">
          <InputText v-model="form.email" placeholder="Email" />
          <InputText v-model="form.code" placeholder="Code" />
        </div>

      </template>

      <template #footer>
        <div class="flex gap-3 mt-1">
          <Button label="Send Code" class="w-full me-2" @click="requestCode" />
          <Button label="Login" class="w-full" type="submit" />
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
import { ref } from 'vue';

const form = ref({
  email: '',
  code: '',
});

const requestCode = async () => {
  const { email } = form.value;
  const { data } = await axios.post('/request-code/', { email });
};

const login = async () => {
  const { email, code } = form.value;
  const { data } = await axios.post('/login/', { email, code });
  window.axios.defaults.headers.common['Authorization'] = `Token ${data.token}`;
};
</script>