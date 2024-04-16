<template>
  <AppLayout>
    <div class="flex flex-column items-center">
      <h1 class="text-4xl font-bold mb-4 text-left">Users</h1>

      <DataTable :value="entities"
        paginator
        paginator-position="both"
        :rows="search.rows"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        removable-sort
        data-key="id"
        row-hover
        :loading="loading"
        show-grid-lines
        v-model:filters="search.filters"
        filterDisplay="menu"
        :total-records="search.totalRecords"
        @sort="sort"
        @page="page"
        @filter="filter"
        lazy>
        <template #empty> No data. </template>
        <template #loading> Loading data. Please wait. </template>
        <template #header>
          <div class="flex justify-content-end">
            <router-link to="/users/0">
              <Button>
                Create New User
              </Button>
            </router-link>
          </div>
        </template>
        <Column field="id" header="ID">
        </Column>
        <Column field="email" header="Email" sortable :show-filter-operator="false" :show-filter-match-modes="false"
          :show-add-button="false">
          <template #body="{ data }">
            <router-link :to="`/users/${data.id}`">{{ data.email }}</router-link>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by email" />
          </template>
        </Column>
        <Column field="type_formula" header="Role" sortable :show-filter-operator="false"
          :show-filter-match-modes="false"
          :show-add-button="false">
          <!-- TODO: Fix -->

          <template #filter="{ filterModel }">
            <Dropdown v-model="filterModel.value" :options="types" placeholder="Select One" class="p-column-filter"
              showClear>
              <template #option="slotProps">
                <Tag :value="slotProps.option" />
              </template>
            </Dropdown>
          </template>
        </Column>
      </DataTable>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import { debounce } from 'lodash';
import Button from 'primevue/button';
const entities = ref([]);
const loading = ref(false);

const search = ref({
  totalRecords: 0,
  filters: {
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    type_formula: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  },
  rows: 10,
  sortField: null,
  sortOrder: -1,
  page: 0
});


const sort = (event) => {
  search.value.sortField = event.sortField;
  search.value.sortOrder = event.sortOrder;

  getData();
};

const filter = (event) => {
  search.value.page = 0;

  getData();
};

const page = (event) => {
  search.value.page = event.page;
  search.value.rows = event.rows;

  getData();
};

const types = ref(['Super Admin', 'Admin', 'Inventory Clerk', 'Viewer']);

const getData = debounce(async () => {
  loading.value = true;
  const response = await axios.get('/users/', {
    params: {
      search:
        JSON.stringify({
          page: search.value.page,
          rows: search.value.rows,
          sortField: search.value.sortField,
          sortOrder: search.value.sortOrder,
          filters: search.value.filters
        })
    }
  });
  entities.value = response.data.data;
  search.value.totalRecords = response.data.totalRecords;
  loading.value = false;
}, 500);

onMounted(() => {
  getData();
});


</script>
<style>
.p-paginator {
  border-radius: 0;
}
</style>