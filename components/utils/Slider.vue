<template>
  <div class="flex w-full overflow-scroll md:h-56">
    <div class="flex gap-2 pr-16">
      <slot></slot>
    </div>
    <div
        :class="heightClass"
        class="w-32 bg-gradient-to-r from-transparent via-white via-70% white to-white absolute right-0">
    </div>
  </div>
</template>

<script setup lang="ts">

  const props = defineProps<{
    heightClass: string
  }>();
</script>


<style scoped>

</style>
