<template>
  <form class="max-w-sm mx-auto">

    <div class="mb-5">
      <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vorname:</label>
      <input type="text" id="firstName"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             :class="{'border-red-500': store.isFieldInvalid.firstName}"
             v-model="store.formData.firstName"
             placeholder="Vorname" required/>
    </div>
    <div class="mb-5">
      <label for="secondName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nachname:</label>
      <input type="text" id="secondName"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             :class="{'border-red-500': store.isFieldInvalid.lastName}"
             v-model="store.formData.lastName"
             placeholder="Nachname" required/>
    </div>
    <div class="mb-5">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
      <input type="email" id="email"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             :class="{'border-red-500': store.isFieldInvalid.email || !store.isValidEmail && store.submitted}"
             v-model="store.formData.email"
             placeholder="name@email.com" required/>
    </div>
    <div class="mb-5">
      <label for="street" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Straße mit
        Hausnummer:</label>
      <input type="text" id="street"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             :class="{'border-red-500': store.isFieldInvalid.street}"
             v-model="store.formData.street"
             placeholder="name@flowbite.com" required/>
    </div>
    <div class="mb-5">
      <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stadt:</label>
      <input type="text" id="city"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             :class="{'border-red-500': store.isFieldInvalid.city}"
             v-model="store.formData.city"
             required/>
    </div>
    <div class="mb-5">
      <label for="postalCode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Postleitzahl:</label>
      <input type="text" id="postalCode"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             :class="{'border-red-500': store.isFieldInvalid.postalCode}"
             v-model="store.formData.postalCode"
             required/>
    </div>
    <div class="flex items-start mb-5">
      <div class="flex items-center h-5">
        <input id="remember" type="checkbox" value=""
               class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
               v-model="store.gdpr"
               required/>
      </div>
      <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ich akzeptiere die
        Datenschutzerklärung</label>
    </div>
  </form>
</template>

<script setup lang="ts">

  import {useFormStore} from "~/stores/checkoutFormStore";

  const store = useFormStore();


</script>

<style scoped>

</style>
