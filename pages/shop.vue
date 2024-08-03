<template>
  <ProductGrid/>
</template>

<script setup lang="ts">

  import ProductGrid from "~/components/shop/ProductGrid.vue";
  import {useProductStore} from "~/stores/product-store";

  const store = useProductStore();
  onMounted(async () => {
    if (!store.products) {
      await store.fetchProducts();
    }
  });


</script>

<style scoped>

</style>
