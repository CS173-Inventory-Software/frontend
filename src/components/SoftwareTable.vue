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
    <Column field="software_name" header="Name" sortable :show-filter-operator="false" :show-filter-match-modes="false"
      :show-add-button="false">
      <template #body="{ data }">
        <router-link :to="`/software/${data.software}`">{{ data.software_name }}</router-link>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by name" />
      </template>
    </Column>
    <Column field="software_brand" header="Brand" sortable :show-filter-operator="false"
      :show-filter-match-modes="false"
      :show-add-button="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by brand" />
      </template>
    </Column>
    <Column field="software_version_number" header="Version Number" sortable :show-filter-operator="false"
      :show-filter-match-modes="false" :show-add-button="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
          placeholder="Search by version number" />
      </template>
    </Column>
    <Column field="software_expiration_date" header="Expiration Date" sortable data-type="date"
      :show-filter-operator="false">
      <!-- TODO: Fix -->

      <template #filter="{ filterModel }">
        <input v-model="filterModel.value" class="p-inputtext p-component" data-pc-name="inputtext"
          data-pc-section="root" type="date">
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
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import { debounce } from 'lodash';
import Button from 'primevue/button';
import { useUserStore } from '@/stores/user';
import SplitButton from 'primevue/splitbutton';

const store = useUserStore();

const props = defineProps({
  source: {
    type: String,
    required: true
  },
  downloadName: {
    type: String,
    default: 'software'
  }
});

const entities = ref([]);

const loading = ref(false);

const search = ref({
  totalRecords: 0,
  filters: {
    software_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    software_brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    software_type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    software_version_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    software_expiration_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
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
    "Version Number",
    "Expiration Date",
    "Serial Key",
    "Status",
    "Assignee"
  ].join(",") + "\n";

  for (const row of response.data.data) {
    csv += [
      row.id,
      row.software_name,
      row.software_brand,
      row.software_version_number,
      row.software_expiration_date,
      row.serial_key,
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
    { header: "ID", field: "id" },
    { header: "Name", field: "software_name" },
    { header: "Brand", field: "software_brand" },
    { header: "Version Number", field: "software_version_number" },
    { header: "Expiration Date", field: "software_expiration_date" },
    { header: "Serial Key", field: "software_serial_key" },
    { header: "Status", field: "status_formula" },
    { header: "Assignee", field: "assignee_formula" }
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