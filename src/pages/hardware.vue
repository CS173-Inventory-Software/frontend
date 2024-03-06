<template>
  <AppLayout>
    <div class="flex flex-column items-center">
      <h1 class="text-4xl font-bold mb-4 text-left">Hardware</h1>

      <DataTable :value="entities">
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="brand" header="Brand"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="serial_number" header="Serial Number"></Column>
        <Column field="procurement_date" header="Procurement Date"></Column>
        <Column field="version_number" header="Version Number"></Column>
        <Column field="quantity" header="Quantity"></Column>
        <Column field="status" header="Status"></Column>
      </DataTable>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const entities = ref([]);

const getData = async () => {
  const response = await axios.get('/hardware/');
  entities.value = response.data.data;
};

onMounted(() => {
  getData();
});

</script>
