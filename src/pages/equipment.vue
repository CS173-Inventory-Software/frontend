<template>
  <AppLayout>
    <div class="flex flex-column items-center">
      <h1 class="text-4xl font-bold mb-4 text-left">Reports</h1>
      <TabView>
        <TabPanel header="Software Assigned">
          <SoftwareTable source="/user/software/" download-name="user-software" />
        </TabPanel>
        <TabPanel header="Hardware Assigned">
          <HardwareTable source="/user/hardware/" download-name="user-hardawre" />
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