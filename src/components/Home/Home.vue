<template>
	<div id="Main">
		<keep-alive>
			<router-view   class="Router" v-if="$route.meta.keep_alive"></router-view>
		</keep-alive>
		<router-view   class="Router" v-if="!$route.meta.keep_alive"></router-view>
		<el-row class="nav" ref = "nav">
				<router-link class="nav-item" to="/generalView">
				
					<el-button type="primary" plain  ><i class="iconfont">&#xe60d;</i> <p>我的</p> </el-button>
				</router-link>		
				<router-link class="nav-item" to="/nav">
					<el-button type="primary" plain  autofocus><i class="iconfont">&#xebb7;</i><p>菜单</p></el-button>
				</router-link>
				<router-link class="nav-item" to="/repairList">
					<el-button type="primary" plain ><i class="iconfont">&#xe683;</i><p>维修</p></el-button>
				</router-link>		
		</el-row>
	</div>
</template>
<script>
import {wxtoken} from '@/assets/js/wx'
	export default{
		data() {
			  return {
				  transitionName: 'fade',
				  screenOheight:0,
				  screenheight:0,
			  };
		},
		methods:{
			
		},

		watch: {
			screenheight(data){	
				if(navigator.userAgent.indexOf('iPhone')==-1){
					if(this.screenOheight>this.screenheight){
						this.$refs.nav.$el.style.display="none"
					}else{
						this.$refs.nav.$el.style.display="flex"
					}
				}			
						
			}	
		},
		mounted(){
			wxtoken()
			this.screenOheight=document.body.clientHeight
			this.screenheigh=document.body.clientHeight
			this.windowRresize =  () =>{
				this.screenheight = document.body.clientHeight
			}
			window.addEventListener('resize',this.windowRresize)
		},
		beforeDestroy() {
			window.removeEventListener('resize',this.windowRresize)
		},
	}
</script>
<style>

/* .el-table__body-wrapper::-webkit-scrollbar{
	display: none;
} */
*::-webkit-scrollbar{
	height: 0;
	width: 0;
}

</style>

<style scoped>
.Router {
	padding-top:40px;
     /* transition: transform 0.1s ease; */
}

/* .slide-enter-active
{
    opacity: 0;
    -webkit-transform: translate(100%,0);
    transform: translate(100%,0);
}
.slide-leave-to
{
	opacity: 0;
    -webkit-transform: translate(-100%,0);
    transform: translate(-100%,0);
} */



#Main {
	background:#f8f8f8;
	height: 100vh;
}
header{
	height: 40px;
	background: #409EFF;
	text-align: center;
	position: relative;
}
header span{
	display: inline-block;
	font-size: 10px;
	line-height: 36px;
	color: #fff;
}
header button{
position: absolute;
left: 0;
}
.nav{
	position: fixed;
	bottom: 0;
	display: flex;
	width: 100%;
	z-index: 5000;
}
.nav-item{
	font-size: 30px;
	flex: 1;
}
.nav-item button{
	width: 100%;
	border-radius: 0;
	border:0;
	border-top:1px solid #c7c9c8;
	margin: 0;
	padding:5px 0;
}

</style>