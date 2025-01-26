import{U as P,f as N,h as R,J as k,j as T,a5 as U,a6 as E,a7 as S,a8 as O,a9 as D,R as _,aa as A,ab as I,ac as V,i as b,B as w,D as F,A as H,K as z,ad as M,ae as $}from"./Uccz10j0.js";async function L(t,n=P()){const{path:o,matched:p}=n.resolve(t);if(!p.length||(n._routePreloaded||(n._routePreloaded=new Set),n._routePreloaded.has(o)))return;const e=n._preloadPromises=n._preloadPromises||[];if(e.length>4)return Promise.all(e).then(()=>L(t,n));n._routePreloaded.add(o);const a=p.map(i=>{var r;return(r=i.components)==null?void 0:r.default}).filter(i=>typeof i=="function");for(const i of a){const r=Promise.resolve(i()).catch(()=>{}).finally(()=>e.splice(e.indexOf(r)));e.push(r)}await Promise.all(e)}const J=(...t)=>t.find(n=>n!==void 0);function K(t){const n=t.componentName||"NuxtLink";function o(e,a){if(!e||t.trailingSlash!=="append"&&t.trailingSlash!=="remove")return e;if(typeof e=="string")return q(e,t.trailingSlash);const i="path"in e&&e.path!==void 0?e.path:a(e).path;return{...e,name:void 0,path:q(i,t.trailingSlash)}}function p(e){const a=P(),i=z(),r=b(()=>!!e.target&&e.target!=="_self"),c=b(()=>{const f=e.to||e.href||"";return typeof f=="string"&&w(f,{acceptRelative:!0})}),y=A("RouterLink"),h=y&&typeof y!="string"?y.useLink:void 0,v=b(()=>{if(e.external)return!0;const f=e.to||e.href||"";return typeof f=="object"?!1:f===""||c.value}),u=b(()=>{const f=e.to||e.href||"";return v.value?f:o(f,a.resolve)}),d=v.value||h==null?void 0:h({...e,to:u}),g=b(()=>{var f;if(!u.value||c.value)return u.value;if(v.value){const s=typeof u.value=="object"&&"path"in u.value?S(u.value):u.value,m=typeof s=="object"?a.resolve(s).href:s;return o(m,a.resolve)}return typeof u.value=="object"?((f=a.resolve(u.value))==null?void 0:f.href)??null:o(F(i.app.baseURL,u.value),a.resolve)});return{to:u,hasTarget:r,isAbsoluteUrl:c,isExternal:v,href:g,isActive:(d==null?void 0:d.isActive)??b(()=>u.value===a.currentRoute.value.path),isExactActive:(d==null?void 0:d.isExactActive)??b(()=>u.value===a.currentRoute.value.path),route:(d==null?void 0:d.route)??b(()=>a.resolve(u.value)),async navigate(){await H(g.value,{replace:e.replace,external:v.value||r.value})}}}return N({name:n,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},useLink:p,setup(e,{slots:a}){const i=P(),{to:r,href:c,navigate:y,isExternal:h,hasTarget:v,isAbsoluteUrl:u}=p(e),d=R(!1),g=R(null),f=s=>{var m;g.value=e.custom?(m=s==null?void 0:s.$el)==null?void 0:m.nextElementSibling:s==null?void 0:s.$el};if(e.prefetch!==!1&&e.noPrefetch!==!0&&e.target!=="_blank"&&!W()){const m=k();let x,l=null;T(()=>{const j=Q();U(()=>{x=E(()=>{var C;(C=g==null?void 0:g.value)!=null&&C.tagName&&(l=j.observe(g.value,async()=>{l==null||l(),l=null;const B=typeof r.value=="string"?r.value:h.value?S(r.value):i.resolve(r.value).fullPath;await Promise.all([m.hooks.callHook("link:prefetch",B).catch(()=>{}),!h.value&&!v.value&&L(r.value,i).catch(()=>{})]),d.value=!0}))})})}),O(()=>{x&&D(x),l==null||l(),l=null})}return()=>{var x;if(!h.value&&!v.value){const l={ref:f,to:r.value,activeClass:e.activeClass||t.activeClass,exactActiveClass:e.exactActiveClass||t.exactActiveClass,replace:e.replace,ariaCurrentValue:e.ariaCurrentValue,custom:e.custom};return e.custom||(d.value&&(l.class=e.prefetchedClass||t.prefetchedClass),l.rel=e.rel||void 0),_(A("RouterLink"),l,a.default)}const s=e.target||null,m=J(e.noRel?"":e.rel,t.externalRelAttribute,u.value||v.value?"noopener noreferrer":"")||null;return e.custom?a.default?a.default({href:c.value,navigate:y,get route(){if(!c.value)return;const l=new URL(c.value,window.location.href);return{path:l.pathname,fullPath:l.pathname,get query(){return I(l.search)},hash:l.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:c.value}},rel:m,target:s,isExternal:h.value||v.value,isActive:!1,isExactActive:!1}):null:_("a",{ref:g,href:c.value||null,rel:m,target:s},(x=a.default)==null?void 0:x.call(a))}}})}const X=K(V);function q(t,n){const o=n==="append"?M:$;return w(t)&&!t.startsWith("http")?t:o(t,!0)}function Q(){const t=k();if(t._observer)return t._observer;let n=null;const o=new Map,p=(a,i)=>(n||(n=new IntersectionObserver(r=>{for(const c of r){const y=o.get(c.target);(c.isIntersecting||c.intersectionRatio>0)&&y&&y()}})),o.set(a,i),n.observe(a),()=>{o.delete(a),n.unobserve(a),o.size===0&&(n.disconnect(),n=null)});return t._observer={observe:p}}function W(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}export{X as _};
