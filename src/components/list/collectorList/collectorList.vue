<template>
	<div id="collectorList">
		<div class="block2">
			<span class="seletArea"  @click.stop="slctAddress"  >{{area}}</span>
		</div>
		
		<div class="baidumap" id="allmap"></div>
	
		<div class="block">
			<div class="qr">
				<el-input
				class="idSearch"
				placeholder="输入设备编号"
				v-model="equipId"
				>
					
				</el-input>
				<QR/>		

			</div>

		<el-row>
			<el-button type="primary" class="searchConfirm" @click="searchOne">查询</el-button>
		</el-row>
		</div>
		<selectAddress ref="slcAdress"  @areaConfirm="areaConfirm"></selectAddress>
	</div>
	
</template>


<script>
import selectAddress  from '../../selectAddress/selectAddress.vue'
import { Loading } from 'element-ui';
import BMap from 'BMap'
import QR from '@/components/QR/QR.vue'

import store from '@/store/index.js'

	export default{
		 data() {
		  return {
			area:'请选择地区',
			map:'',
			tabPosition: '采集器',
			pointDate:[
				// ["116.404","39.915"],["116.404","39.914"],["116.304","39.915"],["116.402","39.915"],["116.404","38.915"],["115.404","39.915"]
			],
			equipId:'',
		  };
		},
		mounted() {
			this.equipDate()
			.then(()=>{
				this.creatMap()
			})

			//先获取设备数据，再渲染地图
			
			
		},
		computed:{
			equipStore:function(){
				return this.$store.state.qrId
			}
		},
		methods:{
			//查询某一范围的设备
			areaConfirm(part){
				let act = []
				part.map((value,index)=>{
				
					act.push(value.part)
				})
				this.area = act.join('-')
				let area = []
				part.map((value,index)=>{
					if(value.id>=0){
						area.push(value)
					}
				})
				//最小范围的地区
				let PART = area.length>0 && area[area.length-1].part
				let LEVEL=(area.length==1&&10)||(area.length==2&&12)||(area.length==3&&15)
				this.map.centerAndZoom(String(PART),LEVEL); 
			},
			//查询某一具体设备
			searchOne(){
				if(this.equipId){
					Loading.service({fullscreen: true})
					this.$http.get('/weiXin/api/v1/deviceManager/getDeviceByDeviceNum',{deviceNumber:this.equipStore||this.equipId})
					.then(res=>{
						if(res&&res.data.data.length>0&&res.data.data[0].latitude){
							this.$nextTick(function(){
								this.map.centerAndZoom(new BMap.Point(res.data.data[0].longitude,res.data.data[0].latitude),18)
								Loading.service({fullscreen: true}).close()
							})

						}else{
							this.$message({
								type:'info',
								message:'无为之信息或设备不存在'
							})
							Loading.service({fullscreen: true}).close()
						}
						
					})
				}
			},
			slctAddress(){
				this.$refs.slcAdress.show()
			},
			handleChange(value) {
				console.log(value);
			},
			//获取设备经纬度
			equipDate(){
				return new Promise(resolve=>{
					Loading.service({fullscreen: true})
					this.$http.get('/weiXin/api/v1/deviceManager/getDeviceAndCollector')
					.then(res=>{
						if(res.data.code==0){
							let point = []
							res.data.data.map((val,ind)=>{
								point.push([
								val.longitude,
								val.latitude,
								val
								])
							})
							this.pointDate = point
							resolve()
						}else{
							Loading.service({fullscreen: true}).close()
						}
					})
					.catch(()=>{
						Loading.service({fullscreen: true}).close()
					})	
				})
			},
		    creatMap(){


				let that=this
				var map = new BMap.Map("allmap");
				// 创建地图实例
				
				var geoc = new BMap.Geolocation();//开启sdk定位
				var myGeo = new BMap.Geocoder(); //逆解析
				map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
				map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
				geoc.enableSDKLocation();	
				geoc.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						var mk = new BMap.Marker(r.point);
					
						map.addOverlay(mk);
						map.panTo(r.point);
						var mapPoint=new BMap.Point(r.point.lng,r.point.lat)
						// var convertor = new BMap.Convertor();
						map.setCenter(r.point);
						myGeo.getLocation(mapPoint, function(result){      
							if (result){    
								console.log(result)
							that.area=result.addressComponents.province + "-" + result.addressComponents.city + "-" + result.addressComponents.district       
							}      
						});
					}
					else {
						alert('failed'+this.getStatus());
					}        
				});	

				var opts = {
					width : 200,     // 信息窗口宽度
					height: 130,     // 信息窗口高度
					title : "信息窗口" , // 信息窗口标题
					enableMessage:true,//设置允许信息窗发送短息
				};
				var markerArray = [];
				var myIcon = new BMap.Icon("http://home.terabits.cn/eq.png", new BMap.Size(35,35));
				this.pointDate.forEach(value=>{
					var point =new BMap.Point(value[0], value[1])
					var marker = new BMap.Marker(point,{icon:myIcon,offset:new BMap.Size(0,-10)})  // 创建标注
					map.centerAndZoom(point,15)
					map.addOverlay(marker)              // 将标注添加到地图中
					markerArray.push(marker);
					let src=(value[2].deviceType==1&&'singlemeter?id='+value[2].deviceNumber)||(value[2].deviceType==2&&'coloterManage?id='+value[2].deviceNumber)
					marker.addEventListener("click",function(e){
						openInfo(`
						<div class="mapInfo">
							<p>设备Id: ${value[2].deviceNumber}<p>
							<p>详细位置: ${value[2].districtDetail||'暂无'}<p>
							<p>设备类型: ${(value[2].deviceType==1&&'无线单表')||(value[2].deviceType==2&&'采集器')}<p>
						</div>
						<label class="infoDetail">
							<a href="
							${window.location.href.substring(0,window.location.href.lastIndexOf('/')+1)
							+src
							}">详情</a>
						<label>
						`
						,e)}
					);
					
				})
				var openInfo=function(content,e){
					var p = e.target;
					var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
					var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
					
					map.openInfoWindow(infoWindow,point); //开启信息窗口
				}
				

				
				map.addControl(new BMap.NavigationControl()); 
				
						
				Loading.service({fullscreen: true}).close()
				var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markerArray});
				this.map = map	
			},
			mapData(){
				var that=this
				var markers = [];
				if(this.pointDate.length>0){
					this.pointDate.map(value=>{
						var point = new BMap.Point(value[0], value[1]);
						// 创建点坐标  
						this.map.centerAndZoom(point, 15);
						// 初始化地图，设置中心点坐标和地图级别 
						var marker = new BMap.Marker(point)  // 创建标注
						markers.push(new BMap.Marker(point));
						this.map.addOverlay(marker)              // 将标注添加到地图中
						
					})
					var markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:markers});		
	
					var geoc = new BMap.Geolocation();
					var myGeo = new BMap.Geocoder(); 
					
					geoc.enableSDKLocation();	
					geoc.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							var mk = new BMap.Marker(r.point);
						
							// map.panTo(r.point);
							var mapPoint=new BMap.Point(r.point.lng,r.point.lat)
	
							// var convertor = new BMap.Convertor();
							that.map.addOverlay(mk);
							that.map.setCenter(r.point);
							myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){      
								if (result){    
								that.area=result.addressComponents.province + "-" + result.addressComponents.city + "-" + result.addressComponents.district       
								}      
							});
						}
						else {
							alert('failed'+that.getStatus());
						}        
					});	
					
				}else{
					var geoc = new BMap.Geolocation();
					var myGeo = new BMap.Geocoder(); 
					
					geoc.enableSDKLocation();	
					geoc.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							var mk = new BMap.Marker(r.point);
						
							// map.panTo(r.point);
							var mapPoint=new BMap.Point(r.point.lng,r.point.lat)
	
							// var convertor = new BMap.Convertor();
							
							this.map.addOverlay(mk);
							this.map.setCenter(r.point);
							myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){      
								if (result){    
								that.area=result.addressComponents.province + "-" + result.addressComponents.city + "-" + result.addressComponents.district       
								}      
							});
						}
						else {
							alert('failed'+this.getStatus());
						}        
					});	
				}
			}
		},
		components:{
			selectAddress,QR
		},
		activated(){
			this.equipDate()
			.then(()=>{
				if(this.map){
					this.mapData()

				}
			})
			
		}
			
	}
