<template>
  <div id="coloterManage">
	  <header>
			<el-row type="flex" justify="space-between"  class="header-title" >
				<el-col :span="4">
					<el-button type="primary" icon="el-icon-arrow-left" @click="$router.push('./nav')" >返回</el-button>
					<!-- <el-button type="primary" v-if="batchProcessing" @click="quitBatch">退出批量操作</el-button> -->
				</el-col>
				<el-col :span="6"><span>{{this.title}}</span></el-col>
				<el-col :span="4" class="addColltector">
					<more ref="moreOperation">
											<ul slot="list">
													<li @click="$router.push({
															path:'/collector',
															query:{'type':2}
														})">添加采集器</li>
													<li @click="hideMenu">菜单栏</li>
											</ul>
									</more>
				</el-col>
			</el-row>
			<div ref="waterMenu" class="water-menu">
				<div class="qrSearch">
					<el-input
						class="idSearch"
						placeholder="编号/小区/门牌号"
						v-model="oneData"
						>
					</el-input>
					<QR/>
				</div>
				
				<el-row class="head-check">
					
					<el-col :span="18">
						<el-checkbox-group v-model="checkList">
							<el-checkbox label="在线">在线：{{onLineSum}}</el-checkbox>
							<el-checkbox label="离线">离线：{{offLineSum}}</el-checkbox>
						</el-checkbox-group>
					</el-col>
					<el-col :span="6"><el-button type="text" class="searchConfirm" @click="searchoneData">查询</el-button></el-col>
					
				</el-row>
				
			</div>
	  </header>
	  <div class="block ">
		<div class="isDown" ref="isDown" v-show="!isDown">刷新数据</div>
		<div v-show="isDown" ref="freshing"><i class="el-icon-loading"></i>刷新中</div>
		<div class="Wrapper" ref="collectorScroll">
			
			<div ref="wrapperContent"> 
				
				<el-table
					class="searchResult"
					size="mini"
					border
					ref="multipleTable"
					@selection-change="collectorSelectionChange"
					:data="tableData | filtTableData(checkList)"
					style="width: 100%">
					<el-table-column
                        :label="tableData | filtTableData(checkList) .length.toString()"
                        width="40"
                    >
                    <template slot-scope="{$index}">
                           {{$index+1}} 
                    </template>
                    </el-table-column>
					<el-table-column
						prop="id"
						label="采集器编号"
						>
					</el-table-column>
					
					<el-table-column
						prop="districtDetail"
						label="详细地址"
						>
					</el-table-column>
					<el-table-column
						prop="districtSite"
						label="小区"
						>
					</el-table-column>
					
					<el-table-column
						prop="houseNumber"
						label="具体位置"
						
						>
					</el-table-column>
					<el-table-column
						
						label="水表数量"
						>
						<template slot-scope="{ row }">
								{{row.waterNum}}
								<span class="waterDetail" @click.stop="collectClick(row)">详情</span>
						</template>
					</el-table-column>
					<el-table-column
						label="轮询测试"
						>
						<template slot-scope="{ row }">
								{{row.test}}
								<span class="waterDetail"  @click.stop="reText(row.id)">测试</span>
						</template>
					</el-table-column>  
					<el-table-column
						label="在线情况"
						>
						<template slot-scope="{ row }">
							<div :class="waterRowClassName(row)">
								{{row.onlineStatus}}
								<span class="waterDetail" @click.stop="$router.push({
									path:'/offlineRecord',
									query:{deviceId:row.id}
								})">离线记录</span>

							</div>
						</template>
					</el-table-column>  
					
					<el-table-column	
						label="操作"
						width="250px"
						>
						<template slot-scope="command">
							<!-- <el-button  type="text" size="small" @click.stop="reText(command.row.id)">轮询测试</el-button> -->
							<el-button  type="text" size="small" v-if="command.row.test=='已测试'" @click.stop="upload(command.row.id)">上报数据</el-button>
							<el-button  type="text" size="small" @click.stop="remove(command.row.id,command.$index,tableData)">移除</el-button>
							<el-button  type="text" size="small" @click.stop="$refs.edition.show(command.row)">详细数据</el-button>
						</template>
					</el-table-column>
				</el-table>
				
			</div>
			
		</div>
		
	  </div>

	  <edit ref="edition" ></edit>
  </div>
