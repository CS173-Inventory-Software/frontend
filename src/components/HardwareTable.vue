<template>
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
      <div class="flex justify-content-end gap-2">
        <SplitButton @click="downloadJSON(false)" :model="downloadButtonsJSON">
          Download JSON
        </SplitButton>
        <SplitButton @click="downloadCSV(false)" :model="downloadButtonsCSV">
          Download CSV
        </SplitButton>
      </div>
    </template>
    <Column field="id" header="ID">
    </Column>
    <Column field="hardware_name" header="Name" sortable :show-filter-operator="false" :show-filter-match-modes="false"
      :show-add-button="false">
      <template #body="{ data }">
        <router-link :to="`/hardware/${data.hardware}`">{{ data.hardware_name }}</router-link>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by name" />
      </template>
    </Column>
    <Column field="hardware_brand" header="Brand" sortable :show-filter-operator="false"
      :show-filter-match-modes="false"
      :show-add-button="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by brand" />
      </template>
    </Column>
    <Column field="hardware_type" header="Type" sortable :show-filter-operator="false" :show-filter-match-modes="false"
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
    <Column field="procurement_date" header="Procurement Date" sortable data-type="date" :show-filter-operator="false">
      <!-- TODO: Fix -->

      <template #filter="{ filterModel }">
        <input v-model="filterModel.value" class="p-inputtext p-component" data-pc-name="inputtext"
          data-pc-section="root" type="date">
      </template>
    </Column>
    <Column field="hardware_model_number" header="Model Number" sortable :show-filter-operator="false"
      :show-filter-match-modes="false" :show-add-button="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by model number" />
      </template>
    </Column>
    <Column field="status_formula" header="Status" sortable :show-filter-operator="false"
      :show-filter-match-modes="false"
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
    <Column field="assignee_formula" header="Assignee" sortable :show-filter-operator="false"
      :show-filter-match-modes="false" :show-add-button="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by assignee" />
      </template>
    </Column>
  </DataTable>
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
import SplitButton from 'primevue/splitbutton';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const props = defineProps({
  source: {
    type: String,
    required: true
  },
  downloadName: {
    type: String,
    default: 'hardware'
  }
});

const entities = ref([]);

const loading = ref(false);

const search = ref({
  totalRecords: 0,
  filters: {
    hardware_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    hardware_brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    hardware_type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    serial_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    procurement_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    hardware_model_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    status_formula: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    assignee_formula: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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

const statuses = ref(['Unassigned', 'Assigned', 'Unavailable', 'Condemned', 'For Repair']);

const getData = debounce(async () => {
  loading.value = true;
  const response = await axios.get(props.source, {
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

const downloading = ref(false);

const downloadCSV = async (all = false) => {
  downloading.value = true;
  const page = all ? 0 : search.value.page;
  const rows = all ? 1000000 : search.value.rows;
  const response = await axios.request(props.source, {
    params: {
      search:
        JSON.stringify({
          page: page,
          rows: rows,
          sortField: search.value.sortField,
          sortOrder: search.value.sortOrder,
          filters: search.value.filters
        })
    },
    method: 'GET',
  });
  let csv = "data:text/csv;charset=utf-8,";

  csv += [
    "ID",
    "Name",
    "Brand",
    "Type",
    "Serial Number",
    "Procurement Date",
    "Model Number",
    "Status",
    "Assignee"
  ].join(",") + "\n";

  for (const row of response.data.data) {
    csv += [
      row.id,
      row.hardware_name,
      row.hardware_brand,
      row.hardware_type,
      row.hardware_model_number,
      row.serial_number,
      row.procurement_date,
      row.status_formula,
      row.assignee_formula
    ].join(",") + "\r\n";
  };

  const encodedUri = encodeURI(csv);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${props.downloadName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(encodedUri);
  downloading.value = false;
};

const downloadJSON = async (all = false) => {
  downloading.value = true;
  const page = all ? 0 : search.value.page;
  const rows = all ? 1000000 : search.value.rows;
  const response = await axios.request(props.source, {
    params: {
      search:
        JSON.stringify({
          page: page,
          rows: rows,
          sortField: search.value.sortField,
          sortOrder: search.value.sortOrder,
          filters: search.value.filters
        })
    },
    method: 'GET',
  });

  let json = "data:text/json;charset=utf-8,";

  const meta = [
    { header: 'ID', field: 'id' },
    { header: 'Name', field: 'hardware_name' },
    { header: 'Brand', field: 'hardware_brand' },
    { header: 'Type', field: 'hardware_type' },
    { header: 'Serial Number', field: 'serial_number' },
    { header: 'Procurement Date', field: 'procurement_date' },
    { header: 'Model Number', field: 'hardware_model_number' },
    { header: 'Status', field: 'status_formula' },
    { header: 'Assignee', field: 'assignee_formula' }
  ];

  json += encodeURIComponent(JSON.stringify(response.data.data.map(row => {
    let obj = {};
    meta.map(m => {
      obj[m.header] = row[m.field];
    });
    return obj;
  })));

  const link = document.createElement('a');
  link.href = json;
  link.setAttribute('download', `${props.downloadName}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
  downloading.value = false;
};

const downloadButtonsCSV = [
  {
    label: 'Page',
    command: downloadCSV.bind(null, false),
  },
  {
    label: 'All',
    command: downloadCSV.bind(null, true),
  }
];

const downloadButtonsJSON = [
  {
    label: 'Page',
    command: downloadJSON.bind(null, false),
  },
  {
    label: 'All',
    command: downloadJSON.bind(null, true),
  }
];


onMounted(() => {
  getData();
});

</script>
<style>
.p-paginator {
  border-radius: 0;
}
</style>