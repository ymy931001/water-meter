webpackJsonp([25],{Apzg:function(t,e){},T5SG:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("aozt"),s=a.n(n),r={components:{},props:{},data:function(){return{dataSource:[],selectData:[],isSet:this.$route.query.set,selectedRow:void 0}},watch:{selectedRow:function(t){var e=this,a=t.map(function(t){return t.id}),n=[];this.dataSource.forEach(function(t,e){a.indexOf(t.id)>-1&&n.push(e)});n.forEach(function(t){e.$refs.multipleTable.toggleRowSelection(e.dataSource[t])})}},computed:{},methods:{getWaterMerchantIds:function(t){return this.$http.get("/weiXin/api/v1/WaterMerchantIds/getWaterMerchantIds",{userId:t}).then(function(t){if(t)return t.data.data})},handleSelectionChange:function(t){this.selectData=t.map(function(t){return t.id})},addConfirm:function(){var t=this;this.selectData.length>0&&this.$http.post("/weiXin/api/v1/WaterMerchantIds/setWaterMerchantIds",{waterMerchantIds:this.selectData,userId:this.$route.query.userId},{"Content-Type":"application/json; charset=UTF-8"},!0).then(function(e){e&&t.$message({type:"success",message:"分配成功",showClose:!0})})}},created:function(){var t=this;s.a.all([this.getWaterMerchantIds(),!this.isSet&&this.getWaterMerchantIds(this.$route.query.userId)]).then(s.a.spread(function(e,a){t.dataSource=e,t.$nextTick(function(){t.selectedRow=a})}))},mounted:function(){}},i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"waterMerchantList"},[a("el-table",{ref:"multipleTable",staticClass:"searchResult",staticStyle:{width:"100%"},attrs:{size:"mini",border:"",stripe:"","header-row-class-name":"equipHead","row-class-name":"equipTabel",data:t.dataSource},on:{"selection-change":t.handleSelectionChange}},[t.isSet?t._e():a("el-table-column",{attrs:{type:"selection",fixed:"left",width:"45"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"税务商名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"linkman",label:"联系人姓名"}}),t._v(" "),t.isSet?a("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[a("el-button",{attrs:{type:"text"},on:{click:function(e){t.$router.push({path:"electricSet",query:{waterMerchantId:n.id}})}}},[t._v("参数设定")])]}}])}):t._e()],1),t._v(" "),t.isSet?t._e():a("el-button",{staticClass:"confirm",attrs:{type:"primary"},on:{click:t.addConfirm}},[t._v(" 确认")])],1)},staticRenderFns:[]};var c=a("46Yf")(r,i,!1,function(t){a("Apzg")},null,null);e.default=c.exports}});
//# sourceMappingURL=25.4596adb27a5a9e614c4b.js.map