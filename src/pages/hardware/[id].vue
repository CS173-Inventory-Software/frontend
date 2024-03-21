<template>
  <AppLayout>
    <h1 class="text-4xl font-bold mb-4 text-left">New Hardware</h1>

    <form @submit.prevent="submit">
      <fieldset :disabled="loading">
        <Card class="mb-4">
          <template #title>Information</template>
          <template #content>
            <div class="grid mb-4">

              <div class="field col-12 flex flex-column gap-2 mb-4">
                <label for="name">Name</label>
                <InputText id="name" v-model="form.name" />
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="brand">Brand</label>
                <InputText id="brand" v-model="form.brand" />
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="type">Type</label>
                <InputText id="type" v-model="form.type" />
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="model_number">Model Number</label>
                <InputText id="model_number" v-model="form.model_number" />
              </div>

              <div class="field col-12 flex flex-column gap-2 mb-4 flex-grow-1">
                <label for="description">Description</label>
                <Textarea v-model="form.description" rows="5" id="description" />
              </div>

            </div>
          </template>
          <template #footer>
            <div class="flex justify-content-end">
              <Button type="submit" class="text-center">Submit</Button>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>
            <div class="flex flex-row">
              <div class="mr-4">Instances</div>
              <Button @click="addToOne2m('instances')"><i class="pi pi-plus"></i></Button>
            </div>
          </template>
          <template #content>
            <div v-for="(instance, index) in form.one2m.instances.data" :key="`instance-${index}`"
              class="mb-4 grid" :class="{
      'to-delete': isMarkedForDeletion(instance.id, 'instances'),
    }">
              <div class="field col-1 flex flex-column gap-2">
                <label>&nbsp;</label>
                <Button @click="form.one2m.instances.data.splice(index, 1)">
                  <i class="pi pi-trash"></i>
                </Button>
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="serial_number">Serial Number</label>
                <InputText id="serial_number" v-model="form.one2m.instances.data[index].serial_number" />
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="procurement_date">Procurement Date</label>
                <input name="procurement_date" id="procurement_date"
                  v-model="form.one2m.instances.data[index].procurement_date"
                  class="p-inputtext p-component" data-pc-name="inputtext" data-pc-section="root" type="date">
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="status">Status</label>
                <Dropdown v-model="form.one2m.instances.data[index].status" :options="statusOptions" optionLabel="label"
                  optionValue="id" show-clear />
              </div>
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
import { ref, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const form = ref({
  name: '',
  brand: '',
  type: '',
  model_number: '',
  description: '',

  one2m: {
    instances: {
      data: [{}],
      delete: [],
    },
  },
});

const statusOptions = ref([]);

const loading = ref(false);

const getStatus = async () => {
  const { data } = await axios.get('/status/');
  console.log(data.data);
  statusOptions.value = data.data;
};

// relations
const addToOne2m = (key) => {
  if (!(key in form.value.one2m)) form.value.one2m[key] = { data: [], delete: [] };
  form.value.one2m[key].data.push({});
};
const markForDeletion = (id, relation) => {
  const index = form.value.one2m[relation].delete.indexOf(id);
  if (index > -1) {
    form.value.one2m[relation].delete.splice(index, 1);
  } else {
    form.value.one2m[relation].delete.push(id);
  }
};
const isMarkedForDeletion = (id, relation) => {
  return form.value.one2m[relation].delete.includes(id);
};

const submit = async () => {
  loading.value = true;
  const response = await axios.post('/hardware/', form.value);

  if (response.status === 201) {
    router.push(`/hardware/${response.data.data}`);
  }

  loading.value = false;

  toast.add({ severity: 'success', summary: 'Success', detail: 'Hardware data saved successfully' });
};

onMounted(() => {
  getStatus();
});
</script>
<style lang="scss">
.p-card {
  padding-top: 1.5rem;
  max-width: 900px;
  margin: auto;
}

.p-float-label {
  margin-bottom: 1.5rem;
}
</style>