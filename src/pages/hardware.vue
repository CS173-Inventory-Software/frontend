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
        v-model:filters="filters"
        filterDisplay="row">
        <Column field="id" header="ID" sortable>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by id" />
          </template>
        </Column>
        <Column field="name" header="Name" sortable>

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by name" />
          </template>
        </Column>
        <Column field="brand" header="Brand" sortable>

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by brand" />
          </template>
        </Column>
        <Column field="type" header="Type" sortable>

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by type" />
          </template>
        </Column>
        <Column field="serial_number" header="Serial Number" sortable>

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by serial number" />
          </template>
        </Column>
        <Column field="procurement_date" header="Procurement Date" sortable>
          <!-- TODO: Fix -->

          <template #filter="{ filterModel }">
            <Calendar v-model="filterModel.value" dateFormat="yy-mm-dd" placeholder="yyyy-mm-dd" mask="9999/99/99" />
          </template>
        </Column>
        <Column field="version_number" header="Version Number" sortable>

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by version number" />
          </template>
        </Column>
        <Column field="quantity" header="Quantity" sortable>

          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
              placeholder="Search by quantity" />
          </template>
        </Column>
        <Column field="status" header="Status" sortable>
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

const entities = ref([]);

const loading = ref(false);

const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  brand: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  serial_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  procurement_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
  version_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  quantity: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
});

const statuses = ref(['Available', 'Assigned', 'Unavailable', 'Condemned', 'For Repair']);

const getData = async () => {
  loading.value = true;
  const response = await axios.get('/hardware/');
  entities.value = response.data.data;
  loading.value = false;
};

onMounted(() => {
  getData();
});

</script>
