webpackJsonp([8],{QfiC:function(e,t){},RMQV:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("Gu7T"),l=i.n(a),r=i("GQaK"),n=i("BlC7"),s=(i("IcnI"),{computed:{qrId:function(){return this.$store.state.qrId}},watch:{qrId:function(e){this.equipID=e}},components:{QR:n.a},data:function(){return{filters:[{text:"水表",value:"水表"},{text:"无线单表",value:"无线单表"},{text:"采集器",value:"采集器"}],options:[{value:"3",label:"水表"},{value:"1",label:"无线单表"},{value:"2",label:"采集器"}],equipType:"",load:!1,histryScroll:null,pickerOptions:{shortcuts:[{text:"最近一周",onClick:function(e){var t=new Date,i=new Date;i.setTime(i.getTime()-6048e5),e.$emit("pick",[i,t])}},{text:"最近一个月",onClick:function(e){var t=new Date,i=new Date;i.setTime(i.getTime()-2592e6),e.$emit("pick",[i,t])}},{text:"最近三个月",onClick:function(e){var t=new Date,i=new Date;i.setTime(i.getTime()-7776e6),e.$emit("pick",[i,t])}}]},timechoice:"",equipID:this.$store.state.qrId,tableData:[]}},methods:{getblur:function(){var e=this;this.$nextTick(function(){e.$refs.select.$el.childNodes[1].blur(),e.$refs.select.$el.childNodes[3].blur()})},filterType:function(e,t,i){return t.type===e},initScroll:function(e,t){var i=this;if(e)e.refresh();else{var a=1;(e=new r.default(t,{click:!0,pullUpLoad:{threshold:-50,moreTxt:"加载更多",noMoreTxt:"没有更多数据了"}})).on("pullingUp",function(){a++;var t=i.equipType||"1,2,3";i.searchData(t,i.equipID,i.timechoice,a).then(function(){e.refresh()})})}},searchbyneeds:function(){var e=this.timechoice,t=this.equipID,i=[this.equipType];this.searchData(i,t,e)},reset:function(){this.searchData("1,2,3"),this.timechoice=null,this.equipID=null,this.equipType=null},searchData:function(e,t,i){var a=this,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;return this.load=!0,this.$http.get("/weiXin/api/v1/deviceMend/getDeviceExceptions",{deviceTypes:""+e,pageNum:r,pageSize:15,deviceNum:t||null,mendStartTime:i?i[0]:null,mendEndTime:i?i[1]:null}).then(function(e){if(a.load=!1,0==e.data.code){var t,i=e.data.data.map(function(e){return{type:(2==e.deviceType?"采集器":3==e.deviceType&&"水表")||1==e.deviceType&&"无线单表",date:e.deviceNumber,message:e.remark,time:e.mendTime}});if(1==r)a.tableData=i;else(t=a.tableData).push.apply(t,l()(i))}})}},mounted:function(){var e=this;this.searchData("1,2,3"),this.$nextTick(function(){e.initScroll(e.histryScroll,e.$refs.histryWrapper)})}}),c={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"repairRecord"}},[e._m(0),e._v(" "),i("Main",[i("div",{staticClass:"block"},[i("el-select",{staticClass:"typeSlect",attrs:{placeholder:"设备类型"},model:{value:e.equipType,callback:function(t){e.equipType=t},expression:"equipType"}},e._l(e.options,function(e){return i("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),e._v(" "),i("el-date-picker",{ref:"select",attrs:{format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",type:"daterange","popper-class":"timeSelect2",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间","picker-options":e.pickerOptions},nativeOn:{touchstart:function(t){e.getblur()}},model:{value:e.timechoice,callback:function(t){e.timechoice=t},expression:"timechoice"}}),e._v(" "),i("div",{staticClass:"qr"},[i("el-input",{staticClass:"idSearch",attrs:{placeholder:"输入设备编号",clearable:""},model:{value:e.equipID,callback:function(t){e.equipID=t},expression:"equipID"}}),e._v(" "),i("QR")],1),e._v(" "),i("el-row",[i("el-button",{staticClass:"searchConfirm",attrs:{type:"primary"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),i("el-button",{staticClass:"searchConfirm",attrs:{type:"primary"},on:{click:e.searchbyneeds}},[e._v("查询")])],1),e._v(" "),i("div",{ref:"histryWrapper",staticClass:"cloWra"},[i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.load,expression:"load"}],staticClass:"searchResult",staticStyle:{width:"100%"},attrs:{size:"mini",border:"",stripe:"","header-row-class-name":"equipHead",data:e.tableData}},[i("el-table-column",{attrs:{fixed:"",filters:e.filters,"filter-method":e.filterType,prop:"type",label:"设备类型",width:"110"}}),e._v(" "),i("el-table-column",{attrs:{prop:"date",label:"设备编号",width:"100"}}),e._v(" "),i("el-table-column",{attrs:{prop:"message",label:"维修信息"}}),e._v(" "),i("el-table-column",{attrs:{prop:"time",label:"维修时间"}})],1)],1)],1)])],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("header",[t("span",[this._v("设备维修")])])}]};var o=i("VU/8")(s,c,!1,function(e){i("eiJo"),i("QfiC")},"data-v-54a9512a",null);t.default=o.exports},eiJo:function(e,t){}});
//# sourceMappingURL=8.f0bde4ed43181208537e.js.map