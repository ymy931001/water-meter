webpackJsonp([28],{KZxL:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={components:{},props:{},data:function(){return{Form:{username:"",psw:"",email:"",phone:"",name:""},ruleForm:{username:[{required:!0,message:"请输入用户名"}],psw:[{required:!0,message:"请输入密码"}]}}},watch:{},computed:{},methods:{register:function(){var e=this;this.$refs.ruleForm.validate(function(r){if(!r)return console.log("error submit!!"),!1;e.$http.post("/weiXin/api/v1/user/add",{email:e.Form.email,password:e.Form.psw,phone:e.Form.phone,username:e.Form.username,name:e.Form.name},{"Content-Type":"application/json; charset=UTF-8"},!0).then(function(r){r&&0==r.data.code&&(e.$message({type:"success",message:"注册成功"}),e.$router.push("/addCount"))})})}},created:function(){},mounted:function(){}},a={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{attrs:{id:"accountDetail"}},[t("el-form",{ref:"ruleForm",staticClass:"textform",attrs:{model:e.Form,rules:e.ruleForm,"label-width":"80px"}},[t("el-form-item",{attrs:{label:"账户",prop:"username"}},[t("el-input",{attrs:{placeholder:"输入用户名"},model:{value:e.Form.username,callback:function(r){e.$set(e.Form,"username",r)},expression:"Form.username"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"密码",prop:"psw"}},[t("el-input",{attrs:{placeholder:"输入密码"},model:{value:e.Form.psw,callback:function(r){e.$set(e.Form,"psw",r)},expression:"Form.psw"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"姓名"}},[t("el-input",{attrs:{placeholder:"输入真实姓名"},model:{value:e.Form.name,callback:function(r){e.$set(e.Form,"name",r)},expression:"Form.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"电子邮箱"}},[t("el-input",{attrs:{placeholder:"请输入常用邮箱"},model:{value:e.Form.email,callback:function(r){e.$set(e.Form,"email",r)},expression:"Form.email"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"手机号"}},[t("el-input",{attrs:{placeholder:"输入用户手机号"},model:{value:e.Form.phone,callback:function(r){e.$set(e.Form,"phone",r)},expression:"Form.phone"}})],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:e.register}},[e._v("注册")])],1)],1)],1)},staticRenderFns:[]};var n=t("VU/8")(o,a,!1,function(e){t("jWxb")},null,null);r.default=n.exports},jWxb:function(e,r){}});
//# sourceMappingURL=28.a758df49deff2591e2d7.js.map