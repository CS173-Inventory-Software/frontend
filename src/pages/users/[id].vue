<template>
  <AppLayout>
    <h1 class="text-4xl font-bold mb-4 text-left"><template
        v-if="router.currentRoute.value.params.id > 0">Edit</template><template v-else>New</template> User</h1>

    <form @submit.prevent="submit">
      <fieldset :disabled="loading">
        <Card class="mb-4">
          <template #title>Information</template>
          <template #content>
            <div class="grid mb-4">

              <div class="field col-6 flex flex-column gap-2 mb-4">
                <label for="email">Email</label>
                <InputText id="email" v-model="form.email" :invalid="errors.email" />
                <Message v-if="errors.email" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.email.join('. ') }}
                </Message>
              </div>

              <div class="field col-6 flex flex-column gap-2 mb-4">
                <label for="type">Type</label>
                <Dropdown v-model="form.type" :options="userTypeOptions" option-label="label" option-value="id"
                  show-clear />
              </div>

            </div>
          </template>
          <template #footer>
            <div class="flex justify-content-end">
              <Button type="submit" class="text-center">Submit</Button>
            </div>
          </template>
        </Card>

      </fieldset>
    </form>

  </AppLayout>
</template>
<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import { ref, onMounted, getCurrentInstance } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';
import Message from 'primevue/message';

const router = useRouter();
const toast = useToast();

const form = ref({
  email: '',
  type: '',
});

const loading = ref(false);

const userTypeOptions = ref([]);

const errors = ref({});

const getUserTypes = async () => {
  const { data } = await axios.get('/user-types/');
  userTypeOptions.value = data.data;
};

const get = async () => {
  if (router.currentRoute.value.params.id) {
    const { data } = await axios.get(`/users/${router.currentRoute.value.params.id}`);
    form.value = data.data;
  }
};

const submit = async () => {
  loading.value = true;

  errors.value = {};

  const url = router.currentRoute.value.params.id > 0
    ? `/users/${router.currentRoute.value.params.id}/`
    : '/users/';
  const method = router.currentRoute.value.params.id > 0
    ? 'put'
    : 'post';

  try {
    const response = await axios.request({
      method,
      url,
      data: form.value,
    });

    if (response.status === 201) {
      router.push(`/users/${response.data.data}`);
    } else {
      await get();
    }

    toast.add({ severity: 'success', summary: 'Success', detail: 'User data saved successfully' });
  } catch (error) {
    if (error.response.status === 422) {
      errors.value = error.response.data.errors;
      toast.add({ severity: 'error', summary: 'Form Errors', detail: 'Invalid data' });
    } else if (error.response.status === 401) {
      toast.add({ severity: 'error', summary: 'Unauthorised', detail: 'You are not authorised to edit this data' });
    }
  }

  loading.value = false;
};

onMounted(async () => {
  await Promise.all([getUserTypes()]);
  get();
});
</script>
<style lang="scss">
.p-card {
  padding-top: 1.5rem;
  max-width: 1000px;
  margin: auto;
}

.p-float-label {
  margin-bottom: 1.5rem;
}

fieldset {
  border: 0;
}

.to-delete {
  background: hsl(0 50% 30% / 4);

  label {
    color: white;
  }

  .p-inputwrapper-filled,
  .p-inputwrapper-focus,
  .p-filled {
    &+label {
      color: white;
    }
  }
}
</style>