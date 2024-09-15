import Fabric, {useMedusaClient} from "#imports";
import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import type {Ref} from "vue";
import {Cart} from "@medusajs/medusa";

export const useProductStore = defineStore('products', () => {
  const products: Ref<Nullable<PricedProduct[]>> = ref(null);
  const storeCart: Ref<Nullable<Omit<Cart, 'refundable_amount' | 'refunded_total'>>> = ref(null);

  const fetchProducts = async () => {
    if (!storeCart || !storeCart.value) {
      await createCart();
    }
    if (storeCart && storeCart.value) {
      const productsList = await useMedusaClient().products.list({
        cart_id: storeCart.value.id,
        region_id: storeCart.value.region_id,
        currency_code: 'eur'
      });
      products.value = productsList.products;
    }
  };

  const createCart = async () => {
    const client = useMedusaClient();
    const cart_id = localStorage.getItem('cart_id');
    if (cart_id) {
      const {cart} = await client.carts.retrieve(cart_id);
      storeCart.value = cart;
    } else {
      const {regions} = await client.regions.list();
      const {cart} = await client.carts.create({region_id: regions[0].id});
      localStorage.setItem('cart_id', cart.id);
    }
  };

  const addToCart = async (variant_id: string, metadata: { innerFabric: Fabric, outerFabric: Fabric }) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      const {cart} = await client.carts.lineItems.create(storeCart.value.id, {variant_id, quantity: 1, metadata});
      storeCart.value = cart;
    }
  };

  const removeFromCart = async (line_id: string) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      const {cart} = await client.carts.lineItems.delete(storeCart.value.id, line_id);
      storeCart.value = cart;
    }
  };


  return {products, fetchProducts, storeCart, createCart, addToCart, removeFromCart};
});
