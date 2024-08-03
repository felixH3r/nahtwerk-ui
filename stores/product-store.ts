import {useMedusaClient} from "#imports";
import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import type {Ref} from "vue";

export const useProductStore = defineStore('products', () => {
  const products: Ref<Nullable<PricedProduct[]>> = ref(null);

  const fetchProducts = async () => {
    const productsList = await useMedusaClient().products.list();
    products.value = productsList.products;
  };

  return {products, fetchProducts};
});
