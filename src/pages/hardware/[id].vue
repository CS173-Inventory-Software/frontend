<template>
  <AppLayout>
    <h1 class="text-4xl font-bold mb-4 text-left"><template
        v-if="router.currentRoute.value.params.id > 0">Edit</template><template v-else>New</template> Hardware</h1>

    <form @submit.prevent="submit">
      <fieldset :disabled="loading">
        <Card class="mb-4">
          <template #title>Information</template>
          <template #content>
            <div class="grid mb-4">

              <div class="field col-12 flex flex-column gap-2 mb-4">
                <label for="name">Name</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" id="name"
                  v-model="form.name" :invalid="errors.name" />
                <Message v-if="errors.name" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.name.join('. ') }}
                </Message>
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="brand">Brand</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" id="brand"
                  v-model="form.brand" :invalid="errors.brand" />
                <Message v-if="errors.brand" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.brand.join('. ') }}
                </Message>
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="type">Type</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" id="type"
                  v-model="form.type" :invalid="errors.type" />
                <Message v-if="errors.type" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.type.join('. ') }}
                </Message>
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="model_number">Model Number</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  id="model_number"
                  v-model="form.model_number" :invalid="errors.model_number" />
                <Message v-if="errors.model_number" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.model_number.join('. ') }}
                </Message>

              </div>

              <div class="field col-12 flex flex-column gap-2 mb-4 flex-grow-1">
                <label for="description">Description</label>
                <Textarea :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  v-model="form.description" rows="5" id="description" :invalid="errors.description" />
                <Message v-if="errors.description" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.description.join('. ') }}
                </Message>
              </div>

              <div class="field col-12 flex flex-column gap-2 mb-4">
                <label for="for_deletion">For Deletion</label>
                <InputSwitch id="for_deletion"
                  :readonly="!(store.isClerk() || store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  v-model="form.for_deletion" />
              </div>

            </div>
          </template>
          <template #footer>
            <div class="flex justify-content-end">
              <Button v-if="store.isClerk() || store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()"
                type="submit" class="text-center">Submit</Button>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>
            <div class="flex flex-row">
              <div class="mr-4">Instances</div>
              <Button v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()"
                @click="addToOne2m('instances')" class="instance-add-button"><i class="pi pi-plus"></i></Button>
            </div>
          </template>
          <template #content>
            <div v-for="(instance, index) in form.one2m.instances.data" :key="`instance-${index}`"
              class="mb-4 grid" :class="{
                'to-delete': isMarkedForDeletion(instance.id, 'instances'),
              }">
              <div class="field col-1 flex flex-column gap-2">
                <label>&nbsp;</label>
                <template v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()">
                  <!-- Existing instances -->
                  <Button v-if="instance.hardware && !isMarkedForDeletion(instance.id, 'instances')"
                    @click="markForDeletion(instance.id, 'instances')" class="instance-delete-button">
                    <i class="pi pi-trash"></i>
                  </Button>
                  <Button v-else-if="instance.hardware && isMarkedForDeletion(instance.id, 'instances')"
                    @click="markForDeletion(instance.id, 'instances')" class="instance-delete-button">
                    <i class="pi pi-undo"></i>
                  </Button>
                  <!-- New, uncommitted instances -->
                  <Button v-else @click="form.one2m.instances.data.splice(index, 1)" class="instance-delete-button">
                    <i class="pi pi-trash"></i>
                  </Button>
                </template>
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="serial_number">Serial Number</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  :id="`serial_number-${index}`" v-model="form.one2m.instances.data[index].serial_number"
                  :invalid="errors.instances[index]?.serial_number" />
                <Message v-if="errors.instances[index]?.serial_number" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.instances[index].serial_number.join('. ') }}
                </Message>

              </div>

              <div class="field col-2 flex flex-column gap-2 mb-4">
                <label for="procurement_date">Procurement Date</label>
                <input :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  name="procurement_date"
                  :id="`procurement_date-${index}`" v-model="form.one2m.instances.data[index].procurement_date"
                  class="p-inputtext p-component" data-pc-name="inputtext" data-pc-section="root" type="date"
                  :class="{ 'p-invalid': errors.instances[index]?.procurement_date }">
                <Message v-if="errors.instances[index]?.procurement_date" severity="error" :closable="false">
                  <template #messageicon>
                    &nbsp;
                  </template>
                  {{ errors.instances[index].procurement_date.join('. ') }}
                </Message>
              </div>

              <div class="field col-2 flex flex-column gap-2 mb-4">
                <label for="status">Status</label>
                <Dropdown v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()"
                  v-model="form.one2m.instances.data[index].status" :options="statusOptions" option-label="label"
                  option-value="id" show-clear :id="`status-${index}`" />
                <InputText v-else readonly :value="form.one2m.instances.data[index].status_formula"
                  :id="`status-${index}`" />
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="assignee">Assignee</label>
                <Dropdown v-model="form.one2m.instances.data[index].assignee" :options="userOptions"
                  option-label="email"
                  option-value="id" show-clear :id="`assignee-${index}`" />
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
import InputSwitch from 'primevue/inputswitch';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import { ref, onMounted, getCurrentInstance } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '../../stores/user';
import Message from 'primevue/message';

const router = useRouter();
const toast = useToast();
const store = useUserStore();

const form = ref({
  name: '',
  brand: '',
  type: '',
  model_number: '',
  description: '',

  one2m: {
    instances: {}
  },
});

const statusOptions = ref([]);
const userOptions = ref([]);

const loading = ref(false);

const errors = ref({});

const getStatus = async () => {
  const { data } = await axios.get('/status/');
  statusOptions.value = data.data;
};

const getUsers = async () => {
  const { data } = await axios.get('/users/?search=%7B%7D');
  userOptions.value = data.data;
};

const get = async () => {
  loading.value = true;

  if (router.currentRoute.value.params.id > 0) {
    const { data } = await axios.get(`/hardware/${router.currentRoute.value.params.id}`);
    form.value = data.data;
  }

  if (!('data' in form.value.one2m.instances)) {
    form.value.one2m.instances.data = [{}];
  }

  if (!('delete' in form.value.one2m.instances)) {
    form.value.one2m.instances.delete = [];
  }

  loading.value = false;
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
  return form.value.one2m[relation]?.delete?.includes(id);
};

const submit = async () => {
  if (!(store.isClerk() || store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())) {
    return;
  }

  loading.value = true;
  const url = router.currentRoute.value.params.id > 0
    ? `/hardware/${router.currentRoute.value.params.id}/`
    : '/hardware/';
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
      router.push(`/hardware/${response.data.data}`);
    } else {
      await get();
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Hardware data saved successfully' });
  } catch (error) {
    if (error.response.status === 422) {
      errors.value = error.response.data.errors;
      toast.add({ severity: 'error', summary: 'Form Errors', detail: 'Invalid data' });
    }
  }
  loading.value = false;

};

onMounted(async () => {
  await Promise.all([getStatus(), getUsers()]);
  get();
});
</script>
<style lang="scss">
.p-card {
  padding-top: 1.5rem;
  max-width: 1200px;
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