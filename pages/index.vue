<template>
  <div class="bg-primary-100">
    <HeroSection/>
    <FeatureSection/>
    <ContentSection/>
    <CTASection/>
  </div>
</template>

<script setup lang="ts">

  import HeroSection from "~/components/home/HeroSection.vue";
  import FeatureSection from "~/components/home/FeatureSection.vue";
  import CTASection from "~/components/home/CTASection.vue";
  import ContentSection from "~/components/home/ContentSection.vue";
</script>

<style scoped>

</style>
