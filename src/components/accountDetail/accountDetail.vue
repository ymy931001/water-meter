<template>
  <div id="accountDetail">
	<el-form :model="Form" class="textform" :rules="ruleForm" ref="ruleForm" label-width="80px" >
		<el-form-item label="账户" prop="username">
			<el-input v-model="Form.username" placeholder="输入用户名"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="psw">
			<el-input v-model="Form.psw" placeholder="输入密码"></el-input>
		</el-form-item>
		<el-form-item label="姓名" >
			<el-input v-model="Form.name" placeholder="输入真实姓名"></el-input>
		</el-form-item>
		
		<el-form-item label="电子邮箱" >
			<el-input v-model="Form.email" placeholder="请输入常用邮箱" ></el-input>
		</el-form-item>
		<el-form-item label="手机号" >
			<el-input v-model="Form.phone" placeholder="输入用户手机号" ></el-input>
		</el-form-item>
		<el-form-item>
		<el-button type="primary" @click="register">注册</el-button>
		</el-form-item>
	</el-form>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
			Form:{
				username:'',
				psw:'',
				email:'',
				phone:'',
				name:''
			},
			ruleForm:{
				username:[{required:true,message:'请输入用户名'}],
				psw:[{required:true,message:'请输入密码'}],
			}
    }
  },
  watch:{},
  computed:{},
  methods:{
	  register(){
			this.$refs.ruleForm.validate((valid) => {
          if (valid) {
						this.$http.post('/weiXin/api/v1/user/add',{
							"email": this.Form.email,
							"password": this.Form.psw,
							"phone": this.Form.phone,
							"username": this.Form.username,
							"name": this.Form.name
						},{
							'Content-Type': 'application/json; charset=UTF-8'
						},true)
						.then(res=>{
							if(res&&res.data.code==0){
								this.$message({
									type: 'success',
									message: '注册成功'
								});
								this.$router.push('/addCount')

							}
						})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
		
		  
	  }
  },
  created(){},
  mounted(){}
}
</script>
<style  lang="less">
#accountDetail{
	margin-bottom: 70px;
	.textform{
	padding: 0 20px 0 20px;
	}
	  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #606266;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
	
}

</style>