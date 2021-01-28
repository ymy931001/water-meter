<template>
  <div id="replace">
		<el-form class="textform" ref="form" :model="form" label-width="95px" :rules="rules" >
		  <el-form-item label="新设备编号"  prop="id">
			<el-input v-model="form.id"></el-input>
			<QR/>	
		  </el-form-item>
			<el-form-item class="location" label="详细地址" prop="address">
		  	<el-input v-model="form.address" placeholder="街道/单元" ></el-input>
			
		  </el-form-item>
		  <el-form-item label="具体位置" prop="houseNumber">
		  	<el-input v-model="form.houseNumber" placeholder="例：一单元天台"></el-input>
		  </el-form-item>	

		  
			<el-form-item label="安装地区">
		  <span class="seletArea"  @click.stop="slctAddress"  prop="area">{{area}}</span>
		  </el-form-item>
		  <el-form-item label="所属小区"  prop="village">
			<el-select v-model="form.village" 
			filterable
			remote
			allow-create 
			clearable 
			ref="select"
			@touchstart.native='getfocus()'
			placeholder="XX小区" 
			class="selectVillage">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
		  </el-form-item>
			<el-form-item>
			<el-button type="primary" @click="onSubmit('form')">替换</el-button>
		  </el-form-item>
			<el-button type="text" @click="showMore" class="showMore">更多信息<i class="el-icon-arrow-right"></i> </el-button>
			<div class="collectorMore" ref="collectorMore">
				<el-form-item label="用户姓名" p>
				<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
				<el-input v-model="form.number"></el-input>
				</el-form-item>
			</div>
		  
		</el-form>
		<selectAddress ref="slcAdress" :areaID="{pId:form.provinceId,cId:form.cityId,iId:form.istrictId,}" @reshowarea='reshowarea' @areaConfirm="areaConfirm"></selectAddress>
	  
  </div>
</template>

