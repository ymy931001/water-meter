<template>
	<div id="watermeter">
		<el-form class="textform" ref="form" :model="form" label-width="95px" :rules="rules">
			<!-- <div v-if="!$route.query.inventedID">
				<el-form-item label="详细地址" prop="address">
				<el-input v-model="form.address" clearable></el-input>
				</el-form-item>
				<el-form-item label="所属小区" prop="village" >
					<el-autocomplete
					class="selectVillage"
					v-model="form.village"
					:fetch-suggestions="querySearch"
					placeholder="XX小区"
					clearable></el-autocomplete>
				</el-form-item>

			</div> -->
			<el-form-item label="门牌号" prop="doornumber">
				<el-input v-model="form.doornumber" placeholder="1-101" clearable></el-input>
			</el-form-item>
			<el-form-item label="设备编号" prop="id">
			<el-input v-model="form.id" ></el-input>
			<QR/>
			</el-form-item>
			<el-form-item label="所属采集器" prop="pid">
				<el-input :value="form.pid"></el-input>
			</el-form-item>
			
			<el-form-item label="安装位置">
				<span class="seletArea"  @click.stop="slctAddress"  >{{form.area}}</span>

			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">提交</el-button>
			</el-form-item>
			<el-button type="text" @click="showMore" class="showMore">更多信息<i class="el-icon-arrow-right"></i> </el-button>
			<div class="watermeterMore" ref="watermeterMore">
				<el-form-item label="用户姓名" prop="name">
				<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="number">
				<el-input v-model="form.number"></el-input>
				</el-form-item>
			</div>
			
		</el-form>
		<selectAddress ref="slcAdress"  @areaConfirm="areaConfirm"></selectAddress>
	</div>
