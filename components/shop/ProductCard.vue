<template>
  <div class="rounded-lg bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div class="flex items-center justify-center h-56 w-full">
      <NuxtLink to="/" class="flex justify-center items-center w-full">
        <NuxtImg v-if="!showPlaceholderImg"
                 class="mx-auto h-56 w-full object-fill object-center rounded-lg dark:hidden"
                 :src="getThumbnail" alt=""/>
        <ImgPlaceholderSVG v-else/>
      </NuxtLink>
    </div>
    <div class="pt-6">
      <div class="mb-4 flex items-center justify-between gap-4">
        <span
            class="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> Mit Liebe gemacht
        </span>
        <div class="flex items-center justify-end gap-1">
          <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="grey"
               viewBox="0 0 24 24">
            <path stroke="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"/>
          </svg>
        </div>
      </div>

      <div class="flex flex-col mb-4">
        <NuxtLink to="/" class="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
          {{ getTitle }}
        </NuxtLink>

        <span>{{ getSubtitle }}</span>
      </div>

      <div class="flex gap-1 items-center">
        <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
        </svg>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Handgefertigt</p>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">ab €35,00</p>

        <button type="button"
                class="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          <svg class="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
               height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"/>
          </svg>
          Warenkorb
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
  import ImgPlaceholderSVG from "~/components/icons/ImgPlaceholderSVG.vue";
  import {computed} from "vue";

  const showPlaceholderImg = ref(false);

  const props = defineProps<{
    product: PricedProduct;
  }>();

  const getThumbnail = computed(() => {
    if (props.product && props.product.thumbnail) {
      return props.product.thumbnail;
    }
    showPlaceholderImg.value = true;
  });

  const getTitle = computed(() => {
    if (props.product && props.product.title) {
      return props.product.title;
    }
    return "No title";
  });

  const getSubtitle = computed(() => {
    if (props.product && props.product.subtitle) {
      return props.product.subtitle;
    }
    return "No subtitle";
  });
</script>

<style scoped>

</style>
