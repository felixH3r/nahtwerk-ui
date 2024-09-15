<template>
  <NuxtImg
      :class="{ 'border-2 border-gray-600': isSelected }"
      class="flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-20 h-20 object-cover"
      @click="onSelect(index, fabric)"
      :src="fabric.fileUrl"
  />
</template>

<script setup lang="ts">
  // Define props for the component to receive data
  const props = defineProps<{
    index: number;
    fabric: Fabric;
    isSelected: Boolean;
    onSelect: (index: number, fabric: Fabric) => void;
  }>();
</script>

<style scoped></style>
