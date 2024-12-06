<template>
  <div class="flex items-center space-x-8">
    <div class="shrink-0 ">
      <NuxtLink to="/">
        <img class="block w-auto h-16 dark:hidden"
             src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt="">
        <img class="hidden w-auto h-8 dark:block"
             src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt="">
      </NuxtLink>
    </div>

    <ul class="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
      <li>
        <NuxtLink to="/" title=""
                  class="flex text-sm font-light text-gray-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  :class="{'font-medium text-gray-900': useRoute().fullPath===SLUGS.HOME}"
        >
          Home
        </NuxtLink>
      </li>
      <li class="shrink-0">
        <NuxtLink to="/shop" title=""
                  class="flex text-sm font-light text-gray-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  :class="{'font-medium text-gray-900': useRoute().fullPath===SLUGS.SHOP}"
        >
          Shop
        </NuxtLink>
      </li>
      <li class="shrink-0">
        <NuxtLink to="/about-me" title=""
                  class="flex text-sm font-light text-gray-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                  :class="{'font-medium text-gray-900': useRoute().fullPath===SLUGS.ABOUT_ME}">
          Über mich
        </NuxtLink>
      </li>
    </ul>
  </div>


</template>

<script setup lang="ts">
  import {useRoute} from "vue-router";

  enum SLUGS {
    HOME = '/',
    SHOP = '/shop',
    ABOUT_ME = '/about-me'
  }

  onMounted(() => {
    console.log(useRoute().fullPath, 'actual route');
  });


  // const isActive = computed((): boolean => {
  //   // @ts-ignore
  //   if (useRoute() !== slug.HOME) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // });
</script>

<style scoped>

</style>
