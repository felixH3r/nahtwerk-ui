<template>
  <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
  import {useFlowbite} from "~/composables/useFlowbite";
  import {useProductStore} from "#imports";

  onMounted(async () => {
    useFlowbite((flowbite: any) => flowbite.initFlowbite());
    await useProductStore().createCart();
  });


</script>

<style>
</style>
