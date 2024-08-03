<template>
  <div class="flex items-center space-x-8">
    <div class="shrink-0">
      <NuxtLink to="/">
        <img class="block w-auto h-16 dark:hidden"
             src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt="">
        <img class="hidden w-auto h-8 dark:block"
             src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt="">
      </NuxtLink>
    </div>

    <ul class="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
      <li>
        <a href="#" title=""
           class="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
          Home
        </a>
      </li>
      <li class="shrink-0">
        <a href="#" title=""
           class="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
          Shop
        </a>
      </li>
      <li class="shrink-0">
        <a href="#" title=""
           class="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
          Über mich
        </a>
      </li>
    </ul>
  </div>


</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
