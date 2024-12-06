<template>
  <div class="shrink-0 max-w-md lg:max-w-lg mx-auto z-[-1]">
    <NuxtImg class="w-full h-96 rounded-lg mb-3 object-cover " :src="getSelectedImage"/>
    <Slider :height-class="'h-32'">
      <MediaThumbnail
          v-for="(imageUrl, index) in getImagesWithThumbnail"
          :key="index"
          :index="index"
          :imageUrl="imageUrl"
          :isSelected="selectedImageIndex === index"
          :onSelect="selectImage"
      />
    </Slider>

  </div>
</template>

<script setup lang="ts">
  import type {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
  import MediaThumbnail from "~/components/product/MediaThumbnail.vue";
  import Slider from "~/components/utils/Slider.vue";


  const props = defineProps<{
    product: PricedProduct
  }>();

  const selectedImage: Ref<Nullable<string>> = ref(null);
  const selectedImageIndex: Ref<Nullable<number>> = ref(null);

  const getImagesWithThumbnail = computed((): string[] => {
    if (props.product && props.product.images && props.product.thumbnail) {
      return [props.product.thumbnail, ...props.product.images.map((image: any) => image.url)];
    }
    return [];
  });

  const getSelectedImage = computed((): string => {
    if (props.product && props.product.thumbnail && selectedImageIndex.value === 0) {
      return props.product.thumbnail;
    }
    if (selectedImage.value) {
      return selectedImage.value;
    }
    return '';
  });

  const selectImage = (index: number, imageUrl: string): void => {
    selectedImageIndex.value = index;
    selectedImage.value = imageUrl;
  };

  onMounted(() => {
    selectImage(0, getImagesWithThumbnail.value[0]);
  });

</script>

<style scoped>

</style>
