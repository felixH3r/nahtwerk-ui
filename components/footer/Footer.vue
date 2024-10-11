<template>
  <footer class="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
    <div class="mx-auto max-w-screen-xl text-center">
      <NuxtLink to="/" class="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="block w-auto h-24"
             src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt="">
      </NuxtLink>
      <ul class="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
        <li>
          <NuxtLink to="/" class="mr-4 hover:underline md:mr-6 ">Über mich</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/impressum" class="mr-4 hover:underline md:mr-6">Impressum</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/datenschutz" class="mr-4 hover:underline md:mr-6 ">Datenschutz</NuxtLink>
        </li>
        <li>
          <NuxtLink to="https://www.instagram.com/nahtwerk_/" target="_blank" class="mr-4 hover:underline md:mr-6 ">
            Instagram
          </NuxtLink>
        </li>

      </ul>
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <NuxtLink to="/"
                                                                                             class="hover:underline">Nahtwerk.</NuxtLink> Alle Rechte vorbehalten.</span>
    </div>
  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
