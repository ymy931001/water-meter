<template>
  <div id="textonline">
		<div class="block">
			<div class="qr">
				<el-input
				class="idSearch"
				placeholder="输入或扫描设备编号"
				v-model="equipId"
				clearable>
				</el-input>
				<QR/>
			</div>

			<el-row>
			<el-button type="primary" class="searchConfirm" @click="searchEquipByid">查询</el-button>
			</el-row>

			<el-tabs :class="{onfix}" v-model="activeName" @tab-click="handleClick">
				<el-tab-pane  label="采集器" name="2">
					<div class="cloWra" ref="collectorWrapper">
						<el-table
							class="searchResult"
							size="mini"
							border
							stripe
							v-loading="loadingClo"
							header-row-class-name="equipHead"
							:row-class-name="equipTabel"
							:data="collectorData"
							style="width: 100%">
							<el-table-column
								fixed
								prop="id"
								label="设备编号"
								width="120">
							</el-table-column>
							<el-table-column
								:filters="filters"
								:filter-method="filterType"
								prop="result"
								label="测试结果">
							</el-table-column>
							<el-table-column	
							label="操作">
								<template slot-scope="command">
									<el-button  type="text" size="small" @click.stop="onlineTest(command.row.id)">联网测试</el-button>
									<el-button  type="text" size="small" @click.stop="pollingTest(command.row.id)">轮询测试</el-button>
									<el-button  type="text" size="small" @click.stop="onlineTestResult(command.row.id)">联网测试结果</el-button>
								</template>
							</el-table-column	>
						</el-table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="无线单表" name="1">
					<div class="cloWra" ref="singleWrapper">
						<el-table
							class="searchResult"
							size="mini"
							border
							stripe
							header-row-class-name="equipHead"
							:row-class-name="equipTabel"
							:data="singleData"
							style="width: 100%">
							<el-table-column
								fixed
								prop="id"
								label="设备编号"
								width="120">
							</el-table-column>
							<el-table-column
								:filters="filters2"
								:filter-method="filterType2"
								prop="result"
								label="测试结果">
							</el-table-column>
							<el-table-column	
							label="操作">
								<template slot-scope="command">
									<el-button  type="text" size="small" @click.stop="onlineTest(command.row.id)">联网测试</el-button>
									<el-button  type="text" size="small" @click.stop="onlineTestResult(command.row.id)">联网测试结果</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
			</el-tabs>

	  </div>

	  <el-dialog
		title="提示"
		:visible.sync="dialogVisible"
		width="30%">
		<div id="parameterDetail">
			<el-table
				class="searchResult"
				v-loading="loading"
				size="mini"
				border
				stripe
				header-row-class-name="equipHead"
				row-class-name="equipTabel"
				:data="oneDate"
				style="width: 100%">
				<el-table-column
					prop="props"
					label="参数"
					width="100">
				</el-table-column>
				<el-table-column
					prop="num"
					label="数值">
				</el-table-column>
			</el-table>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button  type="primary" @click="confirm"> <i v-if="netloading"  class="el-icon-loading"></i> 重新测试</el-button>
		</span>
	</el-dialog> 

  </div>
</template>

