<template>
	<div id="collector">
		
		<el-form class="textform" ref="form" :model="form" label-width="80px" :rules="rules" >
			<el-form-item class="location" label="详细地址" prop="address" >
				<el-input v-model="form.address" placeholder="门牌号、小区、楼栋号" clearable></el-input>
				
			</el-form-item>
			<el-form-item label="所属小区"  prop="village" >
				<el-autocomplete
				class="selectVillage"
				v-model="form.village"
				:fetch-suggestions="querySearch"
				placeholder="XX小区"
				clearable></el-autocomplete>
			</el-form-item>
			<el-form-item label="具体位置" prop="doorNumber">
				<el-input v-model="form.doorNumber" placeholder="一单元天台" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备编号"  prop="id">
				<el-input v-model="form.id" placeholder=""></el-input>
				<QR/>
			</el-form-item>
				<el-form-item label="安装地区" prop="area">
			<span class="seletArea"  @click.stop="slctAddress"  >{{form.area}}</span>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">提交测试</el-button>
			</el-form-item>
			<el-button type="text" @click="showMore" class="showMore">更多信息<i class="el-icon-arrow-right"></i> </el-button>
			<div class="collectorMore" ref="collectorMore">
				<el-form-item label="挂接水表"  prop="wid">
					<el-input v-model="form.wid" placeholder="无线采集器可挂接的水表编号"></el-input>
				</el-form-item>
				<el-form-item label="用户姓名" >
				<el-input v-model="form.name" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
				<el-input v-model="form.phoneNumber" placeholder=""></el-input>
				</el-form-item>
				
			</div>
			
		</el-form>
		<selectAddress ref="slcAdress" :areaID="this.form"  @areaConfirm="areaConfirm"></selectAddress>
		<testResult :deviceNum="this.form.id" ref="testResult"/>
		
	</div>
