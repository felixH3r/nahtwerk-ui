import { ref, reactive, computed } from 'vue';
import { j as defineStore, b as useNuxtApp, d as useRuntimeConfig, k as ua } from './server.mjs';

const useFormStore = defineStore("form", () => {
  const formData = reactive({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    postalCode: ""
  });
  const gdpr = ref(false);
  const submitted = ref(false);
  const $reset = () => {
    submitted.value = false;
    gdpr.value = false;
    formData.firstName = "";
    formData.lastName = "";
    formData.email = "";
    formData.street = "";
    formData.city = "";
    formData.postalCode = "";
  };
  const isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(formData.email);
  });
  const isFieldInvalid = computed(() => {
    return {
      firstName: formData.firstName.trim() === "" && submitted.value,
      lastName: formData.lastName.trim() === "" && submitted.value,
      email: formData.email.trim() === "" && submitted.value,
      street: formData.street.trim() === "" && submitted.value,
      city: formData.city.trim() === "" && submitted.value,
      postalCode: formData.postalCode.trim() === "" && submitted.value
    };
  });
  const isFormEmpty = computed(() => {
    return !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim();
  });
  const isFormValid = computed(() => {
    return !isFormEmpty.value && isValidEmail.value;
  });
  const updateFormField = (field, value) => {
    formData[field] = value;
  };
  const submitForm = () => {
    submitted.value = true;
    if (!isFormValid.value) {
      alert("Bitte alle Felder ausf\xFCllen und auf g\xFCltige Email-Adresse pr\xFCfen!");
      return;
    }
    if (!gdpr.value) {
      alert("Bitte Datenschutzerkl\xE4rung akzeptieren!");
      return;
    }
  };
  return {
    formData,
    gdpr,
    submitted,
    isFieldInvalid,
    isFormEmpty,
    isFormValid,
    updateFormField,
    submitForm,
    isValidEmail,
    $reset
  };
});
const useMedusaClient = () => {
  const nuxtApp = useNuxtApp();
  const { medusa: config } = useRuntimeConfig().public;
  if (config.global)
    return nuxtApp.$medusa;
  if (!nuxtApp._medusaClient) {
    nuxtApp._medusaClient = new ua(config);
  }
  return nuxtApp._medusaClient;
};
const useProductStore = defineStore("products", () => {
  const products = ref(null);
  const storeCart = ref(null);
  const $resetCart = () => {
    storeCart.value = null;
  };
  const fetchProducts = async () => {
    if (!storeCart || !storeCart.value) {
      await createCart();
    }
    if (storeCart && storeCart.value) {
      try {
        const productsList = await useMedusaClient().products.list({
          cart_id: storeCart.value.id,
          region_id: storeCart.value.region_id,
          currency_code: "eur"
        });
        products.value = productsList.products;
      } catch (error) {
        console.log(error);
      }
    }
  };
  const createCart = async () => {
    const client = useMedusaClient();
    const cart_id = localStorage.getItem("cart_id");
    if (cart_id) {
      try {
        const { cart } = await client.carts.retrieve(cart_id);
        storeCart.value = cart;
      } catch (error) {
        localStorage.removeItem("cart_id");
        createCart();
      }
    } else {
      const { regions } = await client.regions.list();
      const { cart } = await client.carts.create({ region_id: regions[0].id });
      localStorage.setItem("cart_id", cart.id);
    }
  };
  const addToCart = async (variant_id, metadata) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      try {
        const { cart, response } = await client.carts.lineItems.create(storeCart.value.id, {
          variant_id,
          quantity: 1,
          metadata
        });
        storeCart.value = cart;
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };
  const removeFromCart = async (line_id) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      const { cart } = await client.carts.lineItems.delete(storeCart.value.id, line_id);
      storeCart.value = cart;
    }
  };
  const completeCart = async () => {
    const client = useMedusaClient();
    const formStore = useFormStore();
    if (!storeCart.value) {
      return;
    }
    if (formStore.isFormValid) {
      const { cart } = await client.carts.update(storeCart.value.id, {
        email: formStore.formData.email,
        shipping_address: {
          first_name: formStore.formData.firstName,
          last_name: formStore.formData.lastName,
          address_1: formStore.formData.street,
          address_2: "",
          city: formStore.formData.city,
          postal_code: formStore.formData.postalCode,
          country_code: "at",
          phone: ""
        }
      });
      storeCart.value = cart;
    }
    const { shipping_options } = await client.shippingOptions.listCartOptions(storeCart.value.id);
    console.log(shipping_options, "shipping options");
    if (shipping_options[0] && shipping_options[0].id) {
      const { cart } = await client.carts.addShippingMethod(storeCart.value.id, { option_id: shipping_options[0].id });
      storeCart.value = cart;
    }
    const { cart: updatedCart } = await client.carts.createPaymentSessions(storeCart.value.id);
    storeCart.value = updatedCart;
    console.log(storeCart.value.payment_sessions, "payment sessions");
    if (storeCart.value.payment_sessions[0] && storeCart.value.payment_sessions[0].id) {
      const { cart } = await client.carts.setPaymentSession(storeCart.value.id, { provider_id: "manual" });
      storeCart.value = cart;
    }
    const { type, data } = await client.carts.complete(storeCart.value.id);
    console.log(type, data);
  };
  return { products, fetchProducts, storeCart, createCart, addToCart, removeFromCart, completeCart, $resetCart };
});

export { useFormStore as a, useProductStore as u };
//# sourceMappingURL=product-store-D4ZXvwX8.mjs.map