</script>
<style lang="less">
#collectorList{
	margin-top: 0;
	position: absolute;
	left: 0;
	top: 40px;
	width: 100%;
	height: 80vh;
	.baidumap{
	width:100%;
	height:90vh;
	position: absolute;
	z-index: 3;
	}
	#allmap{
		.mapInfo{
			background-color: #747776;
			border-color: #747776;
			color:#fff;
			font-size: 14px;
			height: 100%;
			
		}
		.infoDetail{
			width: 100%;
			height: 30px;
			display: block;
			line-height: 30px;
			border-radius: 4px;
			text-align: center;
			border: 1px solid #f8f8f8;
			background: #f8f8f8;
			a{
				display: block;
				text-decoration: none;
				font-size: 14px;
				font-size: 16px;
				color: #6187f0;
				border: 0;
			}
		}
	}
	.block2{
		position: absolute;
		z-index: 10;
		width: 100%;
		top: 10px;
		text-align: center;
		.seletArea{
			-webkit-appearance: none;
			background-color: #fff;
			background-image: none;
			border-radius: 4px;
			border: 1px solid #dcdfe6;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			color: #606266;
			display: inline-block;
			font-size: inherit;
			height: 40px;
			line-height: 40px;
			outline: 0;
			padding: 0 15px;
			-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			transition: border-color .2s cubic-bezier(.645,.045,.355,1);
			width: 87%;
		}


	}
	.qr{
        position: relative;
        margin: auto;
        margin-top:20px; 
        width: 320px;
        line-height: 40px;
		}
	.block{
	position: absolute;
	width: 100%;
	text-align: center;
	z-index: 10;
	bottom: 0;
	.idSearch{
					width: 320px;
					// margin-top: 20px;
				}
		.searchConfirm{
			width: 320px;
			margin-top: 20px;
		}
	}
}



</style>