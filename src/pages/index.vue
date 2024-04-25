<template>
  <AppLayout>
    <div class="flex flex-column items-center">
      <h1 class="text-4xl font-bold mb-4 text-left">Reports</h1>
      <TabView>
        <TabPanel header="Software Near Expiry">
          <SoftwareTable source="/reports/software-near-expiry/" download-name="software-near-expiry" />
        </TabPanel>
        <TabPanel header="Hardware Needing Maintenance">
          <HardwareTable source="/reports/hardware-needing-maintenance/" download-name="hardware-needing-maintenance" />
        </TabPanel>
        <TabPanel header="Software Not Assigned">
          <SoftwareTable source="/reports/software-not-assigned/" download="software-not-assigned" />
        </TabPanel>
        <TabPanel header="Hardware Not Assigned">
          <HardwareTable source="/reports/hardware-not-assigned/" download="hardware-not-assigned" />
        </TabPanel>
      </TabView>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import SoftwareTable from '@/components/SoftwareTable.vue';
import HardwareTable from '@/components/HardwareTable.vue';

</script>