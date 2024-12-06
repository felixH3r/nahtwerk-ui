<template>
  <section class="py-8 md:py-16 dark:bg-gray-900 antialiased">
    <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
      <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        <div class=" ">
          <ProductImage :product="product" class="sticky top-24"/>
        </div>


        <div class=" mt-6 sm:mt-8 lg:mt-0">
          <h1
              class="text-4xl font-semibold text-gray-900dark:text-white"
          >
            {{ product?.title }}
          </h1>
          <div class="mt-4 mb-8 sm:items-center sm:gap-4 sm:flex">
            <p
                class="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white"
            >
              € {{ getSelectedPrice }}
            </p>
          </div>

          <!-- Innerfabric Gallery -->
          <div class="mb-8">
            <h2 class="mb-4 text-xl font-bold">Innenstoff:</h2>
            <FabricGrid>
              <FabricThumbnail
                  v-for="(fabric, index) in product?.metadata?.innerFabrics"
                  :key="index"
                  :index="index"
                  :fabric="fabric"
                  :isSelected="selectedInnerFabricIndex === index"
                  :onSelect="selectInnerFabric"
              />
            </FabricGrid>
          </div>

          <!-- Outerfabric Gallery -->
          <div class="mb-8">
            <h2 class="mb-4 text-xl font-bold">Außenstoff:</h2>

            <FabricGrid>
              <FabricThumbnail
                  v-for="(fabric, index) in product?.metadata?.outerFabrics"
                  :key="index"
                  :index="index"
                  :fabric="fabric"
                  :isSelected="selectedOuterFabricIndex === index"
                  :onSelect="selectOuterFabric"
              />
            </FabricGrid>
          </div>

          <!-- Variants Gallery -->
          <div class="mb-8">
            <h2 class="mb-4 text-xl font-bold">Größe:</h2>
            <FabricGrid>
              <VariantsThumbnail
                  v-for="(variant, index) in product?.variants"
                  :key="index"
                  :index="index"
                  :variant="variant"
                  :isSelected="selectedVariantIndex === index"
                  :onSelect="selectVariant"
              />
            </FabricGrid>
          </div>

          <p class="mb-6 text-gray-500 dark:text-gray-400">
            {{ product?.description }}
          </p>

          <div @click="addToCart" class="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
            <a
                href="#"
                title=""
                class="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                role="button"
            >
              <svg
                  class="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
              >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                />
              </svg>
              In den Warenkorb
            </a>
          </div>

          <hr class="my-6 md:my-8 border-gray-200 dark:border-gray-800"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import {useRoute} from "vue-router";
  import type {PricedProduct, PricedVariant,} from "@medusajs/medusa/dist/types/pricing";
  import VariantsThumbnail from "~/components/product/VariantsThumbnail.vue";
  import FabricThumbnail from "~/components/product/FabricThumbnail.vue";
  import ProductImage from "~/components/product/ProductImage.vue";
  import {formatPrice} from "~/utils/utils";
  import FabricGrid from "~/components/product/FabricGrid.vue";

  const route = useRoute();
  const product: Ref<Nullable<PricedProduct>> = ref(null);
  const store = useProductStore();
  const {products} = storeToRefs(store);
  const selectedVariant: Ref<Nullable<PricedVariant>> = ref(null);
  const selectedVariantIndex: Ref<Nullable<number>> = ref(null);
  const selectedInnerFabric: Ref<Nullable<Fabric>> = ref(null);
  const selectedInnerFabricIndex: Ref<Nullable<number>> = ref(null);
  const selectedOuterFabric: Ref<Nullable<Fabric>> = ref(null);
  const selectedOuterFabricIndex: Ref<Nullable<number>> = ref(null);

  const getProduct = computed((): PricedProduct | null => {
    const productHandle = route.params.productTitle as string;
    if (products.value) {
      const foundProduct: PricedProduct | undefined = products.value.find(
          (pro) => pro.handle === productHandle
      );
      if (foundProduct) {
        return foundProduct;
      }
    }
    return null;
  });

  const getSelectedPrice = computed((): string => {
    if (
        !selectedVariant ||
        !selectedVariant.value ||
        !selectedVariant.value.calculated_price
    ) {
      return '0,00';
    }
    return formatPrice(selectedVariant.value.calculated_price);
  });

  const selectInnerFabric = (index: number, fabric: Fabric) => {
    selectedInnerFabricIndex.value = index;
    selectedInnerFabric.value = fabric;
  };

  const selectOuterFabric = (index: number, fabric: Fabric) => {
    selectedOuterFabricIndex.value = index;
    selectedOuterFabric.value = fabric;
  };

  // Method to update the selected item
  const selectVariant = (index: number, variant: PricedVariant): void => {
    selectedVariantIndex.value = index;
    selectedVariant.value = variant;
  };

  const addToCart = async () => {
    if (selectedVariant.value && selectedVariant.value.id && selectedInnerFabric.value && selectedOuterFabric.value) {
      await store.addToCart(selectedVariant.value.id, {
        innerFabric: selectedInnerFabric.value,
        outerFabric: selectedOuterFabric.value
      });
    }
  };

  onMounted(async () => {

    if (!products.value) {
      await store.fetchProducts();
    }
    product.value = getProduct.value;
    if (product.value) {
      selectVariant(0, product.value.variants[0]);
      if (product.value.metadata && product.value.metadata.innerFabrics) {
        selectInnerFabric(0, product.value.metadata.innerFabrics[0]);
      }
      if (product.value.metadata && product.value.metadata.outerFabrics) {
        selectOuterFabric(0, product.value.metadata.outerFabrics[0]);
      }
    }
  });
</script>

<style scoped>


</style>
