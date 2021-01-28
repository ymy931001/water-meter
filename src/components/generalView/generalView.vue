<template>
	<div id="generalView" ref="Box">
		<header>
			<!-- <el-button type="primary" icon="el-icon-arrow-left" @click="back()">返回</el-button> -->
			<span>我的设备</span>
		</header>
		
			<div class="user">
				<div class="userIfo">
					<div class="headPic">
						<img :src="userIfo?userIfo.headimgurl:headurl" alt="" width="50" height="50">
					</div>

					<div class="left">
						<div>用户名：{{userIfo?userIfo.nickname:'User'}}</div>
						<div>用户昵称：{{userIfo?userIfo.username:'username'}}</div>
					</div>
				</div>
				
				<div class="exit">
						<el-button type="danger" @click="logout">退出</el-button>
				</div>

			</div>
			<div class="tap">
				<router-link to="/equipMain" class="tap-item">
					<label >
						
						<el-button size="small" >正常设备</el-button>
						
					</label>
				</router-link>
				<router-link to="/executing" class="tap-item">
					<label >
						<el-button size="small" >正在执行</el-button>

					</label>
				</router-link>
				<router-link to="/equipErr" class="tap-item">
					<label>
						<el-badge :value="this.tableData.length" :hidden="errNum" class="item">
							<el-button size="small">设备异常</el-button>
						</el-badge>
					</label>	
				</router-link>
			</div>
			<keep-alive>
				<router-view   class="Router" v-if="$route.meta.keep_alive"></router-view>
			</keep-alive>
			<router-view   class="Router" v-if="!$route.meta.keep_alive"></router-view>
			
		
		
	</div>
</template>
<script>
import headimg from './head.png'
	export default{
		data(){
			return{
				tableData: [
				],
				userIfo:null,
				headurl:headimg
			}
		},
		methods:{
			filterType(value,row,column){
				return row.type === value;
			},
			 back(){
				this.$router.go(-1)
			},
			logout(){
				this.$http.get('/weiXin/api/v1/user/logoffUser')
				.then(res=>{
					if(res){
						localStorage.removeItem('access_token')
						this.$router.replace('/landing')
					}
				})
			},
			searchdata(type){
            return this.$http.get('/weiXin/api/v1/deviceMend/getDeviceExceptions',{
                deviceTypes:type,
                pageNum: 1,
                pageSize: null,
                searchType:1
            },{
                'Content-Type': 'application/json; charset=UTF-8'
            },true)
            .then(res=>{
                if(res&&res.data.data.length>0){
                    let list = res.data.data.map(val=>{
                        return {
                            type:(val.deviceType==2&&'采集器')||(val.deviceType==3&&'水表')||(val.deviceType==1&&'无线单表'),
                            date:val.deviceNumber,
                            alarmTime:val.alarmTime,
                            exception:val.exception

                        }
                    })
                    this.tableData.push(...list)

                }
            })
			},
			
		},
		mounted(){
			this.$https.all([this.searchdata(1),this.searchdata(2),this.searchdata(3)])
			if(localStorage.getItem('access_token')){
				this.$http.get('/weiXin/api/v1/user/getUserInfoByAccessToken')
				.then(res=>{
					if(res.data.code==0){
						this.userIfo=res.data.data
					}
				})
			}
		},
		computed:{
			errNum:function(){
				if(this.tableData.length==0){
					return true
				}else{
					return false
				}
			}
		},
		activated(){
		}
	}
</script>
<style scoped>

header{
	height: 40px;
	background: #747776;
	text-align: center;
	position: fixed;
	top: 0;
	
	z-index: 50;
	width: 100%;
}
header span{
	display: inline-block;
	font-size: 16px;
	line-height: 36px;
	color: #fff;
}
header button{
padding: 0 15px 0 10px;
height: 40px;
position: absolute;
left: 0;
}

</style>
<style lang="less">
	#generalView{
		background: #E7E7E7;
		padding-bottom: 20px;
		.user{
			background-color: #fff;
			background-image: none;
			border-radius: 4px;
			border: 1px solid #dcdfe6;
			color: #606266;
			height: 60px;
			outline: none;
			padding: 0 15px;
			-webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
			transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
			display: flex;
			justify-content: space-between;
			.userIfo{
				display: flex;
			justify-content: space-between;
			}
			.headPic{
				padding-right: 10px;
				padding-top: 5px;
				width: 50px;
				border-right: 1px solid #dcdfe6;
				i{
					font-size: 30px;
				}
			}
			.left{
				padding-left: 20px;
				line-height: 30px;
				color: #606266;
				
			}
			.exit{
				line-height: 60px;
			}
		}
		.tap{
			margin-top: 20px;
			display: flex;
			.tap-item{
				width: 50%;
				text-align: center;
				border-top: 1px solid #dcdfe6;
				border-bottom: 1px solid #dcdfe6;
				.item{
					width: 100%;
				}
				button{
					width: 100%;
					padding: 20px 0 20px 0;
					border: 0;
					font-size: 14px;
					
				}
			}
			.el-badge__content{
				top: 20%;/* no*/ 
				right:35%;/* no*/ 
			}
			
		}
	}

</style>