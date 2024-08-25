<template>
  <div :class="{'border-2 border-gray-600': isSelected}"
       class="flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-20 h-20"
       @click="selectCard">
    <h3>{{ variant.title }}</h3>
  </div>
</template>

<script setup lang="ts">
  import {defineEmits, defineProps} from 'vue';
  import type {PricedVariant} from "@medusajs/medusa/dist/types/pricing";

  // Define props for the component to receive data
  const props = defineProps<{
    variant: PricedVariant,
    isSelected: Boolean,
  }>();

  // Define emits to send events back to the parent component
  const emit = defineEmits(['select']);

  // Method to emit the select event when the card is clicked
  const selectCard = () => {
    emit('select');
  };
</script>

<style scoped>

</style>
