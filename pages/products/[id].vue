<template>

</template>

<script setup lang="ts">

  import {useRoute} from "vue-router";
  import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";

  const route = useRoute();
  const props = defineProps<{
    product: PricedProduct
  }>();

  onMounted(() => {

  });

</script>

<style scoped>

</style>