<script>
import { Loading } from 'element-ui';
import BScroll from 'better-scroll'
import QR from '@/components/QR/QR.vue'
import { setInterval, clearInterval } from 'timers';
import store from '@/store/index.js'
export default {
  components:{
	  QR
  },
  props:{},
  data(){
    return {
		collectorScroll:null,
        singleScroll:null,
		equipId:this.$store.state.qrId,					//设备编号搜索
		activeName: '2',		//选项卡显示页				
		onfix:false,				//scroll显示
		collectorData: [],			//采集器数据
		singleData:[],				//无线单表数据
		oneDate:[],					//某一台设备数据
		tabObj:1,					//选项卡显示的设备类型
		dialogVisible:false,		//弹窗显示
		loading:false,				//弹窗数据加载
		netloading:false,			//重新测试加载
		filters:[{text: '通过', value: '通过'},{text: '未通过', value: '未通过'},{text: '未测试', value: '未测试'}],
		filters2:[{text: '通过', value: '通过'},{text: '未通过', value: '未通过'},{text: '未测试', value: '未测试'}],
		loadingClo:false,
		colloectrPage:1,
		singlemeterPage:1
    }
  },
  computed:{
		qrId:function(){
		return this.$store.state.qrId
			}
		},
	watch:{
		qrId(newdata){
			this.equipId=newdata
		}
	},
  methods:{
		equipTabel({row, rowIndex}) {
			if (row.result !== "通过") {
				return 'warning-row';
			}
		  },
		filterType(value,row,column){
			
            return row.result === value;
		},
		filterType2(value,row,column){
			
            return row.result === value;
		},
		initScroll(Obj,SCobj){
          if( !Obj ){
			Obj = new BScroll(SCobj,{
				scrollX:false,
				eventPassthrough:"horizontal",
				pullUpLoad:{
					threshold: -50,
				},
				pullDownRefresh:{
					threshold: -50,
				}
				})
				Obj.on('pullingUp',()=>{				
					if(this.activeName==2){
						this.colloectrPage++
						this.searchDate(this.activeName,this.colloectrPage)
						.then(()=>{
							Obj.finishPullUp();
							Obj.refresh()  
						})
					}else if(this.activeName==1){
						this.singlemeterPage++
						this.searchDate(this.activeName,this.singlemeterPage) //
						.then(()=>{   
							Obj.finishPullUp();
							Obj.refresh()  
						})
					}
				})
				Obj.on('pullingDown',()=>{				
					if(this.activeName==2){
						this.colloectrPage=1
						this.collectorData=[]
						this.searchDate(this.activeName,1)
						.then(()=>{
							Obj.finishPullDown();
							Obj.refresh()  
						})
					}else if(this.activeName==1){
						this.singleData=[]
						this.singlemeterPage=1
						this.searchDate(this.activeName,1) //
						.then(()=>{   
							Obj.finishPullDown();
							Obj.refresh()  
						})
					}
				})
			}else{
				Obj.refresh()    
			}
		},

		searchEquipByid(){
			if(this.equipId){
				this.dialogVisible=true
				this.loading=true
				this.$http.get('/weiXin/api/v1/deviceManager/getDeviceByDeviceNum',{deviceNumber:this.equipId})
				.then(res=>{
					let Obj = res.data.data[0]
					let map =[]
					map.push(
					{
						props:"设备类别",
						num:(Obj.deviceType==1&&"无线单表")||(Obj.deviceType==2&&"采集器")||(Obj.deviceType==3&&"水表")
					},
					{
						props:"设备ID",
						num:Obj.deviceNumber
					},
					{
						props:"设备地址",
						num:Obj.completeDistrict
					},
					{
						props:"测试结果",
						num:(Obj.networkingTest==0&&"未测试")||(Obj.networkingTest==1&&"通过")||(Obj.networkingTest==2&&"未通过")
					})
					this.oneDate = map 
					this.loading =false
				})
				.catch(err=> {
					this.loading =false
				});
			}
		},
		handleClick(tab, event) {
		this.tabObj=(tab._props.label=="采集器"&&1)||(tab._props.label=="无线单表"&&2)
		},
		onlineTest(eid){
			this.$confirm('是否进行联网测试','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose:(action,instance,done)=>{
					if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '执行中...';
						this.$http.post('/weiXin/api/v1/deviceManager/networkingTest',{deviceNums:[eid],deviceType:this.activeName},{
								'Content-Type': 'application/json; charset=UTF-8'
							},true)		//联网测试
							.then(res=>{
								if(res&&res.data.code==0){
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = '确定';
									done()								
									this.$message({
										type: 'success',
										message: eid+res.data.message
									});
								}else{
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = '确定';
								}
							})
						}else {
							done();
						}
				}
			})
			.then(res=>{
			})
			.catch(err=>{
			})
		},
		pollingTest(eid){
			this.$confirm('是否进行轮询测试','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose:(action,instance,done)=>{
					if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '执行中...';
						this.$http.get('/weiXin/api/v1/deviceManager/pollingTest',{deviceNum:eid})
							.then(res=>{
								if(res&&res.data.code==0){
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = '确定';
									this.$message({
										type: 'success',
										message:'已提交测试请求'
									});
									done()
								}else{
									instance.confirmButtonLoading = false;
									instance.confirmButtonText = '确定';
								}
							})
						}else {
							done();
						}
				}
			})
			.then(res=>{
			})
			.catch(err=>{
			})
		},  
		onlineTestResult(collectorId){
			// this.$store.commit('changetestId',collectorId)
			this.$router.push({
				path:'/testonlineResult',
				query:{testId:collectorId}
			})
		},
		//获取数据
		searchDate(typeNum,pageInd){
			return new Promise(resolve=>{
				this.loadingClo=true
				this.$http.post('/weiXin/api/v1/deviceManager/getListDeviceBySearch',{
					type:typeNum,
					pageSize:10,	//每页加载数量
					pageNum:pageInd  //页码
					},{
					'Content-Type': 'application/json;charset=UTF-8'
				},true)
				.then(res=>{
					this.loadingClo=false
					if(res){
						if(res.data.data.list.length>0){
							let tableData=res.data.data.list.map((val,ind)=>{
								return {
									id:val.deviceNumber,
									address:val.completeDistrict,
									result:(val.networkingTest==0&&"未测试")||(val.networkingTest==1&&"通过")||(val.networkingTest==2&&"未通过")||(val.networkingTest==3&&"测试中")
								}
							})
							if(typeNum==2){
								this.collectorData=this.collectorData.concat(tableData)
							}else if(typeNum==1){
								this.singleData=this.singleData.concat(tableData)
							}
							
							resolve();
						}
						
					}
				})
				.catch(err=>{
					this.loadingClo=false
				})
			})
		},
		confirm(){
			console.log(this.oneDate)
			this.netloading=true
			this.$http.post('/weiXin/api/v1/deviceManager/networkingTest',{deviceNums:[this.oneDate[1].num],deviceType:(this.oneDate[0].num=='采集器'&&2)||(this.oneDate[0].num=='无线单表'&&1)},{
			'Content-Type': 'application/json; charset=UTF-8'
			},true)		//联网测试
			.then(res=>{
				if(res){
					this.netloading=false								
					this.$message({
						type: 'success',
						message: this.oneDate[1].num+'联网测试已下发'
					});
				}else{
					this.netloading=false
				}
					
			})
			
			
		},


  },
  created(){},
  mounted(){
	  
	  this.searchDate(2,1)
	  .then(()=>this.searchDate(1,1)
	  )
	  .then(()=>this.loadingClo=false
	  )
	  this.$nextTick(()=>{
			this.initScroll(this.collectorScroll,this.$refs.collectorWrapper);
			this.initScroll(this.singleScroll,this.$refs.singleWrapper);

        });
	  
  },
  destroyed() {
     window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>
<style  lang="less">
#textonline{
	
	.block{
		text-align: center;
		.idSearch{
				width: 320px;
		}
		.qr{
			position: relative;
			width: 320px;
			margin: auto;
			line-height: 40px;
		}
		.searchConfirm{
				width: 320px;
				margin-top: 20px;
				margin-bottom: 20px;
			}
		.onfix{
			.el-tabs__header{
				width: 100%;
				position: fixed;
				z-index: 1000;
				top: 40px;
				background: #fff;
			}
			.searchResult{
				margin-top: 40px;
			}
			
		}
	// .el-tabs__content{
	// 	margin-bottom: 50px;
	// }
	.warning-row{
			color: red
		}
	}
	 .cloWra{
		height: 55vh;
		overflow: hidden;
		button{
			margin: 0;
			color: #5287f1;
		}
	}
}
</style>