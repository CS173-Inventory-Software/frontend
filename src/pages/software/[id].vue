<template>
  <AppLayout>
    <h1 class="text-4xl font-bold mb-4 text-left"><template
        v-if="router.currentRoute.value.params.id > 0">Edit</template><template v-else>New</template> Software</h1>

    <form @submit.prevent="submit">
      <fieldset :disabled="loading">
        <Card class="mb-4">
          <template #title>Information</template>
          <template #content>
            <div class="grid mb-4">

              <div class="field col-12 flex flex-column gap-2 mb-4">
                <label for="name">Name</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" id="name"
                  v-model="form.name" />
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="brand">Brand</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" id="brand"
                  v-model="form.brand" />
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="model_number">Version Number</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  id="model_number" v-model="form.version_number" />
              </div>

              <div class="field col-4 flex flex-column gap-2 mb-4">
                <label for="expiration_date">Expiration Date</label>
                <input :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  name="expiration_date" id="expiration_date"
                  v-model="form.expiration_date"
                  class="p-inputtext p-component" data-pc-name="inputtext" data-pc-section="root" type="date">
              </div>

              <div class="field col-12 flex flex-column gap-2 mb-4 flex-grow-1">
                <label for="description">Description</label>
                <Textarea :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  v-model="form.description" rows="5" id="description" />
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

        <Card class="mb-4">
          <template #title>
            <div class="flex flex-row">
              <div class="mr-4">Instances</div>
              <Button v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()"
                @click="addToOne2m('instances')"><i class="pi pi-plus"></i></Button>
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
                  <Button v-if="instance.software && !isMarkedForDeletion(instance.id, 'instances')"
                    @click="markForDeletion(instance.id, 'instances')">
                    <i class="pi pi-trash"></i>
                  </Button>
                  <Button v-else-if="instance.software && isMarkedForDeletion(instance.id, 'instances')"
                    @click="markForDeletion(instance.id, 'instances')">
                    <i class="pi pi-undo"></i>
                  </Button>
                  <!-- New, uncommitted instances -->
                  <Button v-else @click="form.one2m.instances.data.splice(index, 1)">
                    <i class="pi pi-trash"></i>
                  </Button>
                </template>
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="serial_key">Serial Key</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" id="serial_key"
                  v-model="form.one2m.instances.data[index].serial_key" />
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="status">Status</label>
                <Dropdown v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()"
                  v-model="form.one2m.instances.data[index].status" :options="statusOptions" option-label="label"
                  option-value="id" show-clear />
                <InputText v-else readonly :value="form.one2m.instances.data[index].status_formula"
                  :id="`status-${index}`" />
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="assignee">Assignee</label>
                <Dropdown v-model="form.one2m.instances.data[index].assignee" :options="userOptions"
                  option-label="email"
                  option-value="id" show-clear />
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>
            <div class="flex flex-row">
              <div class="mr-4">Subscriptions</div>
              <Button v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()"
                @click="addToOne2m('subscriptions')"><i class="pi pi-plus"></i></Button>
            </div>
          </template>
          <template #content>
            <div v-for="(subscription, index) in form.one2m.subscriptions.data" :key="`subscription-${index}`"
              class="mb-4 grid" :class="{
                'to-delete': isMarkedForDeletion(subscription.id, 'subscriptions'),
              }">
              <div class="field col-1 flex flex-column gap-2">
                <label>&nbsp;</label>
                <template v-if="store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin()">
                  <!-- Existing subscriptions -->
                  <Button v-if="subscription.software && !isMarkedForDeletion(subscription.id, 'subscriptions')"
                    @click="markForDeletion(subscription.id, 'subscriptions')">
                    <i class="pi pi-trash"></i>
                  </Button>
                  <Button v-else-if="subscription.software && isMarkedForDeletion(subscription.id, 'subscriptions')"
                    @click="markForDeletion(subscription.id, 'subscriptions')">
                    <i class="pi pi-undo"></i>
                  </Button>
                  <!-- New, uncommitted subscriptions -->
                  <Button v-else @click="form.one2m.subscriptions.data.splice(index, 1)">
                    <i class="pi pi-trash"></i>
                  </Button>
                </template>
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="start">Start Date</label>
                <input :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" name="start"
                  id="start"
                  v-model="form.one2m.subscriptions.data[index].start" class="p-inputtext p-component"
                  data-pc-name="inputtext"
                  data-pc-section="root" type="date">
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="end">End Date</label>
                <input :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())" name="end" id="end"
                  v-model="form.one2m.subscriptions.data[index].end" class="p-inputtext p-component"
                  data-pc-name="inputtext"
                  data-pc-section="root" type="date">
              </div>

              <div class="field col-3 flex flex-column gap-2 mb-4">
                <label for="number_of_licenses"># Of Licenses</label>
                <InputText :readonly="!(store.isAdmin() || store.isSuperAdmin() || store.isRootAdmin())"
                  id="number_of_licenses"
                  v-model="form.one2m.subscriptions.data[index].number_of_licenses" />
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
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import { ref, onMounted, getCurrentInstance } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const router = useRouter();
const toast = useToast();

const form = ref({
  name: '',
  brand: '',
  version_number: '',
  description: '',

  one2m: {
    instances: {},
    subscriptions: {},
  },
});

const statusOptions = ref([]);
const userOptions = ref([]);

const loading = ref(false);

const getStatus = async () => {
  const { data } = await axios.get('/status/');
  statusOptions.value = data.data;
};

const getUsers = async () => {
  const { data } = await axios.get('/users/?search=%7B%7D');
  userOptions.value = data.data;
};

const get = async () => {
  if (router.currentRoute.value.params.id) {
    const { data } = await axios.get(`/software/${router.currentRoute.value.params.id}`);
    form.value = data.data;
  }

  if (!('data' in form.value.one2m.instances)) {
    form.value.one2m.instances.data = [{}];
  }

  if (!('delete' in form.value.one2m.instances)) {
    form.value.one2m.instances.delete = [];
  }

  if (!('data' in form.value.one2m.subscriptions)) {
    form.value.one2m.subscriptions.data = [{}];
  }

  if (!('delete' in form.value.one2m.subscriptions)) {
    form.value.one2m.subscriptions.delete = [];
  }
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
    ? `/software/${router.currentRoute.value.params.id}/`
    : '/software/';
  const method = router.currentRoute.value.params.id > 0
    ? 'put'
    : 'post';

  const response = await axios.request({
    method,
    url,
    data: form.value,
  });

  if (response.status === 201) {
    router.push(`/software/${response.data.data}`);
  } else {
    await get();
  }

  loading.value = false;

  toast.add({ severity: 'success', summary: 'Success', detail: 'Software data saved successfully' });
};

onMounted(async () => {
  await Promise.all([getStatus(), getUsers()]);
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