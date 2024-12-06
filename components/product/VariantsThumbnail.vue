<template>
  <div
      :class="{ 'border-2 border-gray-600': isSelected }"
      class="flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-full aspect-square object-cover"
      @click="onSelect(index, variant)"
  >
    <h3>{{ variant.title }}</h3>
  </div>
</template>

<script setup lang="ts">
  import {defineProps} from "vue";
  import type {PricedVariant} from "@medusajs/medusa/dist/types/pricing";

  // Define props for the component to receive data
  const props = defineProps<{
    variant: PricedVariant;
    isSelected: Boolean;
    index: number;
    onSelect: (index: number, variant: PricedVariant) => void;
  }>();
</script>

<style scoped></style>
