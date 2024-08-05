<template>

</template>

<script setup lang="ts">

  import {useRoute} from "vue-router";
  import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
  import type {Ref} from "vue";

  const route = useRoute();
  const product: Ref<Nullable<PricedProduct>> = ref(null);

  onMounted(() => {
    const store = useProductStore();
    const {products} = storeToRefs(store);

    const productHandle = route.params.productTitle as string;
    if (products.value) {
      const foundProduct: PricedProduct | undefined = products.value.find((pro) => pro.handle === productHandle);
      if (foundProduct) {
        product.value = foundProduct;
        console.log(product);
      }
    }

  });

</script>

<style scoped>

</style>
