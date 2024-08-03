<template>
  <section class="bg-primary-100 py-8 antialiased min-h-screen dark:bg-gray-900 md:py-12">
    <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
      <div class="mb-4 items-end justify-between space-y-4 sm:flex-col sm:space-y-0 md:mb-8">

        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Produkte</h2>


        <div class="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">

          <ProductCard v-for="product in products" :product="product"/>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import ProductCard from "~/components/shop/ProductCard.vue";

  const store = useProductStore();
  const {products} = storeToRefs(store);


</script>

<style scoped>

</style>
