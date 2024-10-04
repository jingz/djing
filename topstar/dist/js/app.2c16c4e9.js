(function(t){function e(e){for(var n,o,l=e[0],i=e[1],c=e[2],p=0,d=[];p<l.length;p++)o=l[p],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&d.push(a[o][0]),a[o]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n]);u&&u(e);while(d.length)d.shift()();return s.push.apply(s,c||[]),r()}function r(){for(var t,e=0;e<s.length;e++){for(var r=s[e],n=!0,l=1;l<r.length;l++){var i=r[l];0!==a[i]&&(n=!1)}n&&(s.splice(e--,1),t=o(o.s=r[0]))}return t}var n={},a={app:0},s=[];function o(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=n,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],i=l.push.bind(l);l.push=e,l=l.slice();for(var c=0;c<l.length;c++)e(l[c]);var u=i;s.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},"4c90":function(t,e,r){},"56d7":function(t,e,r){"use strict";r.r(e);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container lg:w-1/2 mx-auto px-6 py-4",attrs:{id:"app"}},[r("h1",{staticClass:"font-extrabold text-2xl text-center"},[t._v(t._s(t.title))]),r("div",{staticClass:"font-normal text-xl text-center text-gray-700"},[t._v(t._s(t.subtitle))]),r("h2",{staticClass:"text-center font-mono text-lg mt-4"},[r("span",{staticClass:"bg-green-200 px-2 rounded-full text-green-700"},[t._v("From Today ("+t._s(t.startDateString)+")")]),r("span",{staticClass:"text-underline text-gray-700 px-2 "},[t._v("Until")]),r("span",{staticClass:"bg-red-200 px-2 rounded-full text-red-700"},[t._v(t._s(t.endDateString))])]),r("h2",{staticClass:"text-center bg-blue-100 text-blue-700 rounded-full mb-6 mt-2 w-full"},[t._v("Showing Repository "),r("span",{staticClass:"font-semibold text-xl"},[t._v(t._s(t.repos.length))]),t._v(" of "),r("span",{staticClass:"font-semibold text-xl"},[t._v(t._s(t.total))])]),t._l(t.repos,(function(e,n){return r("div",{key:e.name,staticClass:"border-2 border-gray-300 rounded-lg shadow-md p-4 mb-6 bg-gray-100 hover:border-gray-700"},[r("div",{staticClass:"absolute -mt-8 -mx-8 text-white text-center w-8 h-8 py-1 rounded-full bg-blue-500"},[t._v(" "+t._s(n+1)+" ")]),r("div",{staticClass:"flex flex-col sm:flex-row justify-between mb-1"},[r("div",{staticClass:"font-mono font-extrabold text-lg"},[r("a",{attrs:{href:e.html_url,target:"_blank"}},[t._v(t._s(e.name))])]),r("div",{staticClass:"flex sm:justify-between"},[r("div",[r("span",{staticClass:"text-yellow-500",attrs:{title:"Stars"}},[t._v("★")]),r("span",{staticClass:"font-mono font-extrabold text-yellow-700 px-1"},[t._v(t._s(e.stargazers_count))])]),r("div",[r("span",{staticClass:"font-bold text-blue-500",attrs:{title:"Forks"}},[t._v("᚜")]),r("span",{staticClass:"font-mono font-extrabold text-blue-700 ml-1"},[t._v(t._s(e.forks_count))])])])]),r("p",{staticClass:"text-lg text-gray-600 tracking-wider mb-2 leading-tight"},[t._v(" "+t._s(e.description||"–")+" ")]),r("div",{staticClass:"flex justify-between"},[r("div",{staticClass:"bg-gray-300 rounded-lg px-2 text-gray-600"},[t._v(" #"+t._s(e.language)+" ")]),r("p",{staticClass:"bg-purple-200 rounded-lg px-2 text-purple-500"},[r("span",{attrs:{title:"created"}},[t._v("🕐")]),t._v(" "+t._s(t.convertDateObjectToString(new Date(e.created_at)))+" ")])])])})),r("div",{directives:[{name:"show",rawName:"v-show",value:!t.incomplete_result,expression:"!incomplete_result"}],staticClass:"text-center bg-green-200 rounded-full font-bold text-green-700"},[t._v("LOADING ...")])],2)},s=[],o=(r("99af"),r("a434"),r("0d03"),r("284c")),l=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"hello"},[r("h1",[t._v(t._s(t.msg))]),t._m(0),r("h3",[t._v("Installed CLI Plugins")]),t._m(1),r("h3",[t._v("Essential Links")]),t._m(2),r("h3",[t._v("Ecosystem")]),t._m(3)])},i=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("p",[t._v(" For a guide and recipes on how to configure / customize this project,"),r("br"),t._v(" check out the "),r("a",{attrs:{href:"https://cli.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("vue-cli documentation")]),t._v(". ")])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ul",[r("li",[r("a",{attrs:{href:"https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel",target:"_blank",rel:"noopener"}},[t._v("babel")])])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ul",[r("li",[r("a",{attrs:{href:"https://vuejs.org",target:"_blank",rel:"noopener"}},[t._v("Core Docs")])]),r("li",[r("a",{attrs:{href:"https://forum.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("Forum")])]),r("li",[r("a",{attrs:{href:"https://chat.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("Community Chat")])]),r("li",[r("a",{attrs:{href:"https://twitter.com/vuejs",target:"_blank",rel:"noopener"}},[t._v("Twitter")])]),r("li",[r("a",{attrs:{href:"https://news.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("News")])])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ul",[r("li",[r("a",{attrs:{href:"https://router.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("vue-router")])]),r("li",[r("a",{attrs:{href:"https://vuex.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("vuex")])]),r("li",[r("a",{attrs:{href:"https://github.com/vuejs/vue-devtools#vue-devtools",target:"_blank",rel:"noopener"}},[t._v("vue-devtools")])]),r("li",[r("a",{attrs:{href:"https://vue-loader.vuejs.org",target:"_blank",rel:"noopener"}},[t._v("vue-loader")])]),r("li",[r("a",{attrs:{href:"https://github.com/vuejs/awesome-vue",target:"_blank",rel:"noopener"}},[t._v("awesome-vue")])])])}],c={name:"HelloWorld",props:{msg:String}},u=c,p=(r("ccd1"),r("2877")),d=Object(p["a"])(u,l,i,!1,null,"379548a4",null),f=(d.exports,2592e6),h=function(t){var e=t.getMonth()+1,r=t.getDate();return e<10&&(e="0"+e),r<10&&(r="0"+r),"".concat(t.getFullYear(),"-").concat(e,"-").concat(r)},v={name:"app",data:function(){return{baseAPI:"https://api.github.com/search/repositories",title:"Github Top Star!",subtitle:"The popular repositories on Github",startDate:new Date,endDate:null,startDateString:null,endDateString:null,repos:[],total:0,incomplete_result:!1,fetching:null,page:1,per_page:10}},computed:{githubSearchURI:function(){return"".concat(this.baseAPI,"?q=created:>=").concat(this.endDateString,"&page=").concat(this.page,"&per_page=").concat(this.per_page,"&sort:star")}},components:{},methods:{convertDateObjectToString:h,handleScroll:function(t){var e=this,r=document.documentElement.offsetHeight,n=document.documentElement.scrollTop+window.innerHeight,a=r===n;return!a||this.incomplete_result||this.fetching||(this.fetching=setTimeout((function(){e.fetchRepositoryItems()}),200)),!1},fetchRepositoryItems:function(){var t=this,e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var e,r=JSON.parse(this.responseText);(e=t.repos).splice.apply(e,[t.repos.length,0].concat(Object(o["a"])(r.items))),t.total=r.total_count,t.incomplete_result=r.incomplete_result,t.page+=1,t.fetching=null}},e.open("GET",this.githubSearchURI,!0),e.setRequestHeader("Content-Type","application/json"),e.send()}},created:function(){this.startDateString=h(this.startDate),this.endDateString=h(new Date(this.startDate.getTime()-f)),this.fetchRepositoryItems(),window.addEventListener("scroll",this.handleScroll)},destroyed:function(){window.removeEventListener("scroll",this.handleScroll)}},g=v,_=(r("adeb"),Object(p["a"])(g,a,s,!1,null,null,null)),b=_.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(b)}}).$mount("#app")},a1af:function(t,e,r){},adeb:function(t,e,r){"use strict";var n=r("a1af"),a=r.n(n);a.a},ccd1:function(t,e,r){"use strict";var n=r("4c90"),a=r.n(n);a.a}});
//# sourceMappingURL=app.2c16c4e9.js.map