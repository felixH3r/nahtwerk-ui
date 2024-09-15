<template>
  <NuxtImg
      :class="{ 'border-2 border-gray-600': isSelected }"
      class="flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-20 h-20 object-cover"
      @click="onSelect(index, imageUrl)"
      :src="imageUrl"
  />
</template>

<script setup lang="ts">
  const props = defineProps<{
    index: number;
    imageUrl: string
    isSelected: Boolean;
    onSelect: (index: number, imageUrl: string) => void;
  }>();
</script>

<style scoped>

</style>
