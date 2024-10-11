<template>
  <div
      class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
    <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
      <NuxtLink :to="`/products/${lineItem.handle}`" class="w-20 shrink-0 md:order-1">
        <NuxtImg class="h-20 w-20 rounded dark:hidden"
                 :src="lineItem.thumbnail"/>
      </NuxtLink>

      <label for="counter-input" class="sr-only">Choose quantity:</label>
      <div class="flex items-center justify-between md:order-3 md:justify-end">
        <div class="flex items-center">
          <span>Menge: {{ lineItem.quantity }}</span>
        </div>
        <div class="text-end md:order-4 md:w-32">
          <p class="text-base font-bold text-gray-900 dark:text-white">€ {{ formatPrice(lineItem.total) }}</p>
        </div>
      </div>

      <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
        <div class="flex flex-col">
          <NuxtLink :to="`/products/${lineItem.variant.product.handle}`"
                    class="text-base font-medium text-gray-900 hover:underline dark:text-white underline">{{
              lineItem.title
            }}
          </NuxtLink>
          <span class="text-sm font-light text-gray-900 hover:underline dark:text-white">Größe: {{
              lineItem.variant.title
            }}</span>
          <span class="text-sm font-light text-gray-900 hover:underline dark:text-white">Innenstoff: {{
              lineItem.metadata.innerFabric.fabricName
            }}</span>
          <span class="text-sm font-light text-gray-900 hover:underline dark:text-white">Außenstoff: {{
              lineItem.metadata.outerFabric.fabricName
            }}</span>
        </div>


        <div class="flex items-center gap-4">

          <button type="button"
                  class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                  @click="removeFromCart">
            <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                 height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
            Entfernen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    lineItem: any;
  }>();
  const removeFromCart = async () => {
    await useProductStore().removeFromCart(props.lineItem.id);
  };
</script>

<style scoped>

</style>
