<template>
  <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
  import {useFlowbite} from "~/composables/useFlowbite";

  onMounted(() => useFlowbite((flowbite: any) => flowbite.initFlowbite()));

</script>

<style>
</style>