<script>
const times = 5  //轮询请求次数
import selectAddress  from '../../selectAddress/selectAddress.vue'
import QR from '@/components/QR/QR.vue'
import store from '@/store/index.js'
export default {
  components:{
		selectAddress,
		QR
	},
  props:{},
  data(){
    return {
			collectorid:'',//替换时传过来的设备ID
			options:[],//区域
			area:'请选择位置',
			form: {
				id:'',
				houseNumber:'',
				address:'',
				name: '',
				village:'',
				number:'',
				provinceId:'',
				cityId:'',
				istrictId:'',
				log:'',
				lat:'',
				
			},
			rules: {
				id: [
					{ required: true, message: '请输入编号', trigger: 'blur' },
					// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
				size: [
					{ required: true, message: '请输入规格', trigger: 'change' }
				],
				area:[
					{required:true,message: '请选择地区'}
				],
				village: [
					{ required: true, message: '请输入小区', trigger: 'change' }
				],
				address: [
					{ required: true, message: '请填写详细地址', trigger: 'change' }
				],
				houseNumber:[
					{ required: true, message: '请输入门牌号', trigger: 'change' }
				]
			}
    }
  },
  computed:{
		qrId:function(){
			console.log(this.$store.state.qrId)
			return this.$store.state.qrId
			}
		},
	watch:{
		qrId(newdata,olddata){
			this.form.id=newdata
		}
	},
  methods:{
		showMore(){
				this.$refs.collectorMore.classList.toggle('ishow')
			},
	  	getfocus(){
				
				this.$refs.select.$children[0].$el.childNodes[1].focus()
		
		},
		getVillage(){
			if(this.form.istrictId!==null){
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
			}
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
						that.form.log=r.point.lng
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
		//数据回显
		showdata(){
			this.$http.get('/weiXin/api/v1/deviceMend/getListReplaceDeviceInstallInfoByType',{
				deviceNum:this.collectorid,
				type:this.$route.query.type,
				})
			.then(res=>{
				let Obj = res.data.data
				if(res){
					this.form={
						id:'',
						village:Obj.districtSite,
						houseNumber:Obj.houseNumber,
						lat:Obj.latitude,
						log:Obj.longitude,
						name:Obj.consumerUname,
						number:Obj.telephone,
						address:Obj.districtDetail,
						provinceId : Obj.provinceId,
						cityId : Obj.cityId,
						istrictId:Obj.districtId,
					}
					
				}
			})
			.then(()=>{ //小区
				this.getVillage()

			})
		},
		slctAddress(){
				this.$refs.slcAdress.show()
			},
		reshowarea(part){
			if(part){
				this.area = part.join('-')
			}
		},
		areaConfirm(part){
				let area =part.map((value,index)=>{
				return value.part
				})
				this.$nextTick(() => {
					this.area = area.join('-')
				})
				let areaid = part.map((val,ind)=>{
					if(val.id>0){
						return val
					}
				})
				this.form.provinceId = areaid[0]&&areaid[0].id
				this.form.cityId = areaid[1]&&areaid[1].id
				this.form.istrictId=areaid[2]&&areaid[2].id
				this.getVillage()
			},
		onSubmit(form) {
		
				this.$refs[form].validate((valid)=>{
					if(valid){
						this.$confirm(this.$route.query.type==3?'是否替换该设备？':'是否进行测试？', '提示', {
							showConfirmButton:this.$route.query.type==3?false:true,
							confirmButtonText: '联网测试',
							cancelButtonText: '替换并安装',
							type: 'warning',
							center: true,
							distinguishCancelAndClose:true,
							closeOnClickModal:true,
							beforeClose: (action, instance, done) => {
								if (action === 'confirm') {              //联网测试
									instance.confirmButtonLoading = true;
									instance.confirmButtonText = '执行中...';

									this.$http.post('/weiXin/api/v1/deviceMend/replaceDevice',{//设备替换
										deviceNumber:this.form.id,
										houseNumber:this.form.houseNumber,
										longitude:this.form.log,
										latitude:this.form.lat,
										districtSite:this.form.village,
										districtDetail:this.form.address,
										provinceId:this.form.provinceId,
										cityId:this.form.cityId,
										districtId:this.form.istrictId,
										consumerUname:this.form.name,
										telephone:this.form.number,
										deviceNum:this.collectorid,
										type:this.$route.query.type,
									})
									.then(res=>{
										if(res){//安装成功
											this.$http.post('/weiXin/api/v1/deviceManager/networkingTest',{
												deviceNums:[this.form.id],deviceType:this.$route.query.type},{
														'Content-Type': 'application/json; charset=UTF-8'
													},true)//联网测试
											.then(res=>{
												if(res){
													setTimeout(() => {
															instance.confirmButtonLoading = false;
															instance.confirmButtonText = '联网测试';
															done()
															this.$message({
																type: 'success',
																message:'替换成功，联网测试已下发'
															});
														},300)
													
												}else{
													instance.confirmButtonLoading = false;
													instance.confirmButtonText = '联网测试';
												}			
											})
										}else{
											instance.confirmButtonLoading = false;
											instance.confirmButtonText = '联网测试';
										}
									})
									 	
								} else if(action === 'cancel'){					//仅替换
										console.log(this.$route.query.type)
										this.$http.post('/weiXin/api/v1/deviceMend/replaceDevice',{//设备替换
										deviceNumber:this.form.id,
										houseNumber:this.form.houseNumber,
										longitude:this.form.log,
										latitude:this.form.lat,
										districtSite:this.form.village,
										districtDetail:this.form.address,
										provinceId:this.form.provinceId,
										cityId:this.form.cityId,
										districtId:this.form.istrictId,
										consumerUname:this.form.name,
										telephone:this.form.number,
										deviceNum:this.collectorid,
										type:this.$route.query.type,
									})
									.then(res=>{
										if(res){
											this.$message({
												type:"success",
												message:'替换成功'
											})
											done()
										}
									})
									.catch(err=>{
										console.log(err)
									})
								}else{				//点击其他区域关闭 action=close
									done()	
								}
							}
						}).then((res) => {
							this.$router.push('/textonline')
						}).catch((action) => {
						});		
					} else {
						console.log('error submit!!');
						return false;
					}
				})
      }
	},
  created(){
		this.getmaparea()
	},
  mounted(){
		if(this.$route.query.collectorId !==null){
				 this.collectorid = this.$route.query.collectorId
				 this.showdata()
			 }
	}
}
</script>
<style  lang="less">
#replace{
	
	.textform{
	padding: 0 20px 0 20px;
	}
	.part{
	margin-top: 20px;
	}
	.location span{
		margin-bottom: 20px;
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
    outline: none;
    padding: 0 15px;
    width: 100%;
	}
	.location i{

		font-size: 20px;
	}
	.selectVillage{
		width: 100%
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