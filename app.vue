<template>
  <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
  import {useFlowbite} from "~/composables/useFlowbite";
  import {use} from "h3";
  import ProductGrid from "~/components/ProductGrid.vue";
  import TestComponent from "~/components/TestComponent.vue";

  onMounted(() => useFlowbite((flowbite: any) => flowbite.initFlowbite()));

</script>

<style>
</style>
