<template>
	<div id="equipManage">
		<header>
			<el-button type="primary" icon="el-icon-arrow-left"  @click="back()">返回</el-button>
			<span>{{this.title}}</span>
		</header>
		<!-- <keep-alive>
			<router-view class="managelist" v-if="$route.meta.keep_alive"></router-view>
		
		</keep-alive> -->
		<router-view class="managelist" ></router-view>


	</div>
	
</template>
<script>

	export default{
		data() {
			return {
				listStyle: {
					top: 40+'px',
					left:-450+'px'
				},
				show:false,
				isback:''
				
			}
		},
		methods: {
			back(){
				this.$router.go(-1)
			},
			showMore(){
				this.listStyle={
					left:0,	
				}
				this.show=true
				
			},
			cancle(){
				this.listStyle={
					left:-450+'px'
				}
				this.show=false
				
				
			},
			stopProp(){
			},
			skip($event,index,indexPath){

			}
		},
		mounted(){
			this.isback=this.$router.history.current.path
		},
		components:{
			
		}
	}
</script>
<style  lang="less" >
@keyframes opacity {
	from{
		opacity: 0;
	}
	to{
		opacity: 0.3;
	}
}
.managelist{
	margin-top: 20px;
}
#equipManage{
// overflow: hidden;
background:rgb(248, 248, 248);
	>header{
	height: 40px;
	background: #747776;
	text-align: center;
	position: fixed;
	top: 0;
	z-index: 100;
	width: 100%;
	span{
		display: inline-block;
		font-size: 16px;
		line-height: 36px;
		color: #fff;
	}
	button{
		padding: 0 15px 0 10px;
		height: 40px;
		position: absolute;
		left: 0;
	}

}



}

</style>