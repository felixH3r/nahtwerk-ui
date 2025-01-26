<template>
  <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
  import {useFlowbite} from "~/composables/useFlowbite";
  import {Analytics} from '@vercel/analytics/nuxt';

  onMounted(async () => {
    useFlowbite((flowbite: any) => flowbite.initFlowbite());
    await useProductStore().createCart();
  });


</script>

<style>
</style>
