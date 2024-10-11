<template>
  <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
    <div
        class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <p class="text-xl font-semibold text-gray-900 dark:text-white">Adresse:</p>
      <AdressForm/>
      <div class="space-y-4 mb-5">
        <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <dt class="text-base font-bold text-gray-900 dark:text-white">Summe:</dt>
          <dd class="text-base font-bold text-gray-900 dark:text-white">€ {{ formatPrice(getCart.total) }}
          </dd>
        </dl>
      </div>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Bitte beachten Sie, dass dies noch keine verbindliche Bestellung ist. Ich werde Ihre Anfrage umgehend prüfen und mich in Kürze bei Ihnen melden, um alle Details zu besprechen.</span>
      <button @click="submitForm()"
              class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        Jetzt
        Anfrage senden!
      </button>

      <div class="flex items-center justify-center gap-2">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400"> oder </span>
        <NuxtLink to="/shop" title=""
                  class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
          Weiter Einkaufen
          <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AdressForm from "~/components/cart/AdressForm.vue";
  import {Resend} from "resend";

  const store = useProductStore();
  const getCart = computed(() => {
    console.log(store.storeCart);
    if (store.storeCart) {
      return store.storeCart;
    }
    return {};
  });
  const formStore = useFormStore();
  const emailClient_ = new Resend("re_QP1WqNkG_Prg2E7Y5v2rmZF3Z9jjm4dyU");

  const submitForm = async () => {
    formStore.submitForm();
    await store.completeCart();

    localStorage.removeItem('cart_id');
    store.$resetCart();
    formStore.$reset();
    navigateTo('/');
  };
</script>

<style scoped>

</style>
