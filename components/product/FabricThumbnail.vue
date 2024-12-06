<template>
  <div class="flex flex-col">
    <NuxtImg
        :class="{ 'border-2 border-gray-600': isSelected }"
        class="flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-full aspect-square object-cover"
        @click="onSelect(index, fabric)"
        :src="fabric.fileUrl"
    />
    <span class="text-ellipsis overflow-hidden whitespace-nowrap w-full block">{{ fabric.fabricName }}</span>
  </div>

</template>

<script setup lang="ts">
  // Define props for the component to receive data
  const props = defineProps<{
    index: number;
    fabric: any;
    isSelected: Boolean;
    onSelect: (index: number, fabric: Fabric) => void;
  }>();
</script>

<style scoped></style>
