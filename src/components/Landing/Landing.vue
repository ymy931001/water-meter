<template>
	<div class="contain">
		<div class="Landing">
			<h2 class="title">水表管理平台</h2>
			<div class="land" v-show="newCount">
				<div class="demo-input-suffix land-input">
					<el-input
						placeholder="请输入账户"
						prefix-icon="el-icon-search"
						v-model="uid">
					</el-input>
				</div>
				<div class="demo-input-suffix land-input">
					<el-input
						placeholder="请输入密码"
						v-model="psd" type="password">
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
				</div>
				<el-button @click="newCount=false" v-if="user.length>0">已有账户登录</el-button>
				<el-button type="primary" class="land-button" @click="landing">激活</el-button>
			</div>
			<ul class="countList" v-show="!newCount">
				<div class="count-title">
					<span >已有账户</span> <el-button @click="newCount=true" >新账户登录</el-button>
				</div>
				<div class="count-item" ref="Scroll">
					<div ref="wrapper">
						<li v-for="(item,ind) in user" :key="item.username" >
							<p @click="reland(item)">{{item.username}}</p> <el-button icon="el-icon-close" @click="removeCount(ind,user)"></el-button>
						</li>
					</div>
				</div>
			</ul>
	</div>
  

		
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Landing',
  data () {
    return {
			uid:'',
			psd:'',
      value1: true,
	  value2: false,
	  user:[],
	  newCount:true
    }
  },
	methods:{
		initScroll(SCobj){
             new BScroll(SCobj,{
					scrollY:true,
                    click:true,
				})
			
		},
		getUser(){
			let list = JSON.parse(localStorage.getItem('userIfo'))
			console.log(list)
			if(list&&list.length>0){
				
				this.user=list
				this.newCount=false
			}
		},
		landing(){
			if(this.$route.query.openId||localStorage.getItem('openId')){
				let param=this.$route.query.openId||localStorage.getItem('openId')
				this.$https.get('/login/weiXin/api/v1/user/activate',{params:{
					username:this.uid,
					password:this.psd,
					openId:param
				}}).then(res=>{
					if(res.data.code==0){
						localStorage.setItem('access_token',res.data.data)
						localStorage.setItem('openId',param)
						let list = JSON.parse(localStorage.getItem('userIfo'))
						if(list&&list.length>0){
							list.push({
								username:this.uid,
								password:this.psd,
							})
							let userIfo=[... new Set(list.map(c=>JSON.stringify(c)))].map(c=>JSON.parse(c))
						
							
							
							console.log(list)
							localStorage.setItem('userIfo',JSON.stringify(userIfo))
						}else{
							console.log(22)
							let userifo=JSON.stringify([{username:this.uid,password:this.psd}])
							localStorage.setItem('userIfo',userifo)
						}
						this.$message({
							type:"success",
							message:'激活成功'
						})
						this.$router.replace('/nav')
					}else{
						this.$message({
							type:"error",
							message:res.data.message
						})
					}
				})

			}
			// this.$https.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'; 
			// this.$https.get('/loginApi/auth/login?type=weChat&grant_type=password&openId=123456', {
			// 	auth:{
			// 		username:'app',
			// 		password:'app'
			// 	}
			// }).then(res=>{
			// 	console.log(res)
			// 	if(res.data.access_token){
			// 		localStorage.setItem('access_token',res.data.access_token)
			// 		this.$router.replace('/Home')
			// 	}
			// })
			
		},
		reland(user){
			if(this.$route.query.openId||localStorage.getItem('openId')){
				let param=this.$route.query.openId||localStorage.getItem('openId')
				this.$https.get('/login/weiXin/api/v1/user/activate',{params:{
					username:user.username,
					password:user.password,
					openId:param
				}}).then(res=>{
					console.log(res)
					if(res.data.code==0){
						localStorage.setItem('access_token',res.data.data)
						localStorage.setItem('openId',param)
						this.$message({
							type:"success",
							message:'激活成功'
						})
						this.$router.replace('/nav')
					}else{
						this.$message({
							type:"error",
							message:res.data.message
						})
					}
				})

			}
		},
		removeCount(ind,table){
			table.splice(ind,1)
			if(table.length==0){
				this.newCount=true
			}
			localStorage.setItem('userIfo',JSON.stringify(table))
		}
	},
	mounted(){
			this.getUser()
			this.initScroll(this.$refs.Scroll)
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
	.contain{
		height: 100vh;
		background: rgb(241, 241, 241);
		display: flex;
		flex-direction: column;
		justify-content:center;
		.Landing{
			background-color:rgb(241, 241, 241);
			padding: 20px 0 20px 0;
			border-radius: 20px;
			margin-top:-100px; 
			
		}
		.Landing h2{
			margin-bottom: 30px;
		}
		.title{
			display: block;
			font-size: 40px;
			text-align: center;
			color: #747776
		}
		.land{
			margin: 0 20px 10px 20px;
			.land-button{
				width: 100%;
				margin-top:15px;
				margin-left: 0;
			}
			.land-input{
				margin:0 0 10px 0;
				span{
					font-size: 10px;

				}
				.pswRem{
					margin-top: 20px;
					display: flex;
					justify-content: flex-end;
				}
			}
			
		}
		
		.countList{

			min-height: 180px;
			margin: 0 20px 10px 20px;
			li{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				p{
					
					height: 50px;
					width: 80%;
					background: #747776;
					color: #fff;
					margin: 10px 0px;
					border-radius: 5px;
					cursor: pointer;
					font-size: 17px;
					line-height: 50px;
					text-indent: 20px;

				}
				button{
					display: block;
					height: 50px;
					font-size: 18px;
				}
			}
			.count-title{
				display: flex;
				justify-content:space-between;
				align-items: center;
				span{
					font-size: 15px;
					color: #747776;
				}
			}
			.count-item{
				margin-top: 10px;
				height: 250px;
				overflow: hidden;
				>div{
					min-height: calc(100% + 1px)
				}
			}
		}
	}
</style>
