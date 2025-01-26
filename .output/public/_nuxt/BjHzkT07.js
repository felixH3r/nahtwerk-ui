import{B as $,C as L,D as z,E as C,G as E,H as I,I as H,J as P,K as D,i as w,f as R,L as U,h as W,j as F,o as G,c as T,M as j,k as _,r as J,N as V}from"./Uccz10j0.js";async function Q(e,t){return await X(t).catch(r=>(console.error("Failed to get image meta for "+t,r+""),{width:0,height:0,ratio:0}))}async function X(e){if(typeof Image>"u")throw new TypeError("Image not supported");return new Promise((t,i)=>{const r=new Image;r.onload=()=>{const s={width:r.width,height:r.height,ratio:r.width/r.height};t(s)},r.onerror=s=>i(s),r.src=e})}function A(e){return t=>t?e[t]||t:e.missingValue}function Y({formatter:e,keyMap:t,joinWith:i="/",valueMap:r}={}){e||(e=(n,o)=>`${n}=${o}`),t&&typeof t!="function"&&(t=A(t));const s=r||{};return Object.keys(s).forEach(n=>{typeof s[n]!="function"&&(s[n]=A(s[n]))}),(n={})=>Object.entries(n).filter(([d,c])=>typeof c<"u").map(([d,c])=>{const u=s[d];return typeof u=="function"&&(c=u(n[d])),d=typeof t=="function"?t(d):d,e(d,c)}).join(i)}function y(e=""){if(typeof e=="number")return e;if(typeof e=="string"&&e.replace("px","").match(/^\d+$/g))return Number.parseInt(e,10)}function Z(e=""){if(e===void 0||!e.length)return[];const t=new Set;for(const i of e.split(" ")){const r=Number.parseInt(i.replace("x",""));r&&t.add(r)}return Array.from(t)}function K(e){if(e.length===0)throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)")}function ee(e){const t={};if(typeof e=="string")for(const i of e.split(/[\s,]+/).filter(r=>r)){const r=i.split(":");r.length!==2?t["1px"]=r[0].trim():t[r[0].trim()]=r[1].trim()}else Object.assign(t,e);return t}function te(e){const t={options:e},i=(s,n={})=>k(t,s,n),r=(s,n={},o={})=>i(s,{...o,modifiers:E(n,o.modifiers||{})}).url;for(const s in e.presets)r[s]=(n,o,d)=>r(n,o,{...e.presets[s],...d});return r.options=e,r.getImage=i,r.getMeta=(s,n)=>re(t,s,n),r.getSizes=(s,n)=>ne(t,s,n),t.$img=r,r}async function re(e,t,i){const r=k(e,t,{...i});return typeof r.getMeta=="function"?await r.getMeta():await Q(e,r.url)}function k(e,t,i){var u,f;if(t&&typeof t!="string")throw new TypeError(`input must be a string (received ${typeof t}: ${JSON.stringify(t)})`);if(!t||t.startsWith("data:"))return{url:t};const{provider:r,defaults:s}=ie(e,i.provider||e.options.provider),n=se(e,i.preset);if(t=$(t)?t:L(t),!r.supportsAlias){for(const h in e.options.alias)if(t.startsWith(h)){const m=e.options.alias[h];m&&(t=z(m,t.slice(h.length)))}}if(r.validateDomains&&$(t)){const h=C(t).host;if(!e.options.domains.find(m=>m===h))return{url:t}}const o=E(i,n,s);o.modifiers={...o.modifiers};const d=o.modifiers.format;(u=o.modifiers)!=null&&u.width&&(o.modifiers.width=y(o.modifiers.width)),(f=o.modifiers)!=null&&f.height&&(o.modifiers.height=y(o.modifiers.height));const c=r.getImage(t,o,e);return c.format=c.format||d||"",c}function ie(e,t){const i=e.options.providers[t];if(!i)throw new Error("Unknown provider: "+t);return i}function se(e,t){if(!t)return{};if(!e.options.presets[t])throw new Error("Unknown preset: "+t);return e.options.presets[t]}function ne(e,t,i){var b,x,q,a,l;const r=y((b=i.modifiers)==null?void 0:b.width),s=y((x=i.modifiers)==null?void 0:x.height),n=ee(i.sizes),o=(q=i.densities)!=null&&q.trim()?Z(i.densities.trim()):e.options.densities;K(o);const d=r&&s?s/r:0,c=[],u=[];if(Object.keys(n).length>=1){for(const g in n){const p=M(g,String(n[g]),s,d,e);if(p!==void 0){c.push({size:p.size,screenMaxWidth:p.screenMaxWidth,media:`(max-width: ${p.screenMaxWidth}px)`});for(const v of o)u.push({width:p._cWidth*v,src:N(e,t,i,p,v)})}}oe(c)}else for(const g of o){const p=Object.keys(n)[0];let v=p?M(p,String(n[p]),s,d,e):void 0;v===void 0&&(v={size:"",screenMaxWidth:0,_cWidth:(a=i.modifiers)==null?void 0:a.width,_cHeight:(l=i.modifiers)==null?void 0:l.height}),u.push({width:g,src:N(e,t,i,v,g)})}ae(u);const f=u[u.length-1],h=c.length?c.map(g=>`${g.media?g.media+" ":""}${g.size}`).join(", "):void 0,m=h?"w":"x",S=u.map(g=>`${g.src} ${g.width}${m}`).join(", ");return{sizes:h,srcset:S,src:f==null?void 0:f.src}}function M(e,t,i,r,s){const n=s.options.screens&&s.options.screens[e]||Number.parseInt(e),o=t.endsWith("vw");if(!o&&/^\d+$/.test(t)&&(t=t+"px"),!o&&!t.endsWith("px"))return;let d=Number.parseInt(t);if(!n||!d)return;o&&(d=Math.round(d/100*n));const c=r?Math.round(d*r):i;return{size:t,screenMaxWidth:n,_cWidth:d,_cHeight:c}}function N(e,t,i,r,s){return e.$img(t,{...i.modifiers,width:r._cWidth?r._cWidth*s:void 0,height:r._cHeight?r._cHeight*s:void 0},i)}function oe(e){var i;e.sort((r,s)=>r.screenMaxWidth-s.screenMaxWidth);let t=null;for(let r=e.length-1;r>=0;r--){const s=e[r];s.media===t&&e.splice(r,1),t=s.media}for(let r=0;r<e.length;r++)e[r].media=((i=e[r+1])==null?void 0:i.media)||""}function ae(e){e.sort((i,r)=>i.width-r.width);let t=null;for(let i=e.length-1;i>=0;i--){const r=e[i];r.width===t&&e.splice(i,1),t=r.width}}const de=Y({keyMap:{format:"f",fit:"fit",width:"w",height:"h",resize:"s",quality:"q",background:"b"},joinWith:"&",formatter:(e,t)=>I(e)+"_"+I(t)}),ce=(e,{modifiers:t={},baseURL:i}={},r)=>{t.width&&t.height&&(t.resize=`${t.width}x${t.height}`,delete t.width,delete t.height);const s=de(t)||"_";return i||(i=z(r.options.nuxt.baseURL,"/_ipx")),{url:z(i,s,H(e))}},ue=!0,fe=!0,le=Object.freeze(Object.defineProperty({__proto__:null,getImage:ce,supportsAlias:fe,validateDomains:ue},Symbol.toStringTag,{value:"Module"})),O={screens:{xs:320,sm:640,md:768,lg:1024,xl:1280,xxl:1536,"2xl":1536},presets:{},provider:"ipx",domains:[],alias:{},densities:[1,2],format:["webp"]};O.providers={ipx:{provider:le,defaults:{}}};const B=()=>{const e=D(),t=P();return t.$img||t._img||(t._img=te({...O,nuxt:{baseURL:e.app.baseURL},runtimeConfig:e}))};function ge(e){var t;(t=performance==null?void 0:performance.mark)==null||t.call(performance,"mark_feature_usage",{detail:{feature:e}})}const he={src:{type:String,required:!1},format:{type:String,required:!1},quality:{type:[Number,String],required:!1},background:{type:String,required:!1},fit:{type:String,required:!1},modifiers:{type:Object,required:!1},preset:{type:String,required:!1},provider:{type:String,required:!1},sizes:{type:[Object,String],required:!1},densities:{type:String,required:!1},preload:{type:[Boolean,Object],required:!1},width:{type:[String,Number],required:!1},height:{type:[String,Number],required:!1},alt:{type:String,required:!1},referrerpolicy:{type:String,required:!1},usemap:{type:String,required:!1},longdesc:{type:String,required:!1},ismap:{type:Boolean,required:!1},loading:{type:String,required:!1,validator:e=>["lazy","eager"].includes(e)},crossorigin:{type:[Boolean,String],required:!1,validator:e=>["anonymous","use-credentials","",!0,!1].includes(e)},decoding:{type:String,required:!1,validator:e=>["async","auto","sync"].includes(e)},nonce:{type:[String],required:!1}},me=e=>{const t=w(()=>({provider:e.provider,preset:e.preset})),i=w(()=>({width:y(e.width),height:y(e.height),alt:e.alt,referrerpolicy:e.referrerpolicy,usemap:e.usemap,longdesc:e.longdesc,ismap:e.ismap,crossorigin:e.crossorigin===!0?"anonymous":e.crossorigin||void 0,loading:e.loading,decoding:e.decoding,nonce:e.nonce})),r=B(),s=w(()=>({...e.modifiers,width:y(e.width),height:y(e.height),format:e.format,quality:e.quality||r.options.quality,background:e.background,fit:e.fit}));return{options:t,attrs:i,modifiers:s}},pe={...he,placeholder:{type:[Boolean,String,Number,Array],required:!1},placeholderClass:{type:String,required:!1},custom:{type:Boolean,required:!1}},ye=["src"],ve=R({__name:"NuxtImg",props:pe,emits:["load","error"],setup(e,{emit:t}){const i=e,r=U(),s=t,n=!1,o=B(),d=me(i),c=W(!1),u=W(),f=w(()=>o.getSizes(i.src,{...d.options.value,sizes:i.sizes,densities:i.densities,modifiers:{...d.modifiers.value,width:y(i.width),height:y(i.height)}})),h=w(()=>{const a={...d.attrs.value,"data-nuxt-img":""};return(!i.placeholder||c.value)&&(a.sizes=f.value.sizes,a.srcset=f.value.srcset),a}),m=w(()=>{let a=i.placeholder;if(a===""&&(a=!0),!a||c.value)return!1;if(typeof a=="string")return a;const l=Array.isArray(a)?a:typeof a=="number"?[a,a]:[10,10];return o(i.src,{...d.modifiers.value,width:l[0],height:l[1],quality:l[2]||50,blur:l[3]||3},d.options.value)}),S=w(()=>i.sizes?f.value.src:o(i.src,d.modifiers.value,d.options.value)),b=w(()=>m.value?m.value:S.value),q=P().isHydrating;return F(()=>{if(m.value||i.custom){const a=new Image;S.value&&(a.src=S.value),i.sizes&&(a.sizes=f.value.sizes||"",a.srcset=f.value.srcset),a.onload=l=>{c.value=!0,s("load",l)},a.onerror=l=>{s("error",l)},ge("nuxt-image");return}u.value&&(u.value.complete&&q&&(u.value.getAttribute("data-error")?s("error",new Event("error")):s("load",new Event("load"))),u.value.onload=a=>{s("load",a)},u.value.onerror=a=>{s("error",a)})}),(a,l)=>a.custom?J(a.$slots,"default",V(j({key:1},{..._(n)?{onerror:"this.setAttribute('data-error', 1)"}:{},imgAttrs:{...h.value,..._(r)},isLoaded:c.value,src:b.value}))):(G(),T("img",j({key:0,ref_key:"imgEl",ref:u,class:i.placeholder&&!c.value?i.placeholderClass:void 0},{..._(n)?{onerror:"this.setAttribute('data-error', 1)"}:{},...h.value,..._(r)},{src:b.value}),null,16,ye))}});export{ve as _};