</template>
<script>
import selectAddress  from '../../selectAddress/selectAddress.vue'
import QR from '@/components/QR/QR.vue'
import store from '@/store/index.js'
import {offline,removeStorage} from '@/assets/js/offline.js'
	export default{
		 mounted(){
			 
			 if(this.$route.query.inventedID !=null){
				 this.form.pid = this.$route.query.inventedID
			 }
			 if(this.$route.query.collectorID !=null){
				 this.form.pid = this.$route.query.collectorID
			 }
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
			EventUtil.addHandler(window, "online", ()=> {
				this.isOffline=false
			});
			EventUtil.addHandler(window, "offline", ()=> {
				this.isOffline = true
				
		
			});
		 },
		 watch:{
			 qrId(newdata,olddata){
				 this.form.id=newdata
				 
			 }
		 },
		 data() {
		  return {
				isOffline:false, 
			  options:[],
				form: {
					pid:'',
					id:'',
					village:'',
					address:'',
					name: '',
					number:'',	
					area:'请选择地区',
					provinceId:'',
					cityId:'',
					istrictId:'',
					doornumber:'',
					lat:null,
					lng:null
				},
				rules: {
					pid: [
						{ required: true, message: '请输入所属采集器编号', trigger: 'blur' },
						
								],
					id: [
						{ required: true, message: '请输入水表编号', trigger: 'change' },
						{validator: (rule, value, callback)=>{
							if(value){
								if(value.charAt(4) !=8&&value.charAt(4)!='D'){
									callback(new Error('第5位必须为数字8或者字母D'))
								}
								if(value.length<10){
									callback(new Error('请输入10位有效数字'))
								}
								if(value.length>10){
								this.form.id = value.substring(0,10)
								}
								else{
									callback()
								}
							}
              
							
						}}],
					village: [
						{ required: true, message: '请输入小区', trigger: 'change' }
					],
					address: [
						{ required: true, message: '请填写详细地址', trigger: 'change' }
					],
					doornumber:[
						{ required: true, message: '请填写门牌号', trigger: 'change' }
					]
				}
		  }
		},
		methods: {
			showMore(){
				this.$refs.watermeterMore.classList.toggle('ishow')
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
						//坐标转换完之后的回调函数
						that.form.lat=r.point.lat
						that.form.lng=r.point.lng
						myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){      
							if (result){   
								console.log(result)
							that.area=result.addressComponents.province + "-" + result.addressComponents.city + "-" + result.addressComponents.district   
							
							that.$http.get('/weiXin/api/v1/common/getIdsByDistrict',{
								province:result.addressComponents.province,
								city: result.addressComponents.city.substring(0, result.addressComponents.city.length-1),
								district:result.addressComponents.district.substring(0, result.addressComponents.district.length-1)
							})
							.then(res=>{
								if(res.data.code==0){
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
				let data={
						type : 3,
						deviceNumber:this.form.id,
						houseNumber:this.form.doornumber,
						longitude:this.form.lng,
						districtSite:this.form.village,
						districtDetail:this.form.address,
						latitude:this.form.lat,
						provinceId:this.form.provinceId,
						cityId:this.form.cityId,
						districtId:this.form.istrictId,
						consumerUname:this.form.name,
						telephone:this.form.number,
						CollectorNum:this.form.pid
					}
				var that = this
				this.$refs[form].validate(valid=>{
					if(valid){
						
						
						this.$confirm('是否进行安装？', '提示', {
							confirmButtonText: '安装',
							cancelButtonText: '取消',
							type: 'warning',
							center: true,
							closeOnClickModal:true,
							beforeClose: (action, instance, done) => {
								if (action === 'confirm') {
									if(that.isOffline){
										offline('watermeter',data)
										done()
									}else{
										instance.confirmButtonLoading = true;
										instance.confirmButtonText = '执行中...';
										
										this.$http.post('/weiXin/api/v1/deviceManager/generalInstall',{
													...data
												})
												.then(res=>{
													if(res){//安装成功
														setTimeout(() => {
																instance.confirmButtonLoading = false;
																instance.confirmButtonText = '安装';
																done()
																this.$message({
																	type: 'success',
																	message: this.form.id+'安装成功'
																});
															},300)
		
													}else {
														setTimeout(() => {
															instance.confirmButtonLoading = false;
															instance.confirmButtonText = '安装';
															this.$message({
																type:'error',
																message:res.data.message
															})
														},300)
														
													}
												})
												.catch(e=>{

													if(e=='timeout'){//安装超时，网络不好
														offline('watermeter',data)
														instance.confirmButtonLoading = false;
														instance.confirmButtonText = '安装';
														done()
													}
												})

									}
									
									
								} else{	
									done()		//点击其他区域关闭
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = '安装';
									
								}
							}
						}).then(() => {
							this.form.id=this.form.id.substring(0,6)
							this.form.doornumber=this.form.doornumber.substring(0,this.form.doornumber.length-2)
						}).catch((action) => {
							this.$message({
								type:action =='confirm'?'success':'error',
								message: action == 'confirm'
										? '提交成功'
										: '提交失败'
							});
						});

					} else {
            return false;
          }
				})
		  },
		},
		computed:{
			qrId:function(){
				return this.$store.state.qrId
			}
		},
		components:{
				selectAddress,
				QR
		},
		activated(){
			if(this.form.id&&this.form.id>6){
				this.$store.commit('changeId',this.form.id.substring(0,6))
			}
			if(this.form.doornumber&&this.form.doornumber.length>2){
				this.form.doornumber=this.form.doornumber.substring(0,this.form.doornumber.length-2)
			}
		}



		}
</script>
<style scoped lang='less'>
#watermeter{
	margin-bottom: 70px;
	.selectVillage{
	width: 100%;
    .el-input__suffix{
			right:0;
		}
	}
	.showMore{
		margin-top: -15px;
	}
	.watermeterMore{
		transition: transform 0.3s ease-out;
		transform-origin:0 0;
		transform: rotateX(-90deg) 
	}
	.ishow{
		transform: rotateX(0deg);
	}
	
}

.textform{
		padding: 0 20px 0 20px;
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch; 
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
span{
		white-space: nowrap;  /*不换行，超出省略*/
		overflow: hidden;
		text-overflow: ellipsis;  /*超出部分切割显示为省略号 三个缺一不可*/
	}


</style>