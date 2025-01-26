import { k as defineEventHandler } from '../../../nitro/nitro.mjs';
import { i as imageEventHandler } from '../../../_/eventHandlers.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'vue';
import 'consola/core';
import 'node:url';
import 'ipx';
import '@unhead/ssr';
import 'unhead';

const image = defineEventHandler(imageEventHandler);

export { image as default };
//# sourceMappingURL=image.mjs.map
