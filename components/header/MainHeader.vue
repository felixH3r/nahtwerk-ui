<template>
  <nav class="bg-white dark:bg-gray-800 antialiased">
    <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0 pt-1">
      <div class="flex items-center justify-between">
        <HeaderMenu/>

        <div class="flex items-center lg:space-x-2">
          <CartButton/>
          <button type="button" data-collapse-toggle="ecommerce-navbar-menu-1" aria-controls="ecommerce-navbar-menu-1"
                  aria-expanded="false"
                  class="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white">
          <span class="sr-only">
            Open Menu
          </span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 fill="none"
                 viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <HeaderMobileMenu/>
  </nav>
</template>

<script setup lang="ts">

  import HeaderMenu from "~/components/header/HeaderMenu.vue";
  import CartButton from "~/components/header/CartButton.vue";
  import HeaderMobileMenu from "~/components/header/HeaderMobileMenu.vue";
</script>

<style scoped>

</style>