</template>
<script>
import BMap from 'BMap'
import selectAddress  from '../../selectAddress/selectAddress.vue'
import testResult  from './testResult.vue'
import QR from '@/components/QR/QR.vue'
import store from '@/store/index.js'
import {offline,removeStorage} from '@/assets/js/offline.js'
	export default{
		mounted(){
			this.getmaparea()
			var EventUtil = {
				addHandler: function(element, type, handler) {
					if (element.addEventListener) {
						element.addEventListener(type, handler, false);
					} else if (element.attachEvent) {
						element.attachEvent("on" + type, handler);
					} else {
						element["on" + type] = handler;
					}
				}
			};
			var that = this
			EventUtil.addHandler(window, "online", function() {
				that.isOffline = false
				console.log('online:',that.isOffline)
			});
			EventUtil.addHandler(window, "offline", function() {
				that.isOffline = true
				console.log('offline:',that.isOffline )
			});
		},
		computed:{
				qrId:function(){
				return this.$store.state.qrId
			}
		},
		watch:{
			 qrId(newdata){
				 this.form.id=newdata
			}
		},
		 data() {
		  return {
				options:[],
				isOffline:false,
				type:null,
			form: {
				id:'',
				wid:null,
				address:null,
				name: null,
				village:null,
				phoneNumber:null,
				doorNumber:null,
				type: [],
				provinceId:null,
				area:'请选择位置',
				cityId:null,
				istrictId:null,
				lat:null,
				lng:null
			},
			rules: {
				id: [
					{ required: true, message: '请输入编号', trigger: 'blur' },
					
				],
					area:[
						{required:true}
					],
					village: [
					{ required: true, message: '请输入小区', trigger: 'change' }
				],
				address: [
					{ required: true, message: '请填写详细地址', trigger: 'change' }
				],
				doorNumber: [
					{ required: true, message: '请填写具体位置', trigger: 'blur' }
				]
			}
		  }
		},
		methods: {
			showMore(){
				this.$refs.collectorMore.classList.toggle('ishow')
			},
			getVillage(){
				this.$http.get('/weiXin/api/v1/common/getAreaByPid',{
					id:this.form.istrictId
				})
				.then(res=>{
					if(res){
						this.options=res.data.data.map(val=>{
							return {
								value:val.district,
								label:val.district
							}
						})

					}
				})
			},
			querySearch(queryString, cb) {
				var options = this.options;
				var results = queryString ? options.filter(this.createFilter(queryString)) : options;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (option) => {
				return (option.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			getmaparea(){
				let that=this
				var geoc = new BMap.Geolocation();
				var myGeo = new BMap.Geocoder(); 		
				geoc.enableSDKLocation();	
				geoc.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						var mk = new BMap.Marker(r.point);
						var mapPoint=new BMap.Point(r.point.lng,r.point.lat)
						that.form.lat=r.point.lat
						that.form.lng=r.point.lng
						//坐标转换完之后的回调函数
						myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){      
							if (result){   
								
							that.area=result.addressComponents.province + "-" + result.addressComponents.city + "-" + result.addressComponents.district   
							
							that.$http.get('/weiXin/api/v1/common/getIdsByDistrict',{
								province:result.addressComponents.province,
								city: result.addressComponents.city.substring(0, result.addressComponents.city.length-1),
								district:result.addressComponents.district.substring(0, result.addressComponents.district.length-1)
							})
							.then(res=>{
							
								if(res&&res.data.code==0){
									that.form.provinceId=res.data.data[0].id,
									that.form.cityId=res.data.data[1].id,
									that.form.istrictId=res.data.data[2].id
									that.getVillage()
								}else{
									that.form.area="请选择地区",
									that.$message({
									type: 'error',
									message: '定位失败,请手动选择省市区地址'
									});
								}
							})
							that.form.area=result.addressComponents.province + "-" + result.addressComponents.city + "-" + result.addressComponents.district 
							that.form.address=result.addressComponents.street + "-" + result.addressComponents.streetNumber
							}      
						});
					}
					else {
						alert('failed'+this.getStatus());
					}        
				});		



			},			
			areaConfirm(part){
				let area =part.map((value,index)=>{
				return value.part
				})
				this.$nextTick(() => {
					this.form.area = area.join('-')
				})
				let areaid = part.map((val,ind)=>{
					if(val.id>0){
						return val
					}
				})
				this.form.provinceId = part[0]&&part[0].id
				this.form.cityId = part[1]&&part[1].id
				this.form.istrictId=part[2]&&part[2].id
				this.getVillage()
			},
			slctAddress(){
				this.$refs.slcAdress.show()
			},
			onSubmit(form) {
				let that=this
				let data = {
					type:this.type,
					deviceNumber:this.form.id,
					longitude:this.form.lng,
					districtSite:this.form.village,
					districtDetail:this.form.address,
					latitude:this.form.lat,
					provinceId:this.form.provinceId,
					cityId:this.form.cityId,
					districtId:this.form.istrictId,
					associatedNum:this.form.wid,
					consumerUname:this.form.name,
					telephone:this.form.phoneNumber,
					houseNumber:this.form.doorNumber
				}
				var offlineType

				
				this.$refs[form].validate((valid)=>{
					if(valid){
						if(that.type==1){
							offlineType="singlemeter"
						}else if(that.type==2){
							offlineType="collector"
						}
						
						
						this.$confirm('是否进行测试？', '提示', {
							confirmButtonText: '联网测试',
							cancelButtonText: '仅提交',
							type: 'warning',
							center: true,
							distinguishCancelAndClose:true,
							closeOnClickModal:true,
							beforeClose: (action, instance, done) => {
								if (action === 'confirm') {              //联网测试
									// instance.confirmButtonLoading = true;
									// instance.confirmButtonText = '执行中...';
									console.log(this.isOffline,that.isOffline)
									if(this.isOffline){
										offline(offlineType,data) 
										done()
									}else{
										if(this.$route.query.type==2){ //采集器安装需要查看当前数据
	
											this.$refs.testResult.show(data)
											done()
										}
										if(this.$route.query.type==1){
											this.$http.post('/weiXin/api/v1/deviceManager/collectorAndWirelessInstall',{
												...data
											})//设备安装
											
											.then(res=>{
												if(res){//安装成功
														that.$http.post('/weiXin/api/v1/deviceManager/networkingTest',{deviceNums:[that.form.id],deviceType:this.type},{//发起联网测试
															'Content-Type': 'application/json; charset=UTF-8'
														},true)
														.then(res=>{
															if(res){
																instance.confirmButtonLoading = false;
																instance.confirmButtonText = '联网测试';
																done()
																that.$message({
																	type: 'success',
																	message: that.form.id+'联网测试已下发'
																});
																this.$router.push('/textonline')
															}else {
																that.$message({
																	type: 'error',
																	message: '设备安装成功，联网测试下发失败'
																});
																instance.confirmButtonLoading = false;
																instance.confirmButtonText = '联网测试';
															}			
														})
		
												}else {//安装失败
													setTimeout(() => {
														instance.confirmButtonLoading = false;
														instance.confirmButtonText = '联网测试';
														that.$message({
															type:'error',
															message:res.data.message
														})
													},300)
													
												}
											})
											.catch(e=>{
												if(e=='timeout'){
													offline(offlineType,data)
													instance.confirmButtonLoading = false;
													instance.confirmButtonText = '联网测试';
													done()
												}
											})

												
										}

									}

									


								} else if(action === 'cancel'){					//仅提交
									if(that.isOffline){
										offline(offlineType,data) 
										done()
									}else{
										this.$http.post('/weiXin/api/v1/deviceManager/collectorAndWirelessInstall',{
											...data
										})
										.then(res=>{
											if(res){
												removeStorage(offlineType,this.form.id)
												done()
												this.$message({
													type: 'success',
													message: this.form.id+'安装成功'
												});
											}else{
												
												this.$message({
													type:'error',
													message:res.data.message
												})
											}
										})
										.catch(err=>{
											console.log(err)
										})

									}

									
								}else{
									// removeStorage(offlineType,that.form.id)	
									done()			//点击其他区域关闭 action=close
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = '联网测试';

										
								}
							}
						}).then((res) => {
							
							
						}).catch((action) => {
	
						});		
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			  },
			
			  
		},
		components:{
				selectAddress,
				QR,
				testResult
			},
		activated() {
			if(this.$route.query.type!==null){
					this.type=this.$route.query.type
				}
			if(this.form.id&&this.form.id.length>6){
				this.$store.commit('changeId',this.form.id.substring(0,6))
				//默认前6位
			}
			
		},
	  }
</script>
<style lang="less">
#collector{
	// margin-bottom: 120px;
	.textform{
	padding: 0 20px 0 20px;
	// .el-form-item{
	// 	margin-bottom: 9px;
	// }
	}
	.part{
	margin-top: 20px;
	}
	.selectVillage{
		width: 100%;
		.el-input__suffix{
				right:0;
			}
	}
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
			width: 100%;
	}
	.showMore{
		margin-top: -15px;
	}
	.collectorMore{
		transition: transform 0.3s ease-out;
		transform-origin:0 0;
		transform: rotateX(-90deg) 
	}
	.ishow{
		transform: rotateX(0deg);
	}
}



</style>