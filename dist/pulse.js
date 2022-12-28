const G={svg:"http://www.w3.org/2000/svg",xmlns:"http://www.w3.org/2000/xmlns/",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",ct:"http://gionkunz.github.com/chartist-js/ct"},we=8,k={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};function ee(i,e){return typeof i=="number"?i+e:i}function T(i){if(typeof i=="string"){const e=/^(\d+)\s*(.*)$/g.exec(i);return{value:e?+e[1]:0,unit:(e==null?void 0:e[2])||void 0}}return{value:Number(i)}}function le(i){return String.fromCharCode(97+i%26)}const F=2221e-19;function ye(i){return Math.floor(Math.log(Math.abs(i))/Math.LN10)}function X(i,e,n){return e/n.range*i}function be(i,e){const n=Math.pow(10,e||we);return Math.round(i*n)/n}function Ee(i){if(i===1)return i;function e(a,l){return a%l===0?l:e(l,a%l)}function n(a){return a*a+1}let t=2,s=2,r;if(i%2===0)return 2;do t=n(t)%i,s=n(n(s))%i,r=e(Math.abs(t-s),i);while(r===1);return r}function Q(i,e,n,t){const s=(t-90)*Math.PI/180;return{x:i+n*Math.cos(s),y:e+n*Math.sin(s)}}function Ae(i,e,n){let t=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;const s={high:e.high,low:e.low,valueRange:0,oom:0,step:0,min:0,max:0,range:0,numberOfSteps:0,values:[]};s.valueRange=s.high-s.low,s.oom=ye(s.valueRange),s.step=Math.pow(10,s.oom),s.min=Math.floor(s.low/s.step)*s.step,s.max=Math.ceil(s.high/s.step)*s.step,s.range=s.max-s.min,s.numberOfSteps=Math.round(s.range/s.step);const a=X(i,s.step,s)<n,l=t?Ee(s.range):0;if(t&&X(i,1,s)>=n)s.step=1;else if(t&&l<s.step&&X(i,l,s)>=n)s.step=l;else{let u=0;for(;;){if(a&&X(i,s.step,s)<=n)s.step*=2;else if(!a&&X(i,s.step/2,s)>=n){if(s.step/=2,t&&s.step%1!==0){s.step*=2;break}}else break;if(u++>1e3)throw new Error("Exceeded maximum number of iterations while optimizing scale step!")}}s.step=Math.max(s.step,F);function o(u,d){return u===(u+=d)&&(u*=1+(d>0?F:-F)),u}let f=s.min,c=s.max;for(;f+s.step<=s.low;)f=o(f,s.step);for(;c-s.step>=s.high;)c=o(c,-s.step);s.min=f,s.max=c,s.range=s.max-s.min;const m=[];for(let u=s.min;u<=s.max;u=o(u,s.step)){const d=be(u);d!==m[m.length-1]&&m.push(d)}return s.values=m,s}function P(){let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};for(var e=arguments.length,n=new Array(e>1?e-1:0),t=1;t<e;t++)n[t-1]=arguments[t];for(let s=0;s<n.length;s++){const r=n[s];for(const a in r){const l=r[a];typeof l=="object"&&l!==null&&!(l instanceof Array)?i[a]=P(i[a],l):i[a]=l}}return i}const q=i=>i;function te(i,e){return Array.from({length:i},e?(n,t)=>e(t):()=>{})}const Me=(i,e)=>i+(e||0);function w(i,e){return i!==null&&typeof i=="object"&&Reflect.has(i,e)}function R(i){return i!==null&&isFinite(i)}function oe(i){return!i&&i!==0}function j(i){return R(i)?Number(i):void 0}function Ne(i){return Array.isArray(i)?i.every(Array.isArray):!1}function Oe(i,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,t=0;i[n?"reduceRight":"reduce"]((s,r,a)=>e(r,t++,a),void 0)}function Le(i,e){const n=Array.isArray(i)?i[e]:w(i,"data")?i.data[e]:null;return w(n,"meta")?n.meta:void 0}function ue(i){return i==null||typeof i=="number"&&isNaN(i)}function Ce(i){return Array.isArray(i)&&i.every(e=>Array.isArray(e)||w(e,"data"))}function Se(i){return typeof i=="object"&&i!==null&&(Reflect.has(i,"x")||Reflect.has(i,"y"))}function _(i){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"y";return Se(i)&&w(i,e)?j(i[e]):j(i)}function ze(i,e,n){e={...e,...n?n==="x"?e.axisX:e.axisY:{}};const t={high:e.high===void 0?-Number.MAX_VALUE:+e.high,low:e.low===void 0?Number.MAX_VALUE:+e.low},s=e.high===void 0,r=e.low===void 0;function a(l){if(!ue(l))if(Array.isArray(l))for(let o=0;o<l.length;o++)a(l[o]);else{const o=Number(n&&w(l,n)?l[n]:l);s&&o>t.high&&(t.high=o),r&&o<t.low&&(t.low=o)}}return(s||r)&&a(i),(e.referenceValue||e.referenceValue===0)&&(t.high=Math.max(e.referenceValue,t.high),t.low=Math.min(e.referenceValue,t.low)),t.high<=t.low&&(t.low===0?t.high=1:t.low<0?t.high=0:(t.high>0||(t.high=1),t.low=0)),t}function ce(i){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=arguments.length>2?arguments[2]:void 0,t=arguments.length>3?arguments[3]:void 0,s;const r={labels:(i.labels||[]).slice(),series:Ie(i.series,n,t)},a=r.labels.length;return Ne(r.series)?(s=Math.max(a,...r.series.map(l=>l.length)),r.series.forEach(l=>{l.push(...te(Math.max(0,s-l.length)))})):s=r.series.length,r.labels.push(...te(Math.max(0,s-a),()=>"")),e&&je(r),r}function je(i){var e;(e=i.labels)===null||e===void 0||e.reverse(),i.series.reverse();for(const n of i.series)w(n,"data")?n.data.reverse():Array.isArray(n)&&n.reverse()}function Pe(i,e){let n,t;if(typeof i!="object"){const s=j(i);e==="x"?n=s:t=s}else w(i,"x")&&(n=j(i.x)),w(i,"y")&&(t=j(i.y));if(!(n===void 0&&t===void 0))return{x:n,y:t}}function ne(i,e){if(!ue(i))return e?Pe(i,e):j(i)}function Z(i,e){return Array.isArray(i)?i.map(n=>w(n,"value")?ne(n.value,e):ne(n,e)):Z(i.data,e)}function Ie(i,e,n){if(Ce(i))return i.map(s=>Z(s,e));const t=Z(i,e);return n?t.map(s=>[s]):t}function he(i,e,n){const t={increasingX:!1,fillHoles:!1,...n},s=[];let r=!0;for(let a=0;a<i.length;a+=2)_(e[a/2].value)===void 0?t.fillHoles||(r=!0):(t.increasingX&&a>=2&&i[a]<=i[a-2]&&(r=!0),r&&(s.push({pathCoordinates:[],valueData:[]}),r=!1),s[s.length-1].pathCoordinates.push(i[a],i[a+1]),s[s.length-1].valueData.push(e[a/2]));return s}function J(i){let e="";return i==null?i:(typeof i=="number"?e=""+i:typeof i=="object"?e=JSON.stringify({data:i}):e=String(i),Object.keys(k).reduce((n,t)=>n.replaceAll(t,k[t]),e))}class Be{call(e,n){return this.svgElements.forEach(t=>Reflect.apply(t[e],t,n)),this}attr(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("attr",n)}elem(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("elem",n)}root(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("root",n)}getNode(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("getNode",n)}foreignObject(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("foreignObject",n)}text(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("text",n)}empty(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("empty",n)}remove(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("remove",n)}addClass(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("addClass",n)}removeClass(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("removeClass",n)}removeAllClasses(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("removeAllClasses",n)}animate(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.call("animate",n)}constructor(e){this.svgElements=[];for(let n=0;n<e.length;n++)this.svgElements.push(new O(e[n]))}}const fe={easeInSine:[.47,0,.745,.715],easeOutSine:[.39,.575,.565,1],easeInOutSine:[.445,.05,.55,.95],easeInQuad:[.55,.085,.68,.53],easeOutQuad:[.25,.46,.45,.94],easeInOutQuad:[.455,.03,.515,.955],easeInCubic:[.55,.055,.675,.19],easeOutCubic:[.215,.61,.355,1],easeInOutCubic:[.645,.045,.355,1],easeInQuart:[.895,.03,.685,.22],easeOutQuart:[.165,.84,.44,1],easeInOutQuart:[.77,0,.175,1],easeInQuint:[.755,.05,.855,.06],easeOutQuint:[.23,1,.32,1],easeInOutQuint:[.86,0,.07,1],easeInExpo:[.95,.05,.795,.035],easeOutExpo:[.19,1,.22,1],easeInOutExpo:[1,0,0,1],easeInCirc:[.6,.04,.98,.335],easeOutCirc:[.075,.82,.165,1],easeInOutCirc:[.785,.135,.15,.86],easeInBack:[.6,-.28,.735,.045],easeOutBack:[.175,.885,.32,1.275],easeInOutBack:[.68,-.55,.265,1.55]};function se(i,e,n){let t=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1,s=arguments.length>4?arguments[4]:void 0;const{easing:r,...a}=n,l={};let o,f;r&&(o=Array.isArray(r)?r:fe[r]),a.begin=ee(a.begin,"ms"),a.dur=ee(a.dur,"ms"),o&&(a.calcMode="spline",a.keySplines=o.join(" "),a.keyTimes="0;1"),t&&(a.fill="freeze",l[e]=a.from,i.attr(l),f=T(a.begin||0).value,a.begin="indefinite");const c=i.elem("animate",{attributeName:e,...a});t&&setTimeout(()=>{try{c._node.beginElement()}catch{l[e]=a.to,i.attr(l),c.remove()}},f);const m=c.getNode();s&&m.addEventListener("beginEvent",()=>s.emit("animationBegin",{element:i,animate:m,params:n})),m.addEventListener("endEvent",()=>{s&&s.emit("animationEnd",{element:i,animate:m,params:n}),t&&(l[e]=a.to,i.attr(l),c.remove())})}class O{attr(e,n){return typeof e=="string"?n?this._node.getAttributeNS(n,e):this._node.getAttribute(e):(Object.keys(e).forEach(t=>{if(e[t]!==void 0)if(t.indexOf(":")!==-1){const s=t.split(":");this._node.setAttributeNS(G[s[0]],t,String(e[t]))}else this._node.setAttribute(t,String(e[t]))}),this)}elem(e,n,t){let s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;return new O(e,n,t,this,s)}parent(){return this._node.parentNode instanceof SVGElement?new O(this._node.parentNode):null}root(){let e=this._node;for(;e.nodeName!=="svg"&&e.parentElement;)e=e.parentElement;return new O(e)}querySelector(e){const n=this._node.querySelector(e);return n?new O(n):null}querySelectorAll(e){const n=this._node.querySelectorAll(e);return new Be(n)}getNode(){return this._node}foreignObject(e,n,t){let s=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1,r;if(typeof e=="string"){const l=document.createElement("div");l.innerHTML=e,r=l.firstChild}else r=e;r instanceof Element&&r.setAttribute("xmlns",G.xmlns);const a=this.elem("foreignObject",n,t,s);return a._node.appendChild(r),a}text(e){return this._node.appendChild(document.createTextNode(e)),this}empty(){for(;this._node.firstChild;)this._node.removeChild(this._node.firstChild);return this}remove(){var e;return(e=this._node.parentNode)===null||e===void 0||e.removeChild(this._node),this.parent()}replace(e){var n;return(n=this._node.parentNode)===null||n===void 0||n.replaceChild(e._node,this._node),e}append(e){return(arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1)&&this._node.firstChild?this._node.insertBefore(e._node,this._node.firstChild):this._node.appendChild(e._node),this}classes(){const e=this._node.getAttribute("class");return e?e.trim().split(/\s+/):[]}addClass(e){return this._node.setAttribute("class",this.classes().concat(e.trim().split(/\s+/)).filter(function(n,t,s){return s.indexOf(n)===t}).join(" ")),this}removeClass(e){const n=e.trim().split(/\s+/);return this._node.setAttribute("class",this.classes().filter(t=>n.indexOf(t)===-1).join(" ")),this}removeAllClasses(){return this._node.setAttribute("class",""),this}height(){return this._node.getBoundingClientRect().height}width(){return this._node.getBoundingClientRect().width}animate(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0,t=arguments.length>2?arguments[2]:void 0;return Object.keys(e).forEach(s=>{const r=e[s];Array.isArray(r)?r.forEach(a=>se(this,s,a,!1,t)):se(this,s,r,n,t)}),this}constructor(e,n,t,s,r=!1){e instanceof Element?this._node=e:(this._node=document.createElementNS(G.svg,e),e==="svg"&&this.attr({"xmlns:ct":G.ct})),n&&this.attr(n),t&&this.addClass(t),s&&(r&&s._node.firstChild?s._node.insertBefore(this._node,s._node.firstChild):s._node.appendChild(this._node))}}O.Easing=fe;function me(i){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"100%",n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"100%",t=arguments.length>3?arguments[3]:void 0;Array.from(i.querySelectorAll("svg")).filter(r=>r.getAttributeNS(G.xmlns,"ct")).forEach(r=>i.removeChild(r));const s=new O("svg").attr({width:e,height:n}).attr({style:"width: ".concat(e,"; height: ").concat(n,";")});return t&&s.addClass(t),i.appendChild(s.getNode()),s}function Xe(i){return typeof i=="number"?{top:i,right:i,bottom:i,left:i}:i===void 0?{top:0,right:0,bottom:0,left:0}:{top:typeof i.top=="number"?i.top:0,right:typeof i.right=="number"?i.right:0,bottom:typeof i.bottom=="number"?i.bottom:0,left:typeof i.left=="number"?i.left:0}}function de(i,e){var n,t,s,r;const a=Boolean(e.axisX||e.axisY),l=((n=e.axisY)===null||n===void 0?void 0:n.offset)||0,o=((t=e.axisX)===null||t===void 0?void 0:t.offset)||0,f=(s=e.axisY)===null||s===void 0?void 0:s.position,c=(r=e.axisX)===null||r===void 0?void 0:r.position;let m=i.width()||T(e.width).value||0,u=i.height()||T(e.height).value||0;const d=Xe(e.chartPadding);m=Math.max(m,l+d.left+d.right),u=Math.max(u,o+d.top+d.bottom);const h={x1:0,x2:0,y1:0,y2:0,padding:d,width(){return this.x2-this.x1},height(){return this.y1-this.y2}};return a?(c==="start"?(h.y2=d.top+o,h.y1=Math.max(u-d.bottom,h.y2+1)):(h.y2=d.top,h.y1=Math.max(u-d.bottom-o,h.y2+1)),f==="start"?(h.x1=d.left+l,h.x2=Math.max(m-d.right,h.x1+1)):(h.x1=d.left,h.x2=Math.max(m-d.right-l,h.x1+1))):(h.x1=d.left,h.x2=Math.max(m-d.right,h.x1+1),h.y2=d.top,h.y1=Math.max(u-d.bottom,h.y2+1)),h}function Ye(i,e,n,t,s,r,a,l){const o={["".concat(n.units.pos,"1")]:i,["".concat(n.units.pos,"2")]:i,["".concat(n.counterUnits.pos,"1")]:t,["".concat(n.counterUnits.pos,"2")]:t+s},f=r.elem("line",o,a.join(" "));l.emit("draw",{type:"grid",axis:n,index:e,group:r,element:f,...o})}function Ge(i,e,n,t){const s=i.elem("rect",{x:e.x1,y:e.y2,width:e.width(),height:e.height()},n,!0);t.emit("draw",{type:"gridBackground",group:i,element:s})}function He(i,e,n,t,s,r,a,l,o,f){const c={[s.units.pos]:i+a[s.units.pos],[s.counterUnits.pos]:a[s.counterUnits.pos],[s.units.len]:e,[s.counterUnits.len]:Math.max(0,r-10)},m=Math.round(c[s.units.len]),u=Math.round(c[s.counterUnits.len]),d=document.createElement("span");d.className=o.join(" "),d.style[s.units.len]=m+"px",d.style[s.counterUnits.len]=u+"px",d.textContent=String(t);const h=l.foreignObject(d,{style:"overflow: visible;",...c});f.emit("draw",{type:"label",axis:s,index:n,group:l,element:h,text:t,...c})}function ie(i,e,n){let t;const s=[];function r(l){const o=t;t=P({},i),e&&e.forEach(f=>{window.matchMedia(f[0]).matches&&(t=P(t,f[1]))}),n&&l&&n.emit("optionsChanged",{previousOptions:o,currentOptions:t})}function a(){s.forEach(l=>l.removeEventListener("change",r))}if(window.matchMedia)e&&e.forEach(l=>{const o=window.matchMedia(l[0]);o.addEventListener("change",r),s.push(o)});else throw new Error("window.matchMedia not found! Make sure you're using a polyfill.");return r(),{removeMediaQueryListeners:a,getCurrentOptions(){return t}}}const K={m:["x","y"],l:["x","y"],c:["x1","y1","x2","y2","x","y"],a:["rx","ry","xAr","lAf","sf","x","y"]},Ve={accuracy:3};function V(i,e,n,t,s,r){const a={command:s?i.toLowerCase():i.toUpperCase(),...e,...r?{data:r}:{}};n.splice(t,0,a)}function $(i,e){i.forEach((n,t)=>{K[n.command.toLowerCase()].forEach((s,r)=>{e(n,s,t,r,i)})})}class b{static join(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=arguments.length>2?arguments[2]:void 0;const s=new b(n,t);for(let r=0;r<e.length;r++){const a=e[r];for(let l=0;l<a.pathElements.length;l++)s.pathElements.push(a.pathElements[l])}return s}position(e){return e!==void 0?(this.pos=Math.max(0,Math.min(this.pathElements.length,e)),this):this.pos}remove(e){return this.pathElements.splice(this.pos,e),this}move(e,n){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s=arguments.length>3?arguments[3]:void 0;return V("M",{x:+e,y:+n},this.pathElements,this.pos++,t,s),this}line(e,n){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s=arguments.length>3?arguments[3]:void 0;return V("L",{x:+e,y:+n},this.pathElements,this.pos++,t,s),this}curve(e,n,t,s,r,a){let l=arguments.length>6&&arguments[6]!==void 0?arguments[6]:!1,o=arguments.length>7?arguments[7]:void 0;return V("C",{x1:+e,y1:+n,x2:+t,y2:+s,x:+r,y:+a},this.pathElements,this.pos++,l,o),this}arc(e,n,t,s,r,a,l){let o=arguments.length>7&&arguments[7]!==void 0?arguments[7]:!1,f=arguments.length>8?arguments[8]:void 0;return V("A",{rx:e,ry:n,xAr:t,lAf:s,sf:r,x:a,y:l},this.pathElements,this.pos++,o,f),this}parse(e){const n=e.replace(/([A-Za-z])(-?[0-9])/g,"$1 $2").replace(/([0-9])([A-Za-z])/g,"$1 $2").split(/[\s,]+/).reduce((s,r)=>(r.match(/[A-Za-z]/)&&s.push([]),s[s.length-1].push(r),s),[]);n[n.length-1][0].toUpperCase()==="Z"&&n.pop();const t=n.map(s=>{const r=s.shift(),a=K[r.toLowerCase()];return{command:r,...a.reduce((l,o,f)=>(l[o]=+s[f],l),{})}});return this.pathElements.splice(this.pos,0,...t),this.pos+=t.length,this}stringify(){const e=Math.pow(10,this.options.accuracy);return this.pathElements.reduce((n,t)=>{const s=K[t.command.toLowerCase()].map(r=>{const a=t[r];return this.options.accuracy?Math.round(a*e)/e:a});return n+t.command+s.join(",")},"")+(this.close?"Z":"")}scale(e,n){return $(this.pathElements,(t,s)=>{t[s]*=s[0]==="x"?e:n}),this}translate(e,n){return $(this.pathElements,(t,s)=>{t[s]+=s[0]==="x"?e:n}),this}transform(e){return $(this.pathElements,(n,t,s,r,a)=>{const l=e(n,t,s,r,a);(l||l===0)&&(n[t]=l)}),this}clone(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;const n=new b(e||this.close);return n.pos=this.pos,n.pathElements=this.pathElements.slice().map(t=>({...t})),n.options={...this.options},n}splitByCommand(e){const n=[new b];return this.pathElements.forEach(t=>{t.command===e.toUpperCase()&&n[n.length-1].pathElements.length!==0&&n.push(new b),n[n.length-1].pathElements.push(t)}),n}constructor(e=!1,n){this.close=e,this.pathElements=[],this.pos=0,this.options={...Ve,...n}}}function I(i){const e={fillHoles:!1,...i};return function(t,s){const r=new b;let a=!0;for(let l=0;l<t.length;l+=2){const o=t[l],f=t[l+1],c=s[l/2];_(c.value)!==void 0?(a?r.move(o,f,!1,c):r.line(o,f,!1,c),a=!1):e.fillHoles||(a=!0)}return r}}function Re(i){const e={divisor:2,fillHoles:!1,...i},n=1/Math.max(1,e.divisor);return function(s,r){const a=new b;let l=0,o=0,f;for(let c=0;c<s.length;c+=2){const m=s[c],u=s[c+1],d=(m-l)*n,h=r[c/2];h.value!==void 0?(f===void 0?a.move(m,u,!1,h):a.curve(l+d,o,m-d,u,m,u,!1,h),l=m,o=u,f=h):e.fillHoles||(l=o=0,f=void 0)}return a}}function Te(i){const e={postpone:!0,fillHoles:!1,...i};return function(t,s){const r=new b;let a=0,l=0,o;for(let f=0;f<t.length;f+=2){const c=t[f],m=t[f+1],u=s[f/2];u.value!==void 0?(o===void 0?r.move(c,m,!1,u):(e.postpone?r.line(c,l,!1,o):r.line(a,m,!1,u),r.line(c,m,!1,u)),a=c,l=m,o=u):e.fillHoles||(a=l=0,o=void 0)}return r}}function Ue(i){const e={tension:1,fillHoles:!1,...i},n=Math.min(1,Math.max(0,e.tension)),t=1-n;return function s(r,a){const l=he(r,a,{fillHoles:e.fillHoles});if(l.length){if(l.length>1)return b.join(l.map(o=>s(o.pathCoordinates,o.valueData)));{if(r=l[0].pathCoordinates,a=l[0].valueData,r.length<=4)return I()(r,a);const o=new b().move(r[0],r[1],!1,a[0]),f=!1;for(let c=0,m=r.length;m-2*Number(!f)>c;c+=2){const u=[{x:+r[c-2],y:+r[c-1]},{x:+r[c],y:+r[c+1]},{x:+r[c+2],y:+r[c+3]},{x:+r[c+4],y:+r[c+5]}];m-4===c?u[3]=u[2]:c||(u[0]={x:+r[c],y:+r[c+1]}),o.curve(n*(-u[0].x+6*u[1].x+u[2].x)/6+t*u[2].x,n*(-u[0].y+6*u[1].y+u[2].y)/6+t*u[2].y,n*(u[1].x+6*u[2].x-u[3].x)/6+t*u[2].x,n*(u[1].y+6*u[2].y-u[3].y)/6+t*u[2].y,u[2].x,u[2].y,!1,a[(c+2)/2])}return o}}else return I()([],[])}}function ge(i){const e={fillHoles:!1,...i};return function n(t,s){const r=he(t,s,{fillHoles:e.fillHoles,increasingX:!0});if(r.length){if(r.length>1)return b.join(r.map(a=>n(a.pathCoordinates,a.valueData)));{if(t=r[0].pathCoordinates,s=r[0].valueData,t.length<=4)return I()(t,s);const a=[],l=[],o=t.length/2,f=[],c=[],m=[],u=[];for(let h=0;h<o;h++)a[h]=t[h*2],l[h]=t[h*2+1];for(let h=0;h<o-1;h++)m[h]=l[h+1]-l[h],u[h]=a[h+1]-a[h],c[h]=m[h]/u[h];f[0]=c[0],f[o-1]=c[o-2];for(let h=1;h<o-1;h++)c[h]===0||c[h-1]===0||c[h-1]>0!=c[h]>0?f[h]=0:(f[h]=3*(u[h-1]+u[h])/((2*u[h]+u[h-1])/c[h-1]+(u[h]+2*u[h-1])/c[h]),isFinite(f[h])||(f[h]=0));const d=new b().move(a[0],l[0],!1,s[0]);for(let h=0;h<o-1;h++)d.curve(a[h]+u[h]/3,l[h]+f[h]*u[h]/3,a[h+1]-u[h]/3,l[h+1]-f[h+1]*u[h]/3,a[h+1],l[h+1],!1,s[h+1]);return d}}else return I()([],[])}}var De=Object.freeze({__proto__:null,none:I,simple:Re,step:Te,cardinal:Ue,monotoneCubic:ge});class Fe{on(e,n){const{allListeners:t,listeners:s}=this;e==="*"?t.add(n):(s.has(e)||s.set(e,new Set),s.get(e).add(n))}off(e,n){const{allListeners:t,listeners:s}=this;if(e==="*")n?t.delete(n):t.clear();else if(s.has(e)){const r=s.get(e);n?r.delete(n):r.clear(),r.size||s.delete(e)}}emit(e,n){const{allListeners:t,listeners:s}=this;s.has(e)&&s.get(e).forEach(r=>r(n)),t.forEach(r=>r(e,n))}constructor(){this.listeners=new Map,this.allListeners=new Set}}const W=new WeakMap;class pe{update(e,n){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1;if(e&&(this.data=e||{},this.data.labels=this.data.labels||[],this.data.series=this.data.series||[],this.eventEmitter.emit("data",{type:"update",data:this.data})),n&&(this.options=P({},t?this.options:this.defaultOptions,n),!this.initializeTimeoutId)){var s;(s=this.optionsProvider)===null||s===void 0||s.removeMediaQueryListeners(),this.optionsProvider=ie(this.options,this.responsiveOptions,this.eventEmitter)}return!this.initializeTimeoutId&&this.optionsProvider&&this.createChart(this.optionsProvider.getCurrentOptions()),this}detach(){if(this.initializeTimeoutId)window.clearTimeout(this.initializeTimeoutId);else{var e;window.removeEventListener("resize",this.resizeListener),(e=this.optionsProvider)===null||e===void 0||e.removeMediaQueryListeners()}return W.delete(this.container),this}on(e,n){return this.eventEmitter.on(e,n),this}off(e,n){return this.eventEmitter.off(e,n),this}initialize(){window.addEventListener("resize",this.resizeListener),this.optionsProvider=ie(this.options,this.responsiveOptions,this.eventEmitter),this.eventEmitter.on("optionsChanged",()=>this.update()),this.options.plugins&&this.options.plugins.forEach(e=>{Array.isArray(e)?e[0](this,e[1]):e(this)}),this.eventEmitter.emit("data",{type:"initial",data:this.data}),this.createChart(this.optionsProvider.getCurrentOptions()),this.initializeTimeoutId=null}constructor(e,n,t,s,r){this.data=n,this.defaultOptions=t,this.options=s,this.responsiveOptions=r,this.eventEmitter=new Fe,this.resizeListener=()=>this.update(),this.initializeTimeoutId=setTimeout(()=>this.initialize(),0);const a=typeof e=="string"?document.querySelector(e):e;if(!a)throw new Error("Target element is not found");this.container=a;const l=W.get(a);l&&l.detach(),W.set(a,this)}}const L={x:{pos:"x",len:"width",dir:"horizontal",rectStart:"x1",rectEnd:"x2",rectOffset:"y2"},y:{pos:"y",len:"height",dir:"vertical",rectStart:"y2",rectEnd:"y1",rectOffset:"x1"}};class ve{createGridAndLabels(e,n,t,s){const r=this.units.pos==="x"?t.axisX:t.axisY,a=this.ticks.map((o,f)=>this.projectValue(o,f)),l=this.ticks.map(r.labelInterpolationFnc);a.forEach((o,f)=>{const c=l[f],m={x:0,y:0};let u;a[f+1]?u=a[f+1]-o:u=Math.max(this.axisLength-o,this.axisLength/this.ticks.length),!(c!==""&&oe(c))&&(this.units.pos==="x"?(o=this.chartRect.x1+o,m.x=t.axisX.labelOffset.x,t.axisX.position==="start"?m.y=this.chartRect.padding.top+t.axisX.labelOffset.y+5:m.y=this.chartRect.y1+t.axisX.labelOffset.y+5):(o=this.chartRect.y1-o,m.y=t.axisY.labelOffset.y-u,t.axisY.position==="start"?m.x=this.chartRect.padding.left+t.axisY.labelOffset.x:m.x=this.chartRect.x2+t.axisY.labelOffset.x+10),r.showGrid&&Ye(o,f,this,this.gridOffset,this.chartRect[this.counterUnits.len](),e,[t.classNames.grid,t.classNames[this.units.dir]],s),r.showLabel&&He(o,u,f,c,this,r.offset,m,n,[t.classNames.label,t.classNames[this.units.dir],r.position==="start"?t.classNames[r.position]:t.classNames.end],s))})}constructor(e,n,t){this.units=e,this.chartRect=n,this.ticks=t,this.counterUnits=e===L.x?L.y:L.x,this.axisLength=n[this.units.rectEnd]-n[this.units.rectStart],this.gridOffset=n[this.units.rectOffset]}}class Qe extends ve{projectValue(e){const n=Number(_(e,this.units.pos));return this.axisLength*(n-this.bounds.min)/this.bounds.range}constructor(e,n,t,s){const r=s.highLow||ze(n,s,e.pos),a=Ae(t[e.rectEnd]-t[e.rectStart],r,s.scaleMinSpace||20,s.onlyInteger),l={min:a.min,max:a.max};super(e,t,a.values),this.bounds=a,this.range=l}}class $e extends ve{projectValue(e,n){return this.stepLength*n}constructor(e,n,t,s){const r=s.ticks||[];super(e,t,r);const a=Math.max(1,r.length-(s.stretch?1:0));this.stepLength=this.axisLength/a,this.stretch=Boolean(s.stretch)}}function Y(i,e,n){var t;if(w(i,"name")&&i.name&&(!((t=e.series)===null||t===void 0)&&t[i.name])){const r=(e==null?void 0:e.series[i.name])[n];return r===void 0?e[n]:r}else return e[n]}const re={axisX:{offset:30,position:"end",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:q,type:void 0},axisY:{offset:40,position:"start",labelOffset:{x:0,y:0},showLabel:!0,showGrid:!0,labelInterpolationFnc:q,type:void 0,scaleMinSpace:20,onlyInteger:!1},width:void 0,height:void 0,showLine:!0,showPoint:!0,showArea:!1,areaBase:0,lineSmooth:!0,showGridBackground:!1,low:void 0,high:void 0,chartPadding:{top:15,right:15,bottom:5,left:10},fullWidth:!1,reverseData:!1,classNames:{chart:"ct-chart-line",label:"ct-label",labelGroup:"ct-labels",series:"ct-series",line:"ct-line",point:"ct-point",area:"ct-area",grid:"ct-grid",gridGroup:"ct-grids",gridBackground:"ct-grid-background",vertical:"ct-vertical",horizontal:"ct-horizontal",start:"ct-start",end:"ct-end"}};class We extends pe{createChart(e){const{data:n}=this,t=ce(n,e.reverseData,!0),s=me(this.container,e.width,e.height,e.classNames.chart);this.svg=s;const r=s.elem("g").addClass(e.classNames.gridGroup),a=s.elem("g"),l=s.elem("g").addClass(e.classNames.labelGroup),o=de(s,e);let f,c;e.axisX.type===void 0?f=new $e(L.x,t.series,o,{...e.axisX,ticks:t.labels,stretch:e.fullWidth}):f=new e.axisX.type(L.x,t.series,o,e.axisX),e.axisY.type===void 0?c=new Qe(L.y,t.series,o,{...e.axisY,high:R(e.high)?e.high:e.axisY.high,low:R(e.low)?e.low:e.axisY.low}):c=new e.axisY.type(L.y,t.series,o,e.axisY),f.createGridAndLabels(r,l,e,this.eventEmitter),c.createGridAndLabels(r,l,e,this.eventEmitter),e.showGridBackground&&Ge(r,o,e.classNames.gridBackground,this.eventEmitter),Oe(n.series,(m,u)=>{const d=a.elem("g"),h=w(m,"name")&&m.name,y=w(m,"className")&&m.className,p=w(m,"meta")?m.meta:void 0;h&&d.attr({"ct:series-name":h}),p&&d.attr({"ct:meta":J(p)}),d.addClass([e.classNames.series,y||"".concat(e.classNames.series,"-").concat(le(u))].join(" "));const C=[],S=[];t.series[u].forEach((v,g)=>{const x={x:o.x1+f.projectValue(v,g,t.series[u]),y:o.y1-c.projectValue(v,g,t.series[u])};C.push(x.x,x.y),S.push({value:v,valueIndex:g,meta:Le(m,g)})});const A={lineSmooth:Y(m,e,"lineSmooth"),showPoint:Y(m,e,"showPoint"),showLine:Y(m,e,"showLine"),showArea:Y(m,e,"showArea"),areaBase:Y(m,e,"areaBase")};let B;typeof A.lineSmooth=="function"?B=A.lineSmooth:B=A.lineSmooth?ge():I();const M=B(C,S);if(A.showPoint&&M.pathElements.forEach(v=>{const{data:g}=v,x=d.elem("line",{x1:v.x,y1:v.y,x2:v.x+.01,y2:v.y},e.classNames.point);if(g){let E,N;w(g.value,"x")&&(E=g.value.x),w(g.value,"y")&&(N=g.value.y),x.attr({"ct:value":[E,N].filter(R).join(","),"ct:meta":J(g.meta)})}this.eventEmitter.emit("draw",{type:"point",value:g==null?void 0:g.value,index:(g==null?void 0:g.valueIndex)||0,meta:g==null?void 0:g.meta,series:m,seriesIndex:u,axisX:f,axisY:c,group:d,element:x,x:v.x,y:v.y,chartRect:o})}),A.showLine){const v=d.elem("path",{d:M.stringify()},e.classNames.line,!0);this.eventEmitter.emit("draw",{type:"line",values:t.series[u],path:M.clone(),chartRect:o,index:u,series:m,seriesIndex:u,meta:p,axisX:f,axisY:c,group:d,element:v})}if(A.showArea&&c.range){const v=Math.max(Math.min(A.areaBase,c.range.max),c.range.min),g=o.y1-c.projectValue(v);M.splitByCommand("M").filter(x=>x.pathElements.length>1).map(x=>{const E=x.pathElements[0],N=x.pathElements[x.pathElements.length-1];return x.clone(!0).position(0).remove(1).move(E.x,g).line(E.x,E.y).position(x.pathElements.length+1).line(N.x,g)}).forEach(x=>{const E=d.elem("path",{d:x.stringify()},e.classNames.area,!0);this.eventEmitter.emit("draw",{type:"area",values:t.series[u],path:x.clone(),series:m,seriesIndex:u,axisX:f,axisY:c,chartRect:o,index:u,group:d,element:E,meta:p})})}},e.reverseData),this.eventEmitter.emit("created",{chartRect:o,axisX:f,axisY:c,svg:s,options:e})}constructor(e,n,t,s){super(e,n,re,P({},re,t),s),this.data=n}}const ae={width:void 0,height:void 0,chartPadding:5,classNames:{chartPie:"ct-chart-pie",chartDonut:"ct-chart-donut",series:"ct-series",slicePie:"ct-slice-pie",sliceDonut:"ct-slice-donut",label:"ct-label"},startAngle:0,total:void 0,donut:!1,donutWidth:60,showLabel:!0,labelOffset:0,labelPosition:"inside",labelInterpolationFnc:q,labelDirection:"neutral",ignoreEmptyValues:!1};function qe(i,e,n){const t=e.x>i.x;return t&&n==="explode"||!t&&n==="implode"?"start":t&&n==="implode"||!t&&n==="explode"?"end":"middle"}class Ze extends pe{createChart(e){const{data:n}=this,t=ce(n),s=[];let r,a,l=e.startAngle;const o=me(this.container,e.width,e.height,e.donut?e.classNames.chartDonut:e.classNames.chartPie);this.svg=o;const f=de(o,e);let c=Math.min(f.width()/2,f.height()/2);const m=e.total||t.series.reduce(Me,0),u=T(e.donutWidth);u.unit==="%"&&(u.value*=c/100),c-=e.donut?u.value/2:0,e.labelPosition==="outside"||e.donut?a=c:e.labelPosition==="center"?a=0:a=c/2,e.labelOffset&&(a+=e.labelOffset);const d={x:f.x1+f.width()/2,y:f.y2+f.height()/2},h=n.series.filter(y=>w(y,"value")?y.value!==0:y!==0).length===1;n.series.forEach((y,p)=>s[p]=o.elem("g")),e.showLabel&&(r=o.elem("g")),n.series.forEach((y,p)=>{var C,S;if(t.series[p]===0&&e.ignoreEmptyValues)return;const A=w(y,"name")&&y.name,B=w(y,"className")&&y.className,M=w(y,"meta")?y.meta:void 0;A&&s[p].attr({"ct:series-name":A}),s[p].addClass([(C=e.classNames)===null||C===void 0?void 0:C.series,B||"".concat((S=e.classNames)===null||S===void 0?void 0:S.series,"-").concat(le(p))].join(" "));let v=m>0?l+t.series[p]/m*360:0;const g=Math.max(0,l-(p===0||h?0:.2));v-g>=359.99&&(v=g+359.99);const x=Q(d.x,d.y,c,g),E=Q(d.x,d.y,c,v),N=new b(!e.donut).move(E.x,E.y).arc(c,c,0,Number(v-l>180),0,x.x,x.y);e.donut||N.line(d.x,d.y);const U=s[p].elem("path",{d:N.stringify()},e.donut?e.classNames.sliceDonut:e.classNames.slicePie);if(U.attr({"ct:value":t.series[p],"ct:meta":J(M)}),e.donut&&U.attr({style:"stroke-width: "+u.value+"px"}),this.eventEmitter.emit("draw",{type:"slice",value:t.series[p],totalDataSum:m,index:p,meta:M,series:y,group:s[p],element:U,path:N.clone(),center:d,radius:c,startAngle:l,endAngle:v,chartRect:f}),e.showLabel){let z;n.series.length===1?z={x:d.x,y:d.y}:z=Q(d.x,d.y,a,l+(v-l)/2);let D;t.labels&&!oe(t.labels[p])?D=t.labels[p]:D=t.series[p];const H=e.labelInterpolationFnc(D,p);if(H||H===0){const xe=r.elem("text",{dx:z.x,dy:z.y,"text-anchor":qe(d,z,e.labelDirection)},e.classNames.label).text(String(H));this.eventEmitter.emit("draw",{type:"label",index:p,group:r,element:xe,text:""+H,chartRect:f,series:y,meta:M,...z})}}l=v}),this.eventEmitter.emit("created",{chartRect:f,svg:o,options:e})}constructor(e,n,t,s){super(e,n,ae,P({},ae,t),s),this.data=n}}window.LineChart=We;window.PieChart=Ze;window.Interpolation=De;
