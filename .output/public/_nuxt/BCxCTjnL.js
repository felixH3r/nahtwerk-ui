import{f as x,o as a,c as o,a as r,t as h,n as V,b as _,g as F,r as A,h as i,i as T,j as D,k as l,w as C,F as j,l as N,m as K,p as Q,s as X,q as W,d as Y}from"./b9GoV8el.js";import{_ as U}from"./CMDbW_qn.js";import{f as ee}from"./CAW2Yp0S.js";import{_ as te}from"./DlAUqK2U.js";const re=x({__name:"VariantsThumbnail",props:{variant:{},isSelected:{},index:{},onSelect:{type:Function}},setup(u){return(t,e)=>(a(),o("div",{class:V([{"border-2 border-gray-600":t.isSelected},"flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-full aspect-square object-cover"]),onClick:e[0]||(e[0]=n=>t.onSelect(t.index,t.variant))},[r("h3",null,h(t.variant.title),1)],2))}}),se={class:"flex flex-col"},ae={class:"text-ellipsis overflow-hidden whitespace-nowrap w-full block"},Z=x({__name:"FabricThumbnail",props:{index:{},fabric:{},isSelected:{},onSelect:{type:Function}},setup(u){return(t,e)=>{const n=U;return a(),o("div",se,[_(n,{class:V([{"border-2 border-gray-600":t.isSelected},"flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-full aspect-square object-cover"]),onClick:e[0]||(e[0]=d=>t.onSelect(t.index,t.fabric)),src:t.fabric.fileUrl},null,8,["class","src"]),r("span",ae,h(t.fabric.fabricName),1)])}}}),le=x({__name:"MediaThumbnail",props:{index:{},imageUrl:{},isSelected:{},onSelect:{type:Function}},setup(u){return(t,e)=>{const n=U;return a(),F(n,{class:V([{"border-2 border-gray-600":t.isSelected},"flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-20 h-20 object-cover"]),onClick:e[0]||(e[0]=d=>t.onSelect(t.index,t.imageUrl)),src:t.imageUrl},null,8,["class","src"])}}}),ne={class:"flex w-full overflow-scroll md:h-56"},oe={class:"flex gap-2 pr-64"},ce=x({__name:"Slider",props:{heightClass:{}},setup(u){return(t,e)=>(a(),o("div",ne,[r("div",oe,[A(t.$slots,"default"),e[0]||(e[0]=r("div",{class:"w-20 flex-shrink-0"},null,-1))]),r("div",{class:V([t.heightClass,"w-32 bg-gradient-to-r from-transparent via-white via-70% white to-white absolute right-0"])},null,2)]))}}),ie={class:"shrink-0 max-w-md lg:max-w-lg mx-auto relative"},ue={class:"z-[-1] relative"},de=x({__name:"ProductImage",props:{product:{}},setup(u){const t=u,e=i(null),n=i(null),d=T(()=>t.product&&t.product.images&&t.product.thumbnail?[t.product.thumbnail,...t.product.images.map(m=>m.url)]:[]),c=T(()=>t.product&&t.product.thumbnail&&n.value===0?t.product.thumbnail:e.value?e.value:""),y=(m,w)=>{n.value=m,e.value=w};return D(()=>{y(0,d.value[0])}),(m,w)=>{const k=U;return a(),o("div",ie,[r("div",ue,[_(k,{class:"w-full max-h-[500px] rounded-lg mb-3 object-cover z-[-1]",src:l(c)},null,8,["src"])]),_(ce,{"height-class":"h-32"},{default:C(()=>[(a(!0),o(j,null,N(l(d),(I,S)=>(a(),F(le,{key:S,index:S,imageUrl:I,isSelected:l(n)===S,onSelect:y},null,8,["index","imageUrl","isSelected"]))),128))]),_:1})])}}}),me={},pe={class:"grid grid-cols-4 gap-3 sm:grid-cols-5 md:gap-4"};function fe(u,t){return a(),o("div",pe,[A(u.$slots,"default")])}const P=te(me,[["render",fe]]),ge={class:"py-8 md:py-16 dark:bg-gray-900 antialiased"},ve={class:"max-w-screen-xl px-4 mx-auto 2xl:px-0"},be={class:"lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16"},_e={class:"mt-6 sm:mt-8 lg:mt-0"},he={class:"text-4xl font-semibold text-gray-900dark:text-white"},xe={class:"mt-4 mb-8 sm:items-center sm:gap-4 sm:flex"},ye={class:"text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white"},we={key:0,class:"mb-8"},ke={class:"mb-4 text-xl font-bold"},Se={key:1,class:"mb-8"},Fe={class:"mb-8"},Ie={class:"mb-6 text-gray-500 dark:text-gray-400"},Te=x({__name:"[productTitle]",setup(u){const t=K(),e=i(null),n=Q(),{products:d}=X(n),c=i(null),y=i(null),m=i(null),w=i(null),k=i(null),I=i(null),S=T(()=>{const p=t.params.productTitle;if(d.value){const s=d.value.find($=>$.handle===p);if(s)return s}return null}),E=T(()=>!c||!c.value||!c.value.calculated_price?"0,00":ee(c.value.calculated_price)),B=(p,s)=>{w.value=p,m.value=s},M=(p,s)=>{I.value=p,k.value=s},q=(p,s)=>{y.value=p,c.value=s},J=async()=>{c.value&&c.value.id&&await n.addToCart(c.value.id,{innerFabric:m.value?m.value:{fileUrl:"-",fabricName:"-"},outerFabric:k.value?k.value:{fileUrl:"-",fabricName:"-"}})};return D(async()=>{d.value||await n.fetchProducts(),e.value=S.value,e.value&&(q(0,e.value.variants[0]),e.value.metadata&&e.value.metadata.innerFabrics&&B(0,e.value.metadata.innerFabrics[0]),e.value.metadata&&e.value.metadata.outerFabrics&&M(0,e.value.metadata.outerFabrics[0]))}),(p,s)=>{var $,z,H,O,G,L,R;return a(),o("section",ge,[r("div",ve,[r("div",be,[r("div",null,[_(de,{product:l(e),class:"sticky top-24"},null,8,["product"])]),r("div",_e,[r("h1",he,h(($=l(e))==null?void 0:$.title),1),r("div",xe,[r("p",ye," € "+h(l(E)),1)]),((H=(z=l(e))==null?void 0:z.metadata)==null?void 0:H.innerFabrics.length)>0?(a(),o("div",we,[r("h2",ke,h(((O=l(e))==null?void 0:O.metadata.outerFabrics.length)>0?"Innenstoff:":"Stoff:"),1),_(P,null,{default:C(()=>{var f,g;return[(a(!0),o(j,null,N((g=(f=l(e))==null?void 0:f.metadata)==null?void 0:g.innerFabrics,(v,b)=>(a(),F(Z,{key:b,index:b,fabric:v,isSelected:l(w)===b,onSelect:B},null,8,["index","fabric","isSelected"]))),128))]}),_:1})])):W("",!0),((L=(G=l(e))==null?void 0:G.metadata)==null?void 0:L.outerFabrics.length)>0?(a(),o("div",Se,[s[0]||(s[0]=r("h2",{class:"mb-4 text-xl font-bold"},"Außenstoff:",-1)),_(P,null,{default:C(()=>{var f,g;return[(a(!0),o(j,null,N((g=(f=l(e))==null?void 0:f.metadata)==null?void 0:g.outerFabrics,(v,b)=>(a(),F(Z,{key:b,index:b,fabric:v,isSelected:l(I)===b,onSelect:M},null,8,["index","fabric","isSelected"]))),128))]}),_:1})])):W("",!0),r("div",Fe,[s[1]||(s[1]=r("h2",{class:"mb-4 text-xl font-bold"},"Größe:",-1)),_(P,null,{default:C(()=>{var f;return[(a(!0),o(j,null,N((f=l(e))==null?void 0:f.variants,(g,v)=>(a(),F(re,{key:v,index:v,variant:g,isSelected:l(y)===v,onSelect:q},null,8,["index","variant","isSelected"]))),128))]}),_:1})]),r("p",Ie,h((R=l(e))==null?void 0:R.description),1),r("div",{onClick:J,class:"mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8"},s[2]||(s[2]=[r("a",{href:"#",title:"",class:"text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center",role:"button"},[r("svg",{class:"w-5 h-5 -ms-2 me-2","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"none",viewBox:"0 0 24 24"},[r("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"})]),Y(" In den Warenkorb ")],-1)])),s[3]||(s[3]=r("hr",{class:"my-6 md:my-8 border-gray-200 dark:border-gray-800"},null,-1))])])])])}}});export{Te as default};
