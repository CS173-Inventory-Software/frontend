<template>
  <AppLayout>
    <div class="flex flex-column items-center">
      <h1 class="text-4xl font-bold mb-4 text-left">Hardware</h1>

      <DataTable :value="entities"
        paginator
        paginator-position="both"
        :rows="5"
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
        <Column field="id" header="ID">
        </Column>
        <Column field="name" header="Name" sortable :show-filter-operator="false" :show-filter-match-modes="false"
          :show-add-button="false">

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by name" />
          </template>
        </Column>
        <Column field="brand" header="Brand" sortable :show-filter-operator="false" :show-filter-match-modes="false"
          :show-add-button="false">

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by brand" />
          </template>
        </Column>
        <Column field="type" header="Type" sortable :show-filter-operator="false" :show-filter-match-modes="false"
          :show-add-button="false">

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by type" />
          </template>
        </Column>
        <Column field="serial_number" header="Serial Number" sortable :show-filter-operator="false"
          :show-filter-match-modes="false" :show-add-button="false">

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by serial number" />
          </template>
        </Column>
        <Column field="procurement_date" header="Procurement Date" sortable data-type="date"
          :show-filter-operator="false">
          <!-- TODO: Fix -->

          <template #filter="{ filterModel }">
            <Calendar v-model="filterModel.value" dateFormat="yy-mm-dd" placeholder="yyyy-mm-dd" mask="9999/99/99" />
          </template>
        </Column>
        <Column field="version_number" header="Version Number" sortable :show-filter-operator="false"
          :show-filter-match-modes="false" :show-add-button="false">

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by version number" />
          </template>
        </Column>
        <Column field="quantity" header="Quantity" sortable :show-filter-operator="false"
          :show-filter-match-modes="false" :show-add-button="false">

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by quantity" />
          </template>
        </Column>
        <Column field="status" header="Status" sortable :show-filter-operator="false" :show-filter-match-modes="false"
          :show-add-button="false">
          <!-- TODO: Fix -->

          <template #filter="{ filterModel }">
            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Select One" class="p-column-filter"
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

const entities = ref([]);

const loading = ref(false);

const search = ref({
  totalRecords: 0,
  filters: {
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    serial_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    procurement_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    version_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    quantity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  },
  rows: 5,
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
  console.log(event);
  search.value.page = 0;

  getData();
};

const page = (event) => {
  search.value.page = event.page;

  getData();
};

const statuses = ref(['Available', 'Assigned', 'Unavailable', 'Condemned', 'For Repair']);

const getData = debounce(async () => {
  loading.value = true;
  const response = await axios.get('/hardware/', {
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