</template>

<script>
const PAGESIZE =null  
import invented from '../invented/invented.vue'
import QR from '@/components/QR/QR.vue'
import store from '@/store/index.js'
import more from '@/components/list/watermeterDetail/more.vue'
import BScroll from 'better-scroll'
import edit from './edit.vue'
export default {
  components:{
	  invented,
	  QR,
	  more,
	  edit
  },
  props:{},
  data(){
    return {
		isDown:false,
		// isUp:false,
		// isEnd:false,
		pageNum:null,
		checkList:[],
		collectoWrapper:null,
		SelectionArray:[],//批量操作所选择的设备
		// batchProcessing:false,
		pollingTabs:"first",  
		watermeterdeviceNum:'',  //当前操作的水表编号
		oneData:'',
		tableData: [],
		offLineSum:0,
		onLineSum:0,
    }
  },
  filters:{
	  filtTableData:function(data,check){  //oneData变化的时候也会触发，原因不明
		  if(check.length==1){
			let array=[]
			for(let val of data){
				if(val.onlineStatus==check[0]){
					array.push(val)
				}
			}
			return array
		  }else{
			  return data
		  }

		
	  }
  },
  computed:{
		qrId:function(){
			return this.$store.state.qrId
		},
	},
		
  watch:{
	qrId(newdata){
		this.oneData=newdata
	},
	
  },
  methods:{
	//   isbatchProcessing(){
	// 	  this.batchProcessing=true
	// 	  this.$refs.moreOperation.cancle()
	//   },
	  hideMenu(){
			this.$refs.waterMenu.classList.toggle('isShow')
		},
	  waterRowClassName(row){
            if (row.onlineStatus == '在线') {
                return 'onlineSingle';
            } else if (row.onlineStatus == '离线') {
                return 'offlineSingle';
            }
	  },
	  initScroll(Obj,SCobj){
				if( !Obj ){
					
		// this.$refs.wrapperContent.style.minHeight=`${this.$refs.collectorScroll.offsetHeight+1}px`
				Obj = new BScroll(SCobj,{
					scrollX:true,
								click:true,
								directionLockThreshold:5,
					// pullUpLoad:{
					// threshold: -50,
					// },
					pullDownRefresh:{
					threshold: 55,
					txt:'刷新'
					},
				})
				Obj.on('scroll',(pos)=>{
					if(!this.isDown){
						this.$refs.isDown.style.transform=`translate(0,${pos.y-40}px)`
						
					}else if(this.isDown){
						this.$refs.freshing.style.transform=`translate(0,20px)`
					}else if(this.isUp){

					}

				})
				// Obj.on('pullingUp',()=>{
				// 	this.isUp=true
					
				// 	this.pageNum++
				// 	this.oneData=null
				// 	this.getListDataFromNet(this.pageNum, (arr) => {
				// 		console.log(arr)
				// 		if(arr.length==0) this.isEnd=true
						
				// 		this.tableData.push(...arr)
				// 		this.isUp=false
				// 		Obj.refresh()
				// 		Obj.finishPullUp();
						

				// 	})
				// })
				Obj.on('pullingDown',()=>{
					console.log(Obj)
					this.isDown=true
					// this.pageNum=1
					this.getListDataFromNet(this.pageNum, (arr) => {
						this.tableData=[]
						this.tableData.push(...arr)
						this.isDown=false
						Obj.refresh()
						Obj.finishPullDown();
						if(!arr.length>0){

						}
					})
				})
				}else{
						Obj.refresh() 
				}
		},
	  getListDataFromNet (pageNum,successCallback) {
	  // 延时一秒,模拟联网
	  
      setTimeout(() => {
				if(this.oneData){
					this.searchData(pageNum,this.oneData)
					.then(res=>{
						successCallback(res)
					})
				}else{
					this.searchData(pageNum)
					.then(res=>{
						successCallback(res)
					})
				}
        
      }, 1000)
    },
	  checkOnline(status){
		  if(status==this.checkList[0]){
			  return true
		  }else if(this.checkList.length>1||this.checkList.length==0){
			  return true
		  }
		 
	  },
	  testStyle(row) {
        if (row.row.onlineStatus == "离线") {
          return 'warning-row';
        }else if(row.row.onlineStatus == "在线"){
			return 'success-row';
		} 
	  },
	  //批量操作
	  collectorSelectionChange(val){
		 this.SelectionArray=val
	  },
	  //点击表内元素跳转水表列表
	  collectClick(row, event, column){
		if(!this.batchProcessing){
			console.log(row)
			this.$router.push({
					path:'/watermeterDetail',
					query:{deviceNum:row.id,pid:row.provinceId,cid:row.cityId,did:row.districtId}
				})
		}
		},
	  //重新轮询测试
	  reText(cid){
		this.$confirm('是否进行轮询测试','提示',{
			confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  beforeClose:(action,instance,done)=>{
				  if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = '执行中...';
					setTimeout(()=>{
						this.$http.get('/weiXin/api/v1/deviceManager/pollingTest',{
						deviceNum:cid
						})
						.then(res=>{
							instance.confirmButtonLoading = false;
							if(res){
								done()
								
							}else{
								instance.confirmButtonText = '确定';
							}
						})
						
						},2000)
					} 
					else {
						done();
					}
			  }
		})
		.then(res=>{
			this.$http.get('/weiXin/api/v1/deviceManager/queryAll',{deviceNum:cid})
			.then(res=>{
				if(res){
					this.$message({
					type: 'success',
					message: '测试已提交'
					});
				}
			})
		})
		.catch(err=>{

		})
		  
	  },
	  //上报数据
	  upload(cid){
		  this.$confirm('是否上报轮询测试数据','提示',{
			confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  beforeClose:(action,instance,done)=>{
				  if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = '执行中...';
					setTimeout(()=>{
						this.$http.get('/weiXin/api/v1/deviceManager/queryAll',{deviceNum:cid})
						.then(res=>{
							if(res){
								done()
								instance.confirmButtonLoading = false
								instance.confirmButtonText = '确定';
								this.$message({
								type: 'success',
								message: '数据已上报'
								});
							}else{
								done()
								instance.confirmButtonLoading = false
								instance.confirmButtonText = '确定';
							}
						})
						
						},2000)
					} 
					else {
						done();
					}
			  }
		})
		.then(res=>{
			
		})
		.catch(err=>{

		})
	  },
	  //移除采集器
	  remove(cid,index,table){
		this.$confirm('是否移除该采集器','提示',{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			beforeClose:(action,instance,done)=>{
				if (action === 'confirm') {
					this.$http.get('/weiXin/api/v1/deviceMend/deleteDevice',{
						deviceNum:cid,
						deviceType:2
					})
					.then(res=>{
						if(res){
							table.splice(index, 1);
							done();
						}
					})
					
				} 
				else {
					done();
				}
			}	
		})
			
		
	  },
	  //请求所有数据
	  searchData(num,onedata){
		return new Promise(resolve=>{
			this.$http.post('/weiXin/api/v1/deviceManager/getListDeviceBySearch',{
                "collectorSearchField":this.deviceNum,
                "pageNum": num,
                "pageSize": PAGESIZE,
                "searchField":onedata,
                "type": 2,},{
                  'Content-Type': 'application/json;'
              },true)
			  .then(res=>{
				  if(res){
					  
					  this.onLineSum=res.data.data.onLineSum
					  this.offLineSum=res.data.data.offLineSum
                      let Obj = res.data.data.list.map(val=>{
						  
						  return {
								...val,
							  id:val.deviceNumber,
							  waterNum:val.generalQuantitySum,
							  test:(val.pollingTest==0&&"未测试")||(val.pollingTest==1&&"已测试")||(val.pollingTest==2&&"离线")||(val.pollingTest==3&&"测试中"),
							  onlineStatus:val.onlineStatus==1?'在线':'离线',
							  completeDistrict:val.completeDistrict,
							  houseNumber:val.houseNumber,
								districtSite:val.districtSite,
								deviceType:2,
								signalIntensity:val.signalIntensity,
								baseStation:val.baseStation,
							} 
					  })
						Obj.sort((a,b)=>{
                          return a.id-b.id
                      })

					  
                      resolve(Obj)  
                  }
                  
			  })
			  .catch(err=>{
			  })
		})
	  },
	  //点击查询
	  searchoneData(){
		  if(this.oneData){
              //让分页num=1
			// this.pageNum=1
			this.searchData(this.pageNum,this.oneData)
            .then((res)=>{
				this.tableData=[...res]
				this.$nextTick(()=>{
					this.initScroll(this.collectoWrapper,this.$refs.collectorScroll)
				})
			})
		  }else{
			  //未输入id
		  }
	  },
	  watermeterSwitch($event,num,val){
		  console.log(val)
		  this.watermeterdeviceNum=num
		  this.meterSwitch=true
		  this.radioSwitch=val
		
	  },
	//   quitBatch(){
	// 	  this.batchProcessing=false
    //     	this.$refs.multipleTable.clearSelection()
	//   }
  },
  created(){},
  mounted(){
		if(this.$route.query.id){
          this.oneData=this.$route.query.id
          this.searchoneData()
		}else{
			this.searchData(this.pageNum)
			.then((res)=>{
				this.tableData.push(...res)
				this.$nextTick(()=>{
					this.initScroll(this.collectoWrapper,this.$refs.collectorScroll)
				})
			})

		}
  },
}
</script>
<style  lang="less">
#coloterManage{
	overflow: hidden;
	background: #f8f8f8;
	display: flex;
	flex-direction: column;
	height: 100vh;
	>header{
		background: #747776;
		position: relative;
		line-height: 40px;
		width: 100%;
		margin-bottom: 10px;
		.water-menu{
			overflow: hidden;
			height: 90px;
			transition:height 0.3s ease-in-out;
		}
		.isShow{
			height:0px;
		}
		.qrSearch{
			width:80%;
			position: relative;
			line-height: 40px;
			margin: auto;
		}
		.header-title{
			text-align: center;
			height: 40px;
			span{
				display: inline-block;
				font-size: 16px;
				color: #f8f8f8;
			}
			button{
			padding: 0 15px 0 10px;
			height: 40px;
			}
			.addColltector{
				text-align: right;
				padding-right: 15px;
				li{
                   
                    border-bottom: 1px solid #747776;
                    margin:0 10px; 
                }
                li:last-child{
                    border: 0;
                }
			}
			
		}
		.head-check{
			width: 80%;
			margin:0 auto;
			span{
				color: #ebeef5;
			}
		}
		.idSearch{
				width: 100%;
		}

		.searchConfirm{
			
			width: 100px;
			margin:5px 0 5px 0px;;
		}
		.el-checkbox-group{
			margin-top: 5px;
			margin-bottom: 5px;
		}

	}
	.block{
		flex: 1;
		overflow: hidden;
		text-align: center;
		padding: 0 10px 0 10px;
		// .mescroll{
		// 	height: auto;/*如设置bottom:50px,则需height:auto才能生效*/
		// }
		.collector-item{
			background-color: #fff;
			padding: 5px;
			color: #303133;
			margin-bottom: 10px;
			cursor: pointer;
			border-bottom: 1px solid #ebeef5;
			font-size: 13px;
			font-weight: 500;
			outline: none;
			border-radius: 5px;
			.collector-header{
				display: flex;
				justify-content: space-between;
			}
			.collector-operate{
				text-align: right;
			}
			.collector-detail {
				padding-right: 20px;
				li{
					display: flex;
					justify-content: left;
				}
			}
			button{
				color:#5287f1;
			}
		}
		

	}
	.searchResult{
		text-align: left;
		button{
			color:#5287f1;
		}
		.waterDetail{
			float: right;
			color:#5287f1;
			cursor: pointer;
			
		}
		.onlineSingle{
            // color: #4ac959;
        }
        .offlineSingle{
            color: red;
        }
	}
	.warning-row{
		color: #606266
	}
	.success-row{
		color: #0b770b;
	}
	.el-table__expanded-cell{
		padding: 0;
	}
	.watermeterTable{
		color: #606266;
		button{
			color:#5287f1;
		}
	}
	.el-tabs{
		margin-bottom: 40px;
	}
	.Wrapper{
		height: 90%;
		>div{
			min-height: calc(100% + 1px);
            width: 1360px;
		}
	}
	.isDown{
		transform:translate(0,-40px)
	}
}
</style>