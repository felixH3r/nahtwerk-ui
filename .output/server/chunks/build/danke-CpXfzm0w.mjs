import { _ as __nuxt_component_0 } from './nuxt-link-Dgb6-tnq.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
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
import '@unhead/schema-org/vue';
import 'axios';
import 'retry-axios';
import 'qs';
import 'crypto';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex items-start justify-center px-4 py-32" }, _attrs))}><div class="bg-white rounded-lg max-w-lg text-center p-8 pt-16"><h1 class="text-3xl font-bold mb-4">Danke f\xFCr deine Anfrage!</h1><p class="text-gray-600 dark:text-gray-300 mb-6"> Wir melden uns in k\xFCrze bei dir. </p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "inline-flex items-center justify-center w-64 px-5 py-3 mr-3 text-base font-light text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Weiter einkaufen `);
      } else {
        return [
          createTextVNode(" Weiter einkaufen ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/danke.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const danke = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { danke as default };
//# sourceMappingURL=danke-CpXfzm0w.mjs.map
