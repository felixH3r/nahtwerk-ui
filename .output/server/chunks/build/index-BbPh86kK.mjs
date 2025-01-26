import { defineComponent, mergeProps, useSSRContext, withCtx, createTextVNode, openBlock, createBlock, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-wdF35zEx.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_1 } from './nuxt-img-CKtKb6nK.mjs';
import '../nitro/nitro.mjs';
import 'lru-cache';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import 'ipx';
import './server.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@unhead/addons';
import 'axios';
import 'retry-axios';
import 'qs';
import 'crypto';

const _sfc_main$4 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-primary-100 dark:bg-gray-900 w-full" }, _attrs))}><div class="flex flex-col-reverse md:flex-row max-w-screen-xl px-4 py-8 mx-auto h-svh w-full justify-end md:justify-between items-center"><div class="flex flex-col h-full justify-center md:mt-0"><h1 class="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"> Hallo das ist Nahtwerk</h1><p class="max-w-2xl mb-6 font-extralight text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Tauche ein in die Welt von Nahtwerk und lasse dich begeistern.</p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/shop",
    class: "inline-flex items-center justify-center w-64 px-5 py-3 mr-3 text-base font-light text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Schau&#39;s dir jetzt an <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"${_scopeId}></path></svg>`);
      } else {
        return [
          createTextVNode(" Schau's dir jetzt an "),
          (openBlock(), createBlock("svg", {
            class: "w-5 h-5 ml-2 -mr-1",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            createVNode("path", {
              "fill-rule": "evenodd",
              d: "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z",
              "clip-rule": "evenodd"
            })
          ]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="md:h-3/4 md:mt-0 md:col-span-5 md:flex rounded-full shadow-2xl"><img src="https://nahtwerk-uploads.s3.amazonaws.com/Startseite_img.png" class="object-cover rounded-full" alt="mockup"></div></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HeroSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : undefined;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$3 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "dark:bg-gray-900 mb-10" }, _attrs))}><div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6"><div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0"><div><div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.12695 13.218L12.026 21L20.2707 12.8774" stroke="#231F20" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" class="my-path"></path><path d="M12.0039 4.68819C14.2887 2.43727 18.0014 2.43727 20.2862 4.68819C22.571 6.94652 22.571 10.5969 20.2937 12.8552" stroke="#231F20" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" class="my-path"></path><path d="M11.9959 4.68819C9.71112 2.43727 5.99836 2.43727 3.71358 4.68819C1.42881 6.93912 1.42881 10.5969 3.71358 12.8478M3.71358 12.8478L3.73297 12.8668M3.71358 12.8478L4.11943 13.2106" stroke="#231F20" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" class="my-path"></path></svg></div><h3 class="mb-2 text-xl font-bold dark:text-white">Mit Liebe gemacht</h3><p class="text-gray-500 dark:text-gray-400">Babykleidung, liebevoll von Hand gefertigt. Jeder Stich und jedes Detail strahlt individualit\xE4t aus.</p></div><div><div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21L20.3282 16.0077C20.6616 15.5075 20.8284 15.2574 20.9142 14.974C21 14.6906 21 14.39 21 13.7889V9.5C21 8.67157 20.3284 8 19.5 8C18.6716 8 18 8.67157 18 9.5V12.6667C18 13.3275 18 13.6579 17.8974 13.9658C17.7947 14.2737 17.5965 14.538 17.2 15.0667L16.5 16" stroke="black" stroke-width="2" stroke-linecap="round" class="my-path"></path><path d="M7 21L3.6718 16.0077C3.33835 15.5075 3.17163 15.2574 3.08582 14.974C3 14.6906 3 14.39 3 13.7889V9.5C3 8.67157 3.67157 8 4.5 8C5.32843 8 6 8.67157 6 9.5V12.6667C6 13.3275 6 13.6579 6.10263 13.9658C6.20527 14.2737 6.40351 14.538 6.8 15.0667L7.5 16" stroke="black" stroke-width="2" stroke-linecap="round" class="my-path"></path><path d="M14 21.0001V17.1232C14 15.7035 14 14.9937 14.2986 14.5104C14.5496 14.1041 14.9377 13.8011 15.3928 13.6561C15.934 13.4836 16.6227 13.6558 18 14.0001" stroke="black" stroke-width="2" stroke-linecap="round" class="my-path"></path><path d="M10 21.0001V17.1232C10 15.7035 10 14.9937 9.70142 14.5104C9.45039 14.1041 9.06226 13.8011 8.60722 13.6561C8.066 13.4836 7.37733 13.6558 6 14.0001" stroke="black" stroke-width="2" stroke-linecap="round" class="my-path"></path><path d="M8.34887 7.44953C8.40233 7.50558 8.45764 7.55851 8.51459 7.60834L10.5486 9.74053C11.2279 10.4527 11.5676 10.8088 11.9957 10.8088C12.4238 10.8088 12.7635 10.4527 13.4429 9.74053L15.2859 7.80854C15.32 7.77278 15.337 7.75489 15.3525 7.73999C15.368 7.72509 15.4107 7.68742 15.4961 7.61207C15.5501 7.56441 15.6026 7.51393 15.6535 7.46064C16.6216 6.44581 16.6155 4.79413 15.64 3.77149C14.6645 2.74886 13.0889 2.74253 12.1208 3.75736C12.0534 3.82799 11.937 3.82946 11.8696 3.75883C10.9015 2.744 9.32858 2.74752 8.35636 3.76668C7.38414 4.78584 7.38079 6.43471 8.34887 7.44953Z" stroke="black" stroke-width="2" class="my-path"></path></svg></div><h3 class="mb-2 text-xl font-bold dark:text-white">Regional &amp; Nachhaltig</h3><p class="text-gray-500 dark:text-gray-400">Babykleidung, die auf Regionalit\xE4t und Nachhaltigkeit setzt. Meine Stoffe beziehe ich von regionalen H\xE4ndlern.</p></div><div><div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.9983 19.3008C22.9983 15.6557 20.0433 12.7007 16.3982 12.7007M16.3982 12.7007C12.753 12.7007 9.79803 15.6557 9.79803 19.3008M16.3982 12.7007C14.2718 12.7007 12.5481 10.9764 12.5481 8.85007C12.5481 6.72374 14.2719 5 16.3982 5C18.5245 5 20.2483 6.72374 20.2483 8.85007C20.2483 10.9764 18.5245 12.7007 16.3982 12.7007ZM1 18.2008C1 15.1632 3.46248 12.7007 6.50011 12.7007C8.0387 12.7007 9.42974 13.3324 10.428 14.3507M3.74818 9.87261C3.74818 11.3914 4.97942 12.6227 6.49823 12.6227C8.01704 12.6227 9.24828 11.3914 9.24828 9.87261C9.24828 8.3538 8.01704 7.12256 6.49823 7.12256C4.97942 7.12256 3.74818 8.3538 3.74818 9.87261Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="my-path"></path></svg></div><h3 class="mb-2 text-xl font-bold dark:text-white">Entwicklungsgerecht</h3><p class="text-gray-500 dark:text-gray-400">Als Physiotherapeutin achte ich auf entwicklungsgerechte und unterst\xFCtzende Schnitte.</p></div></div></div></section>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeatureSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const FeatureSection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtImg = __nuxt_component_1;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "dark:bg-gray-900 pb-10" }, _attrs))}><div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">`);
  _push(ssrRenderComponent(_component_NuxtImg, {
    loading: "lazy",
    class: "w-full rounded-lg",
    src: "https://plattenshop-uploads.s3.eu-central-1.amazonaws.com/WhatsApp+Image+2024-11-26+at+09.55.02.jpeg",
    alt: "dashboard image"
  }, null, _parent));
  _push(`<div class="mt-4 md:mt-0"><h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Lass uns zusammen die perfekte Babykleidung schaffen!</h2><p class="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">Bei Nahtwerk steht Qualit\xE4t und Liebe zum Detail an erster Stelle. Ich bin Magdalena, der kreative Kopf hinter Nahtwerk, und fertige handgemachte Babykleidung, die nicht nur weich und bequem ist, sondern auch durch ihr einzigartiges Design besticht. Jedes Kleidungsst\xFCck wird mit Sorgfalt und Leidenschaft gen\xE4ht, um sicherzustellen, dass dein kleiner Liebling nur das Beste tr\xE4gt. Entdecke handgefertigte Babymode, die ebenso sch\xF6n wie praktisch ist. Ich freue mich darauf, dein Baby in Nahtwerk einzukleiden!</p><a href="/shop" class="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900"> Jetzt entdecken! <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></a></div></div></section>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/CTASection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const CTASection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "dark:bg-gray-900 mb-10" }, _attrs))}><div class="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6"><div class="font-light text-gray-500 sm:text-lg dark:text-gray-400"><h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Wir haben das Rad nicht neu erfunden \u2013 aber jedes St\xFCck mit Liebe gemacht.</h2><p class="mb-4">Bei Nahtwerk geht es nicht um Massenproduktion, sondern um handgemachte Babykleidung, die mit viel Herz und Liebe zum Detail entsteht. Jedes meiner St\xFCcke ist sorgf\xE4ltig gefertigt, um den besonderen Bed\xFCrfnissen deines Babys gerecht zu werden. Ich lege gro\xDFen Wert auf Qualit\xE4t und Nachhaltigkeit. Alle Materialien sind weich, hautfreundlich und perfekt f\xFCr die empfindliche Babyhaut geeignet. Klein, aber fein \u2013 bei Nahtwerk steht die Individualit\xE4t und das Wohlbefinden deines Babys im Vordergrund. Mit Nahtwerk entscheidest du dich f\xFCr langlebige Babykleidung, die nicht nur gut aussieht, sondern auch praktisch und komfortabel ist. </p></div><div class="grid grid-cols-2 gap-4 mt-8"><img class="w-full rounded-lg" src="https://plattenshop-uploads.s3.eu-central-1.amazonaws.com/WhatsApp+Image+2024-11-27+at+12.01.02+(1).jpeg" alt="office content 1"><img class="mt-4 w-full lg:mt-10 rounded-lg" src="https://plattenshop-uploads.s3.eu-central-1.amazonaws.com/WhatsApp+Image+2024-11-27+at+11.51.16+(1).jpeg" alt="office content 2"></div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/ContentSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const ContentSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-primary-100" }, _attrs))}>`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(ssrRenderComponent(FeatureSection, null, null, _parent));
      _push(ssrRenderComponent(ContentSection, null, null, _parent));
      _push(ssrRenderComponent(CTASection, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BbPh86kK.mjs.map
