import {useMedusaClient} from "#imports";
import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import type {Ref} from "vue";
import {Cart} from "@medusajs/medusa";

export const useProductStore = defineStore('products', () => {
  const products: Ref<Nullable<PricedProduct[]>> = ref(null);
  const storeCart: Ref<Nullable<Omit<Cart, 'refundable_amount' | 'refunded_total'>>> = ref(null);

  const fetchProducts = async () => {
    const productsList = await useMedusaClient().products.list();
    products.value = productsList.products;
  };

  const createCart = async () => {
    const client = useMedusaClient();
    const cart_id = localStorage.getItem('cart_id');
    if (cart_id) {
      const {cart} = await client.carts.retrieve(cart_id);
      storeCart.value = cart;
    } else {
      const {cart} = await client.carts.create();
      localStorage.setItem('cart_id', cart.id);
    }
  };

  return {products, fetchProducts, storeCart, createCart};
});
