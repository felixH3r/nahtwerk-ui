<template>
  <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
    <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Warenkorb</h2>

      <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
        <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl">
          <div class="space-y-6">
            <CartItem v-for="(lineItem, index) in getLineItems" :key="index" :lineItem="lineItem"/>
          </div>
        </div>
        <CartSummary/>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

  import CartSummary from "~/components/cart/CartSummary.vue";

  const noItems = ref(false);

  const store = useProductStore();
  const getLineItems = computed(() => {
    if (store.storeCart) {
      if (store.storeCart.items.length === 0) {
        noItems.value = true;
        return [];
      }
      noItems.value = false;
      return store.storeCart.items;
    }
    return [];
  });
</script>

<style scoped>

</style>
