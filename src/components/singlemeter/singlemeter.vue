<template>
  <div id="singlemeter">
      <header>
		<el-row type="flex" justify="space-between"  class="header-title" >
			<el-col :span="4">
				<el-button type="primary" icon="el-icon-arrow-left" @click="$router.push('./nav')" v-if="!batchProcessing" >返回</el-button>
				<el-button type="primary" v-if="batchProcessing" @click="quitBatch">退出批量操作</el-button>
			</el-col>
			<el-col :span="6"><span>{{this.title}}</span></el-col>
			<el-col :span="4" class="addColltector">
				<more ref="moreOperation">
                    <ul slot="list">
                        <li @click="$router.push({
							path:'/collector',
							query:{'type':1}
						})">添加无线单表</li>
                        <li @click="isbatchProcessing">批量操作</li>
                        <li @click="hideMenu">菜单栏</li>
                    </ul>
                </more>
			</el-col>

		</el-row>
        <div class="water-menu" ref="waterMenu">
            <el-row class="idSearch">
                <el-col :span="18" class="searchInput">
                    <el-input
                        placeholder="编号/小区/门牌号"
                        v-model="oneData"
                        >
                    </el-input>
                    <QR/>
                </el-col>
                <el-col :span="4" :offset="1" class="searchConfirm"><el-button type="primary" @click="searchoneData" >查询</el-button></el-col>
            </el-row>
            

        </div>
        <el-row  type="flex" justify="end" v-if="batchProcessing" class="batchOperate">
                <el-col :span="8"><el-button type="text"  @click="meterSwitch=true">批量开关阀</el-button></el-col>
        </el-row>
	  </header>
      <el-row >
            <el-col>
                <!-- 筛选 -->
                <more ref="filt" :custom="true">
                    <el-row slot="operate" type="flex" justify="end">
                        <el-col  :span="6" >
                            <el-button type="text" @click="singleFilter">筛选</el-button>
                        </el-col>
                    </el-row>
                    <div slot="menu"  >
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p >阀门</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="valve" value="valve">
                                    <label for="valve">开
                                    </label>
                                </el-col>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="unvalve" value="unvalve">
                                    <label for="unvalve">关
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p>联网状态</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="online" value="online">
                                    <label for="online">在线
                                    </label>
                                </el-col>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="offline" value="offline">
                                    <label for="offline">离线
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </more>
            </el-col>
        </el-row>
       <div class="block">
            <div class="isDown" ref="isDown" v-show="!isDown">刷新数据</div>
            <div v-show="isDown" ref="freshing"><i class="el-icon-loading"></i>刷新中</div>
            <div class="Wrapper" ref="singlemeterScroll">   
                <div ref="wrapperContent">                    
                    <el-table
                        class="searchResult"
                        size="mini"
                        @select-all="selectAll"
                        border
                        ref="multipleTable"
                        @selection-change="singlemeterSelectionChange"
                        @row-click="singlemeterClick"
                        :data="filtTableData(tableData,dataFilt)"
                        
                        style="width: 100%">
                        <el-table-column v-if="batchProcessing" type='selection'> 
                        
                        </el-table-column>
                        <el-table-column
                            :label="filterData.length.toString()"
                            width="40"
                        >
                        <template slot-scope="{$index}">
                            {{$index+1}} 
                        </template>
                        </el-table-column>
                        <el-table-column
                            prop="deviceNumber"
                            label="无线单表编号"
                            width="170">
                            <template slot-scope="{row}">
                                {{row.deviceNumber}}
                                <span class="singleDetail"  @click="$router.push({
                                    path:'./replace',
                                    query:{collectorId:row.deviceNumber,type:1}
                                })">替换</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="阀门状态"
                            width="110">
                            <template slot-scope="{ row }">
                                {{row.valve}}
                                <span class="singleDetail"  @click.stop="watermeterSwitch($event,row.deviceNumber,row.valve)">开关</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="在线情况"
                            width="150">
                            <template slot-scope="{ row }">
                                <div :class="singleRowClassName(row)">
                                    {{row.onlineStatus}}
                                    <span class="singleDetail" @click.stop="$router.push({
                                        path:'/offlineRecord',
                                        query:{deviceId:row.deviceNumber}
                                    })">离线记录</span>

                                </div>
						    </template>
                        </el-table-column>  
                        <el-table-column
                            prop="readingLatest"
                            label="最近读数"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="reportedDatetime"
                            label="读数时间"
                            width="110">
                        </el-table-column>
                        <el-table-column
                            prop="reportingInterval"
                            label="上报间隔(日)"
                            width="135">
                            <template slot-scope="{row}">
                                {{row.reportingInterval&&row.reportingInterval/(3600*24)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="districtSite"
                            label="小区位置"
                            width="150"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="houseNumber"
                            label="门牌号"
                            width="90"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="districtDetail"
                            label="详细地址"
                            width="170">
                        </el-table-column>
                        
                        <el-table-column
                            prop="test"
                            label="联网测试"
                            width="110">
                        </el-table-column>  
                        
                        <el-table-column	
                            label="操作"
                            >
                            <template slot-scope="command">
                                <!-- <el-button  type="text" size="small" @click.stop="watermeterSwitch($event,command.row.deviceNumber,command.row.valve)">开关</el-button>  -->
                                <el-button  type="text" size="small" @click.stop="remove(command.row.deviceNumber,command.$index,tableData)">删除</el-button>
                                <el-button  type="text" size="small" @click.stop="$refs.edition.show(command.row)">详细数据</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    
            
                    <div  ref="isUp" v-if="!isUp">{{refreshTxt}}</div>
                    <div v-else ref="download"><i class="el-icon-loading"></i>加载中</div>
                </div>
                
            </div>
			
	  </div>

        <!-- 编辑 -->
        <DetailEdit ref="edit" :title="'编辑'" >
            <el-button type="primary" slot="operation" @click="saveEdit" >保存</el-button>  
            <el-form  :model="singlemeterData" label-width="80px" class="watermeterEdit" slot="content">
                <el-form-item label="门牌号" >
                    <el-input v-model="singlemeterData.houseNumber" autocomplete="off"></el-input>
                </el-form-item>
                
                <div style="clear:both"></div>
                <el-row>
                    <p class="editTitle" >查询历史数据</p >
                </el-row>
                <!-- 显示历史数据 -->
                <historyData ref="historyData" :deviceNum="singlemeterdeviceNum" />
                
            </el-form>
        </DetailEdit>

       <!-- 开关阀 -->
       <el-dialog
        title="开关阀"
        :visible.sync="meterSwitch"
        width="30%">
		<el-radio v-model="radioSwitch" :label="1">开</el-radio>
		<el-radio v-model="radioSwitch" :label="0">关</el-radio>
        <span slot="footer" class="dialog-footer">
            <el-button @click="meterSwitch = false">取 消</el-button>
            <el-button  type="primary" @click="SelectionArray.length>0?switchConfirm(SelectionArray):switchConfirm([singlemeterdeviceNum])"> <i v-if="switchLoad"  class="el-icon-loading"></i> 确认</el-button>
        </span>
       </el-dialog>

       <edit ref="edition" ></edit>
  </div>
</template>

<script>
const PAGESIZE =10
import more from '@/components/list/watermeterDetail/more.vue'
import QR from '@/components/QR/QR.vue'
import BScroll from 'better-scroll'
import DetailEdit from '@/components/list/watermeterDetail/DetailEdit.vue'
import historyData from '@/components/list/watermeterDetail/historyData.vue'
import store from '@/store/index.js'
import edit from '@/components/list/coloterManage/edit.vue'
export default {
  components:{
      more,
      QR,
      DetailEdit,
      historyData,
      edit
  },
  props:{},
  filters:{
    
  },
  data(){
    return {
        isDown:false,
        isUp:false,
        isEnd:false,
		pageNum:1,
		singlemeterWrapper:null,
        tableData: [],
        tableDataNav:[],
        dataFilt:[],
        batchProcessing:false,
        oneData:null,
        singlemeterdeviceNum:null, //当前点击的单表编号
		meterSwitch:false,
        radioSwitch:0, 
        switchLoad:false,
        SelectionArray:[],//批量操作所选择的设备
        singlemeterData:{
            houseNumber:null
        },  

        
    }
  },
  watch:{
        qrId(newdata,olddata){
            this.oneData=newdata
        },
        filterData(newData,oldData){
            let page = this.pageNum
            if(this.dataFilt.length>0){
                let Fill=()=>{
                    this.pageNum++
                    this.tableData.push(...this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE))
                    if(newData.length!==this.currentData.length){
                        Fill()
                    }else{
                        return
                    }
                }
                Fill()
            }
        },
        SelectionArray(data){
            console.log(data)
        }
  },
  computed:{
        refreshTxt:function(){
            return this.isEnd?'--无更多数据--':'--上拉加载更多--'
        },
        qrId:function(){
            return this.$store.state.qrId
        },
        filterData:function(){
            return this.filtTableData(this.tableDataNav,this.dataFilt)
        },
        currentData(){
            return this.filtTableData(this.tableData,this.dataFilt)
        } 
  },
  methods:{
        selectAll(){
          this.SelectionArray=this.tableDataNav.map(val=>{
                return val.deviceNumber
            })
         
      },
        hideMenu(){
			this.$refs.waterMenu.classList.toggle('isShow')
		},
        singleRowClassName(row){
            if (row.onlineStatus == '在线') {
                return 'onlineSingle';
            } else if (row.onlineStatus == '离线') {
                return 'offlineSingle';
            }
        },
        singleFilter(){
            this.$refs.filt.open()
        },
        singlemeterSelectionChange(val){
            let list=[]
            for(let i of val){
                list.push(i.deviceNumber)
            }
            this.SelectionArray=list
        },
        filtTableData:(data,dataFilt)=>{  
            let array=data
            const actions = new Map([
                ['valve',(o)=>o.valve=='开'],
                ['unvalve',(o)=>o.valve=='关'],
                ['online',(o)=>o.onlineStatus=='在线'],
                ['offline',(o)=>o.onlineStatus=='离线']
            ])
            const filtWay=()=>{
                let filt=[]
                for(let key of dataFilt){  
                    actions.forEach((fun,param)=>{
                        if(key==param){
                            filt.push(fun)
                        }  
                    })
                }
                
                array=data.filter((item)=>{
                    let result=0 
                    filt.forEach(act=>{
                    if(act(item)){
                        result++
                    }
                    })
                    if(result==filt.length){
                        return true
                    }else{
                        return false
                    }
                    
                })
                
            }
            if(dataFilt.length>0){
                
                filtWay()    
                
                return array
            }else{
                return data
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
        initScroll(Obj,SCobj){
            if( !Obj ){
				// this.$refs.wrapperContent.style.minHeight=`${this.$refs.singlemeterScroll.offsetHeight+1}px`
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
                        if(pos.y>20){
                            this.$refs.isDown.style.visibility='visible'
                        }else{
                            this.$refs.isDown.style.visibility='hidden'
                        }
						this.$refs.isDown.style.transform=`translate(0,${pos.y-40}px)`
						
					}else if(this.isDown){
						this.$refs.freshing.style.transform=`translate(0,20px)`
					}else if(this.isUp){

					}

				})
				Obj.on('pullingUp',()=>{
					this.isUp=true
                    this.pageNum++
					if(this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE).length>0){
                        // this.$refs.multipleTable.toggleAllSelection()
                        if(this.tableDataNav.length==this.SelectionArray.length){
                            this.$refs.multipleTable.toggleAllSelection(true) 
                        }
                        this.tableData.push(...this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE))
                        this.$nextTick(()=>{
                            Obj.refresh()
                           Obj.finishPullUp();
                            
                        })
                    }
				})
				Obj.on('pullingDown',()=>{
					this.isDown=true
                    this.pageNum=1
                    this.oneData=null
					this.getListDataFromNet(this.pageNum, (arr) => {
						this.tableData=[]
						this.tableData.push(...arr)
						this.isDown=false
						this.$nextTick(()=>{
                            Obj.refresh()
                           Obj.finishPullDown();
                            
                        })
						if(!arr.length>0){

						}
					})
				})
            }else{
                Obj.refresh() 
            }
        },
        //请求所有数据
	  searchData(num,onedata){
		return new Promise(resolve=>{
			this.$http.post('/weiXin/api/v1/deviceManager/getListDeviceBySearch',{
                "collectorSearchField":this.deviceNum,
                "pageNum": num,
                "pageSize": null,
                "searchField":onedata,
                "type": 1,},{
                  'Content-Type': 'application/json;'
              },true)
			  .then(res=>{
				  if(res){
                      let Obj = res.data.data.list.map(val=>{
						  return {
							  deviceNumber:val.deviceNumber,
							  test:(val.networkingTest==0&&"未测试")||(val.networkingTest==1&&"已测试")||(val.networkingTest==2&&"离线")||(val.networkingTest==3&&"测试中"),
                              onlineStatus:val.onlineStatus==1?'在线':'离线',
                              readingLatest:val.readingLatest,
                              reportedDatetime:val.reportedDatetime,
                              districtDetail:val.districtDetail,
                              valve:val.valve==0?'开':'关',
                              districtSite:val.districtSite,
                              houseNumber:val.houseNumber,
                              deviceType:1
							} 
					  })
                        Obj.sort((a,b)=>{
                          return a.deviceNumber-b.deviceNumber
                        })

					  
                      resolve(Obj)  
                  }
                  
			  })
			  .catch(err=>{
			  })
		})
      },
      //退出批量操作
       quitBatch(){
		  this.batchProcessing=false
        	this.$refs.multipleTable.clearSelection()
      },

      //批量操作
      isbatchProcessing(){
		  this.batchProcessing=true
		  this.$refs.moreOperation.cancle()
      },
      watermeterSwitch($event,num,val){
		  this.singlemeterdeviceNum=num
		  this.meterSwitch=true
		  this.radioSwitch=(val=='开'&&'1')||(val=='关'&&'0')
		
      },
    //   开关阀
      switchConfirm(wid){
        this.switchLoad=true
        let t = 1
        this.$http.post('/weiXin/api/v1/deviceManager/bashValveSwitch',{
            deviceNums:wid,
            value:this.radioSwitch,
            deviceType:1    //代表水表
        },{
            'Content-Type': 'application/json;'
        },true)
        .then(res=>{
            
            if(res){
                setTimeout(()=>{
                this.switchLoad=false
                },300)
                this.meterSwitch=false
                
                this.$message({
                    type:"success",
                    message:"命令下发成功"
                })
            }
            else{
                setTimeout(()=>{
                this.switchLoad=false
                },300)
                this.meterSwitch=false
                
            }
            
        })

    },

    //移除无线单表
	  remove(cid,index,table){
          console.log(cid,index,table)
		this.$confirm('是否移除该无线单表','提示',{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			beforeClose:(action,instance,done)=>{
				if (action === 'confirm') {
					this.$http.get('/weiXin/api/v1/deviceMend/deleteDevice',{
						deviceNum:cid,
                        deviceType:1
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
      
      searchoneData(){
        if(this.oneData){
            //让分页num=1
            // this.pageNum=1
            this.searchData(this.pageNum,this.oneData)
            .then((res)=>{
            this.tableData=[...res]
            this.$nextTick(()=>{
                this.initScroll(this.singlemeterWrapper,this.$refs.singlemeterScroll)
            })
        })
        }else{
            //未输入id
        }
      },
      singlemeterClick(row, event, column){
          
          if(!this.batchProcessing){
              //判断是否点击的是同一个水表,不是同一个水表才清空历史记录的搜索时间
            if(this.singlemeterdeviceNum!=row.deviceNumber){
                this.$store.commit('changehistorytimeChoice',null)  
                this.$refs.historyData.$data.tableData=[]
                this.$refs.historyData.$data.timechoice=''
            }
            this.singlemeterdeviceNum=row.deviceNumber
            this.singlemeterRow=row
            this.singlemeterData={...row}
            this.$refs.edit.$el.style.display="block"
		}
      },
      //保存编辑
      saveEdit(){
          this.$http.post('/weiXin/api/v1/deviceManager/deviceEdit',{
              deviceNumber:this.singlemeterdeviceNum,
              houseNumber:this.singlemeterData.houseNumber,
              deviceType:1//单表
          })
          .then(res=>{
              if(res){
                  this.$refs.edit.cancle()
              }
          })
      },
  },
  created(){},
  mounted(){
      if(this.$route.query.id){
          this.oneData=this.$route.query.id
          this.searchoneData()
      }else{
        this.searchData(this.pageNum)
        .then((res)=>{
            this.tableDataNav=res
            this.tableData.push(...this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE))
            this.$nextTick(()=>{
                this.initScroll(this.singlemeterWrapper,this.$refs.singlemeterScroll)
            })
        })

      }
  }
}
</script>
<style  lang="less">
#singlemeter{
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
        .water-menu{
            overflow: hidden;
            height: 45px;
            transition: height 0.3s ease-in-out;
		}
		.isShow{
            height: 0px;
            
		}
		.header-title{
			text-align: center;
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
        .batchOperate{
            text-align: center;
                span{
                display: inline-block;
                font-size: 16px;
                color: #fff;
            }
        }
        .idSearch{
            width: 80%;
            margin:0 auto;
                .searchInput{
                     position: relative;
                }
		}
		.searchConfirm{
			margin-bottom: 5px;
            button{
                border: 0;
                background: #5287f1;
            }
		}

    }
     .filtType{
            padding: 10px;
            color:#797575;
            border-bottom: 1px solid #cfcece;
            text-align: center;
            input[type="checkbox"]{
                display: none;
            }
            
            .filtItme{
                label{
                    display: inline-block;
                    line-height: 1;
                    white-space: nowrap;
                    cursor: pointer;
                    background: #fff;
                    border: 1px solid #dcdfe6;
                    border-color: #dcdfe6;
                    color: #606266;
                    text-align: center;
                    box-sizing: border-box;
                    outline: none;
                    margin: 0;
                    transition: .1s;
                    font-weight: 500;
                    padding: 12px 20px;
                    font-size: 18px;
                    border-radius: 4px;
                    
                }
                input[type="checkbox"]:checked +label{
                background: #26a7fd;
                color: #fff
                }
                
            }
        }
       .filtTitle{
           font-size: 15px;
           
           padding: 5px;
           p{
               text-align: left;
               
           }
          
    }
    .searchResult{
		text-align: left;
		button{
			color:#5287f1;
        }
        .singleDetail{
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
    .watermeterEdit{
       padding: 20px 10px 0 10px;
       .editTitle{
         
           font-size: 15px;
            padding: 5px;
       }
       .el-form-item{
           margin-bottom: 10px;
       }
       .replaceMeter{
           float: right;
       }
    }
    >.block{
        flex: 1;
        overflow: hidden;
		text-align: center;
        padding: 0 10px 0 10px;	
       >.Wrapper{
           height: 90%;
           >div{
               min-height: calc(100% + 1px);
                width: 1550px;
           }
       }
       
       
    }
	.isDown{
        visibility: hidden;
		transform:translate(0,-40px)
	}

}
</style>