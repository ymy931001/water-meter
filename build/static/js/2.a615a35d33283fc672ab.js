webpackJsonp([2],{CfUY:function(e,t,n){n("TorI")("Set")},GGtt:function(e,t,n){n("d5xd"),n("at0p"),n("MJJS"),n("i9Cg"),n("PUcJ"),n("Yp1e"),n("CfUY"),e.exports=n("ZuHZ").Set},PUcJ:function(e,t,n){var s=n("Wtcz");s(s.P+s.R,"Set",{toJSON:n("9TqU")("Set")})},Yp1e:function(e,t,n){n("U5Tb")("Set")},i9Cg:function(e,t,n){"use strict";var s=n("TY5X"),o=n("rJqi");e.exports=n("GmRL")("Set",function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},{add:function(e){return s.def(o(this,"Set"),e=0===e?0:e,e)}},s)},mjeQ:function(e,t){},whLP:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("3cXf"),o=n.n(s),a=n("zsLt"),i=n.n(a),r=n("IHPB"),l=n.n(r),c=n("YUvS"),u={name:"Landing",data:function(){return{uid:"",psd:"",value1:!0,value2:!1,user:[],newCount:!0}},methods:{initScroll:function(e){new c.default(e,{scrollY:!0,click:!0})},getUser:function(){var e=JSON.parse(localStorage.getItem("userIfo"));console.log(e),e&&e.length>0&&(this.user=e,this.newCount=!1)},landing:function(){var e=this;if(this.$route.query.openId||localStorage.getItem("openId")){var t=this.$route.query.openId||localStorage.getItem("openId");this.$https.get("/login/weiXin/api/v1/user/activate",{params:{username:this.uid,password:this.psd,openId:t}}).then(function(n){if(0==n.data.code){localStorage.setItem("access_token",n.data.data),localStorage.setItem("openId",t);var s=JSON.parse(localStorage.getItem("userIfo"));if(s&&s.length>0){s.push({username:e.uid,password:e.psd});var a=[].concat(l()(new i.a(s.map(function(e){return o()(e)})))).map(function(e){return JSON.parse(e)});console.log(s),localStorage.setItem("userIfo",o()(a))}else{console.log(22);var r=o()([{username:e.uid,password:e.psd}]);localStorage.setItem("userIfo",r)}e.$message({type:"success",message:"激活成功"}),e.$router.replace("/nav")}else e.$message({type:"error",message:n.data.message})})}},reland:function(e){var t=this;if(this.$route.query.openId||localStorage.getItem("openId")){var n=this.$route.query.openId||localStorage.getItem("openId");this.$https.get("/login/weiXin/api/v1/user/activate",{params:{username:e.username,password:e.password,openId:n}}).then(function(e){console.log(e),0==e.data.code?(localStorage.setItem("access_token",e.data.data),localStorage.setItem("openId",n),t.$message({type:"success",message:"激活成功"}),t.$router.replace("/nav")):t.$message({type:"error",message:e.data.message})})}},removeCount:function(e,t){t.splice(e,1),0==t.length&&(this.newCount=!0),localStorage.setItem("userIfo",o()(t))}},mounted:function(){this.getUser(),this.initScroll(this.$refs.Scroll)}},d={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"contain"},[n("div",{staticClass:"Landing"},[n("h2",{staticClass:"title"},[e._v("水表管理平台")]),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.newCount,expression:"newCount"}],staticClass:"land"},[n("div",{staticClass:"demo-input-suffix land-input"},[n("el-input",{attrs:{placeholder:"请输入账户","prefix-icon":"el-icon-search"},model:{value:e.uid,callback:function(t){e.uid=t},expression:"uid"}})],1),e._v(" "),n("div",{staticClass:"demo-input-suffix land-input"},[n("el-input",{attrs:{placeholder:"请输入密码",type:"password"},model:{value:e.psd,callback:function(t){e.psd=t},expression:"psd"}},[n("i",{staticClass:"el-input__icon el-icon-search",attrs:{slot:"prefix"},slot:"prefix"})])],1),e._v(" "),e.user.length>0?n("el-button",{on:{click:function(t){e.newCount=!1}}},[e._v("已有账户登录")]):e._e(),e._v(" "),n("el-button",{staticClass:"land-button",attrs:{type:"primary"},on:{click:e.landing}},[e._v("激活")])],1),e._v(" "),n("ul",{directives:[{name:"show",rawName:"v-show",value:!e.newCount,expression:"!newCount"}],staticClass:"countList"},[n("div",{staticClass:"count-title"},[n("span",[e._v("已有账户")]),e._v(" "),n("el-button",{on:{click:function(t){e.newCount=!0}}},[e._v("新账户登录")])],1),e._v(" "),n("div",{ref:"Scroll",staticClass:"count-item"},[n("div",{ref:"wrapper"},e._l(e.user,function(t,s){return n("li",{key:t.username},[n("p",{on:{click:function(n){e.reland(t)}}},[e._v(e._s(t.username))]),e._v(" "),n("el-button",{attrs:{icon:"el-icon-close"},on:{click:function(t){e.removeCount(s,e.user)}}})],1)}))])])])])},staticRenderFns:[]};var p=n("46Yf")(u,d,!1,function(e){n("mjeQ")},null,null);t.default=p.exports},zsLt:function(e,t,n){e.exports={default:n("GGtt"),__esModule:!0}}});
//# sourceMappingURL=2.a615a35d33283fc672ab.js.map