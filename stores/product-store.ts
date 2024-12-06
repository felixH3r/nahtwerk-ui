import Fabric, {useMedusaClient} from "#imports";
import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import type {Ref} from "vue";
import {Cart} from "@medusajs/medusa";

export const useProductStore = defineStore('products', () => {
  const products: Ref<Nullable<PricedProduct[]>> = ref(null);
  const storeCart: Ref<Nullable<Omit<Cart, 'refundable_amount' | 'refunded_total'>>> = ref(null);

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
          currency_code: 'eur'
        });
        products.value = productsList.products;
      } catch (error) {
        console.log(error);
      }

    }
  };

  const createCart = async () => {
    const client = useMedusaClient();
    const cart_id = localStorage.getItem('cart_id');
    if (cart_id) {
      try {
        const {cart} = await client.carts.retrieve(cart_id);
        storeCart.value = cart;
      } catch (error) {
        localStorage.removeItem('cart_id');
        createCart();
      }

    } else {
      const {regions} = await client.regions.list();
      const {cart} = await client.carts.create({region_id: regions[0].id});
      localStorage.setItem('cart_id', cart.id);
    }
  };

  const addToCart = async (variant_id: string, metadata: { innerFabric: Fabric, outerFabric: Fabric }) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      try {
        const {cart, response} = await client.carts.lineItems.create(storeCart.value.id, {
          variant_id,
          quantity: 1,
          metadata
        });
        storeCart.value = cart;
      } catch (err: any) {
        alert(err.response.data.message);
      }


    }
  };

  const removeFromCart = async (line_id: string) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      const {cart} = await client.carts.lineItems.delete(storeCart.value.id, line_id);
      storeCart.value = cart;
    }
  };

  const completeCart = async () => {
    const client = useMedusaClient();
    const formStore = useFormStore();
    if (!storeCart.value) {
      return;
    }
    // add shipping data
    if (formStore.isFormValid) {
      const {cart} = await client.carts.update(storeCart.value.id, {
        email: formStore.formData.email,
        shipping_address: {
          first_name: formStore.formData.firstName,
          last_name: formStore.formData.lastName,
          address_1: formStore.formData.street,
          address_2: "",
          city: formStore.formData.city,
          postal_code: formStore.formData.postalCode,
          country_code: 'at',
          phone: ""
        }
      });
      storeCart.value = cart;
    }

    // add payment data
    const {shipping_options} = await client.shippingOptions.listCartOptions(storeCart.value.id);
    console.log(shipping_options, 'shipping options');
    if (shipping_options[0] && shipping_options[0].id) {
      const {cart} = await client.carts.addShippingMethod(storeCart.value.id, {option_id: shipping_options[0].id});
      storeCart.value = cart;
    }

    // add payment data
    const {cart: updatedCart} = await client.carts.createPaymentSessions(storeCart.value.id);
    storeCart.value = updatedCart;
    console.log(storeCart.value.payment_sessions, 'payment sessions');
    if (storeCart.value.payment_sessions[0] && storeCart.value.payment_sessions[0].id) {
      const {cart} = await client.carts.setPaymentSession(storeCart.value.id, {provider_id: 'manual'});
      storeCart.value = cart;
    }

    // place order
    const {type, data} = await client.carts.complete(storeCart.value.id);
    console.log(type, data);
  };


  return {products, fetchProducts, storeCart, createCart, addToCart, removeFromCart, completeCart, $resetCart};
});
