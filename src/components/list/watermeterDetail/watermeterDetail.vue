<template>
  <div id="watermeterDetail"
    v-loading="sseConnect"
    element-loading-text="命令执行中，请勿退出"
    element-loading-background="#cfcece85"
  
  >
      <header>
        <el-row type="flex" justify="space-between"  class="header-title" >
			<el-col :span="4">
                <el-button type="primary" icon="el-icon-arrow-left"  @click="$router.go(-1)" v-if="!batchProcessing">返回</el-button>
                <el-button type="primary" v-if="batchProcessing" @click="quitBatch">退出批量操作</el-button>
            </el-col>
			<el-col :span="6"><span>水表</span></el-col>
			<el-col :span="4" class="addColltector">
                <more ref="moreOperation">
                    <ul slot="list">
                        <li @click="$router.push({
                            path:'/watermeter',
                            query:{collectorID:deviceNum}
                        })">挂接水表</li>
                        <li @click="isbatchProcessing">批量操作</li>
                        <li @click="hideMenu">菜单栏</li>
                    </ul>
                </more>
            </el-col>
		</el-row>
        <div class="water-menu" ref="waterMenu">
            <el-row type="flex" justify="space-between" class="collectorReplace">
                <el-col :span="14">采集器编号：{{this.deviceNum}}</el-col>
                <!-- <el-col :span="4">详情<i class="el-icon-arrow-down"></i>
                </el-col> -->
                <el-button type="text" size="mini" :span="4" @click.native="$router.push({
                    path:'./replace',
                    query:{collectorId:deviceNum,type:2}
                })">替换<i class="el-icon-arrow-right"></i>
                </el-button>
            </el-row>
            <el-row type="flex" justify="space-between" class="collectorPassageway">
                <div>
                    <p>通道一</p>
                    <p :style="{color:collectorData.c1===false?'red':''}">{{collectorData.c1===false?'异常':'正常'}}</p>
                </div>
                <div>
                    <p>通道二</p>
                    <p :style="{color:collectorData.c2===false?'red':''}">{{collectorData.c2===false?'异常':'正常'}}</p>
                </div>
                <div>
                    <p>通道三</p>
                    <p :style="{color:collectorData.c3===false?'red':''}">{{collectorData.c3===false?'异常':'正常'}}</p>
                </div>
                <div>
                    <p>通道四</p>
                    <p :style="{color:collectorData.c4===false?'red':''}">{{collectorData.c4===false?'异常':'正常'}}</p>
                </div>
                <!-- <el-button type="text" size="mini">详情<i class="el-icon-arrow-right"></i></el-button> -->
            </el-row>
            <el-row  class="idSearch">
                <el-col  :span="18" class="searchInput">
                    <el-input
                        placeholder="编号/门牌号"
                        v-model="oneData"
                        >
                    </el-input>
                    <QR/>
                </el-col>
                <el-col :span="4" :offset="1" class="searchConfirm"><el-button type="primary"  @click="searchoneData">查询</el-button></el-col>
            </el-row>
            
        </div>
        <el-row  type="flex" justify="end" v-if="batchProcessing" class="batchOperate">
            <el-col :span="8"><el-button type="text"  @click="batchConnect">批量挂接</el-button></el-col>
            <el-col :span="8"><el-button type="text"  @click="batchRemove">批量移除</el-button></el-col>
            <el-col :span="8"><el-button type="text"  @click="watermeterSwitch">批量开关阀</el-button></el-col>
        </el-row>
        <!-- 详情 -->
        <!-- <div class="animated flipInX collectorDetail" >hello</div> -->
	  </header>
        <el-row >
            <el-col>
                <!-- 筛选 -->
                <more ref="filt" :custom="true">
                    <el-row slot="operate" type="flex" justify="end">
                        <el-col  :span="6" >
                            <el-button type="text" @click="watermeterFilter">筛选</el-button>
                        </el-col>
                    </el-row>
                    <div slot="menu"  >
                        <div class="filtType">
                            
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                   <p >状态</p> 
                                </el-col>
                            </el-row>
                            <el-row>
                                
                                
                                <el-col :span="12" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="status" value="status">
                                    <label for="status">正常
                                    </label>
                                </el-col>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="unstatus" value="unstatus">
                                    <label for="unstatus">异常
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p >阀门</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="valve" value="valve">
                                    <label for="valve">开
                                    </label>
                                </el-col>
                                <el-col :span="8" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="half" value="half">
                                    <label for="half">半悬
                                    </label>
                                </el-col>
                                <el-col :span="8" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="unvalve" value="unvalve">
                                    <label for="unvalve">关
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p>挂接</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="join" value="join">
                                    <label for="join">已挂接
                                    </label>
                                </el-col>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="unjoin" value="unjoin">
                                    <label for="unjoin">未挂接
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p>安装状态</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="setup" value="setup">
                                    <label for="setup">已安装
                                    </label>
                                </el-col>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="unsetup" value="unsetup">
                                    <label for="unsetup">未安装
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p>轮询结果</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="polling" value="polling">
                                    <label for="polling">通过
                                    </label>
                                </el-col>
                                <el-col :span="12" class="filtItme">
                                    
                                        <input type="checkbox" v-model="dataFilt" id="unpolling" value="unpolling">
                                    <label for="unpolling">未通过
                                    </label>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filtType">
                            <el-row>
                                <el-col :span="12" class="filtTitle">
                                    <p>通道</p>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="check1" value="pass1">
                                    <label for="check1">1
                                    </label>
                                </el-col>
                                <el-col :span="6" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt" id="check2" value="pass2">
                                    <label for="check2">2
                                    </label>
                                </el-col>
                                <el-col :span="6" class="filtItme">  
                                        <input type="checkbox" v-model="dataFilt" id="check3"  value="pass3">
                                    <label for="check3">3
                                    </label>
                                </el-col>
                                <el-col :span="6" class="filtItme">
                                        <input type="checkbox" v-model="dataFilt"  id="check4" value="pass4">
                                    <label for="check4">4 
                                    </label>
                                </el-col>
                                
                            </el-row>
                        </div>
                    </div>
                </more>
            </el-col>
        </el-row>
      <div class="block" id="blankSpace" >
        

        <div class="isDown" ref="isDown" v-show="!isDown">刷新数据</div>
		<div v-show="isDown" ref="freshing"><i class="el-icon-loading"></i>刷新中</div>
		<div class="Wrapper" ref="watermeterScroll">
			
			<div ref="wrapperContent"> 
				
				<el-table
                    row-class-name="watermeterTable"	
                    class="searchResult "
                    ref="multipleTable"
                    @selection-change="watermeterSelectionChange"
                    size="mini"
                    border
                    @row-click="waterClick"
                    :data="currentData"
                    @select-all="selectAll"
                    >
                    <el-table-column type='selection' v-if="batchProcessing" width="50"> 
                        
                    </el-table-column>
                    <el-table-column
                        :label="filterData.length.toString()"
                        width="70"
                    >
                    <template slot-scope="{$index}">
                           {{$index+1}} 
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="水表编号"
                        width="170">
                        <template slot-scope="{row}">
                            <div>
                                {{row.deviceNumber}}
                                <span class="singleDetail" @click.stop="$router.push({
                                    path:'./replace',
                                    query:{collectorId:row.deviceNumber,type:3}
                                })">替换</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="joinStatus"
                        label="挂接状态"
                        width="160">
                        <template slot-scope={row}>
                            <div :style="{color:row.joinStatus==1?'':'red'}">
                                {{row.joinStatus==1?'已挂接':'未挂接'}}
                                <span class="singleDetail"   v-if="!row.joinStatus==1"  @click.stop="reconnect([row.deviceNumber],row.joinStatus)">重新挂接</span>
                                <span class="singleDetail"   v-if="row.joinStatus==1"  @click.stop="connectRemove([row.deviceNumber],row.joinStatus)">移除挂接</span>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="valve"
                        label="阀门状态"
                        width="100">
                        <template slot-scope={row}>   
                            {{(row.valve==1&&'关')||(row.valve==0&&'开')||(row.valve==2&&'半悬')||'暂无'}}
                            <span  class="singleDetail"  @click.stop="watermeterSwitch($event,row.deviceNumber,row.valve)">开关</span> 
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="readingLatest"
                        label="最新读数"
                        width="160"
                       >
                       <template slot-scope={row}>   
                            {{row.readingLatest}}
                            <span  class="singleDetail"  @click="historySearch(row)">历史数据</span> 
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="门牌号"
                        prop="houseNumber"
                        width="90"
                        >
                    </el-table-column>
                    <el-table-column
                        label="通道号"
                        prop="chanelnum"
                        width="80"
                    >
                    </el-table-column>
                    <el-table-column
                        label="设备状态"
                        prop="deviceStatus"
                        width="100"
                       >
                        <template slot-scope={row}>
                            {{row.deviceStatus==0?'异常':'正常'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="安装状态"
                        prop="setupStatus"
                        width="100"
                       >
                        <template slot-scope={row}>
                            {{row.setupStatus==1?'已安装':'未安装'}}
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                        prop="readingLatestdatetime"
                        label="读数时间"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="pollingTest"
                        label="轮询结果"
                        width="110">
                        <template slot-scope={row}>
                            
                            {{row.pollingTest==1?'通过':'未通过'}}
                        </template>
                    </el-table-column>
                    
                    
                    <el-table-column
                        label="操作"
                        
                        >
                        <template slot-scope="{row,$index}">
                            <el-button  type="text" @click="removeWatermeter(row,$index)">彻底删除</el-button>
                            <el-button type="text" size="mini" @click="$refs.edition.show(row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>	
            
			</div>
			
		</div>

      </div>
        <!-- 历史数据 -->
        <DetailEdit ref="edit" :title="'历史数据'"  >
            <el-button type="primary" slot="operation" @click="saveEdit" >保存</el-button>  
            <el-form  :model="watermeterData" label-width="80px" class="watermeterEdit" slot="content">
                <el-row type="flex" justify="space-between" style="font-size:15px;">
                    设备ID：{{watermeterData.deviceNumber}}
                </el-row>
                <el-row>
                    <p class="editTitle" >查询历史数据</p >
                </el-row>
                <!-- 显示历史数据 -->
                <historyData ref="historyData" :deviceNum="watermeterdeviceNum" />
                
            </el-form>
        </DetailEdit>

        
        <!-- 开关阀 -->
       <el-dialog
        title="开关阀"
        :visible.sync="meterSwitch"
        width="30%">
		<el-radio v-model="radioSwitch" label="0">开</el-radio>
		<el-radio v-model="radioSwitch" label="1">关</el-radio>
        <span slot="footer" class="dialog-footer">
            <el-button @click="meterSwitch = false">取 消</el-button>
            <el-button  type="primary" @click="SelectionArray.length>0?switchConfirm(SelectionArray):switchConfirm([watermeterdeviceNum])"> <i v-if="switchLoad"  class="el-icon-loading"></i> 确认</el-button>
        </span>
       </el-dialog>


        <!-- 下发详情 -->
       <el-dialog
        title="移除挂接结果"
        :visible.sync="deleteResult"
        width="40%"
        height="250">
        <el-table
            size="mini"
            border
            :data="deleteArray"
            >
            <el-table-column
                prop="data"
                label="水表编号"
                >
            </el-table-column>
            <el-table-column
                prop="messaGE"
                label="结果">
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="deleteResult = false">确 定</el-button>
        </span>
        </el-dialog>



        <edit ref="edition" ></edit>
  </div>
</template>

<script>
const PAGESIZE = 10
import QR from '@/components/QR/QR.vue'
import DetailEdit from './DetailEdit.vue'
import more from './more.vue'
import seleceTime from '@/components/selectTime/selectTime.vue'
import historyData from './historyData.vue'
import store from '@/store/index.js'
import BScroll from 'better-scroll'
import edit from '../coloterManage/edit.vue'
import sseRequest from '@/assets/js/sse.js'
export default {
  components:{
      QR,
      more,
      DetailEdit,
      seleceTime,
      historyData, 
      edit
  },
  props:{},
  filters:{
    
  },
  data(){
    return {
        sseConnect:false,
        deleteResult:false,
        deleteArray:[],
        collectorData:'',
        isDown:false,
        isUp:false,
		pageNum:1,
		watermeterWrapper:null,
        dataFilt:[],
        status:null, //null代表未选择
        unstatus:null,
        valve:null,
        unvalve:null,
        join:null,
        unjoin:null,
        tableData:[],//水表数据
        tableDataNav:[],
        
        watermeterRow:'',
        watermeterData:{
            houseNumber:null
        },                             //***单个被点击的水表的数据,编辑的数据都要写入,防止未点击前数据不存在而报错
        SelectionArray:[],//批量操作所选择的设备
        deviceNum:null, //所属采集器编号
        watermeterdeviceNum:null, //当前操作的水表编号
        meterSwitch:false,  //开关阀菜单显示
        radioSwitch:'0',    //开关阀 0关1开
        oneData:'',
        batchProcessing:false,//是否批量操作
        switchLoad:false,
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
    dataFilt(val){
        console.log(val)
    }
    
  },
  computed:{
    refreshTxt:function(){
        return this.isEnd?'--无更多数据--':'--上拉加载更多--'
    },
     qrId:function(){
        return this.$store.state.qrId
    },
    filterData:function(){//筛选后的数据
        return this.filtTableData(this.tableDataNav,this.dataFilt)
    },
    currentData(){ //当前分页数据
        return this.filtTableData(this.tableData,this.dataFilt)
    }  
  },
  methods:{
      selectAll(){
          this.SelectionArray=this.filterData.map(val=>{
                return val.deviceNumber
            })
         
      },
      hideMenu(){
			this.$refs.waterMenu.classList.toggle('isShow')
		},
      //获取采集器通道
      getCollectorData(){
          this.$http.post('/weiXin/api/v1/deviceManager/getListDeviceBySearch',{
                "deviceNum":this.deviceNum,
                "pageNum": 1,
                "pageSize": null,
                "type": 2,},{
                  'Content-Type': 'application/json;'
              },true)
			  .then(res=>{
				  if(res){
                      console.log(res)
					this.collectorData=res.data.data.list[0]
                  }
                  
			  })
			  .catch(err=>{
			  })
      },
      watermeterSelectionChange(val){
          let list=[]
          for(let i of val){
              list.push(i.deviceNumber)
          }
          this.SelectionArray=list
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
                Obj = new BScroll(SCobj,{
                    scrollX:true,
                    click:true,
                    // bounce:false,
                    directionLockThreshold:5,
					pullUpLoad:{
					threshold: -50,
					},
					pullDownRefresh:{
					threshold: 55,
					txt:'刷新'
					},
                })
                this.watermeterWrapper=Obj
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
                        this.tableDataNav=arr
						this.tableData=[]
						this.tableData.push(...this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE))
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
        filtTableData(data,dataFilt){  //oneData变化的时候也会触发，原因不明
            let array=[]
            const actions = new Map([   //参数所代表的数据的对应条件
                ['valve',(o)=>o.valve==0],
                ['unvalve',(o)=>o.valve==1],
                ['half',(o)=>o.valve==2],
                ['join',(o)=>o.joinStatus==1],
                ['unjoin',(o)=>o.joinStatus==0],
                ['status',(o)=>o.deviceStatus!=0],
                ['unstatus',(o)=>o.deviceStatus==0],
                ['setup',(o)=>o.setupStatus==1],
                ['unsetup',(o)=>o.setupStatus!=1],
                ['polling',(o)=>o.pollingTest==1],
                ['unpolling',(o)=>o.pollingTest!=1],
                ['pass1',(o)=>o.chanelnum==1],
                ['pass2',(o)=>o.chanelnum==2],
                ['pass3',(o)=>o.chanelnum==3],
                ['pass4',(o)=>o.chanelnum==4]
                ])
            const filtWay=()=>{
                let filt=[]
                for(let key of dataFilt){  //需要满足哪些条件
                    actions.forEach((fun,param)=>{
                        if(key==param){
                            filt.push(fun)
                        }  
                    })
                }
                
                array=data.filter((item)=>{   //依次满足条件
                    let result=0 
                    filt.forEach(act=>{
                    if(act(item)){
                        result++
                    }
                    })
                    if(result==filt.length){  //所有条件都满足
                        return true
                    }else{
                        return false    //有条件不满足
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
      //请求所有数据
	  searchData(num,onedata){
		return new Promise(resolve=>{
            this.$http.post('/weiXin/api/v1/deviceManager/getListDeviceBySearch',{
                "collectorNum":this.deviceNum,
                "pageNum": num,
                "pageSize": null,
                "searchField":onedata,
                "type":3,},{
                  'Content-Type': 'application/json;'
              },true)
			  .then(res=>{
				  if(res){
                      let Obj = res.data.data.list
                      Obj=Obj.filter(val=>val.chanelnum==1).sort((a,b)=>{
                          return a.deviceNumber-b.deviceNumber
                      }).concat(Obj.filter(val=>val.chanelnum==2).sort((a,b)=>{
                          return a.deviceNumber-b.deviceNumber
                      }),Obj.filter(val=>val.chanelnum==3).sort((a,b)=>{
                          return a.deviceNumber-b.deviceNumber
                      }),Obj.filter(val=>val.chanelnum==4).sort((a,b)=>{
                          return a.deviceNumber-b.deviceNumber
                      }),Obj.filter(val=>val.chanelnum==null))
                      resolve(Obj)  
                  }
                  
			  })
			  .catch(err=>{
			  })
		})
      },
      //开关阀
      watermeterSwitch($event,num,val){
		  this.watermeterdeviceNum=num
		  this.meterSwitch=true
		  this.radioSwitch=val  
      },
      //历史查询
      historySearch(row){
          if(!this.batchProcessing){
              //判断是否点击的是同一个水表,不是同一个水表才清空历史记录的搜索时间
            if(this.watermeterdeviceNum!=row.deviceNumber){
                this.$store.commit('changehistorytimeChoice',null)  
                this.$refs.historyData.$data.tableData=[]
                this.$refs.historyData.$data.timechoice=''
                
            }
            this.watermeterRow=row
            this.watermeterdeviceNum=row.deviceNumber
            this.watermeterData={...row}
			this.$refs.edit.$el.style.display="block"
		}
      },
      //点击单个水表
      waterClick(row){
          this.$refs.multipleTable.toggleRowSelection(row)
      },
      //保存编辑
      saveEdit(){
          this.$confirm('是否保存修改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(()=>{
                this.$http.post('/weiXin/api/v1/deviceManager/deviceEdit',{
                    deviceNumber:this.watermeterdeviceNum,
                    houseNumber:this.watermeterData.houseNumber,
                    deviceType:3//水表
                })
                .then(res=>{
                    if(res){
                        this.$refs.edit.cancle()
                        this.watermeterRow.houseNumber=this.watermeterData.houseNumber
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        })
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });          
            })
          
      },
      //挂接水表
	  reconnect(wid,join){
		this.$confirm('是否重新挂接 ' +wid.length+'个水表'+ wid ,'提示',{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		})
		.then(()=>{
            
            // sseRequest(()=>{
            //     this.sseConnect=true
                return new Promise((resolve,reject)=>{
                    
                    this.$http.post('/weiXin/api/v1/deviceManager/join',{
                        generalNums:wid,
                        collectorNum:this.deviceNum
                    },{
                        'Content-Type': 'application/json;'
                    },true)
                    .then(res=>{
                        if(res){
                            this.$message({
                                type:'success',
                                message:'命令下发成功'
                            })
                            
                            resolve(this)
                            
                        }
                    })
                    .catch(()=>{
                        // this.sseConnect=false
                        reject()
                    })
                    
                })
            // })
			
        })
        .catch(() => {  
		})
      },
      //批量挂接
      batchConnect(){
          this.reconnect(this.SelectionArray)
      },
	  //移除水表
	  connectRemove(wid,join){
		this.$confirm('是否移除' +wid.length+'个水表 '+ wid ,'提示',{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		})
		.then(() => {
			this.$http.post('/weiXin/api/v1/deviceManager/bashDeleteGeneral',{
                generalNums:wid,
                collectorNum:this.deviceNum
			},{
                'Content-Type': 'application/json;'
            },true)
			.then(res=>{
				
				if(res&&res.data.code==0){
                    this.$message({
                        type:"success",
                        message:'命令下发成功'
                    })
                    // this.deleteArray=res.data.data
                    // this.deleteResult=true
                    if(this.SelectionArray>0){
                        
                    }else{
                        join=0
                    }
				}
			})
			

		})
		.catch(() => {  
		})
      },
      //批量移除水表
      batchRemove(){
          this.connectRemove(this.SelectionArray)
      },
      searchoneData(){
        if(this.oneData){
            //让分页num=1
            // this.pageNum=1
             this.searchData(this.pageNum,this.oneData)
            .then((res)=>{
            this.tableDataNav=this.tableData=[...res]
            this.$nextTick(()=>{
                this.initScroll(this.watermeterWrapper,this.$refs.watermeterScroll)
            })
        })
        }else{
            //未输入id
        }
      },
      //删除水表
      removeWatermeter(row,index){
          this.$confirm('是否删除水表 ' ,'提示',{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		})
		.then(() => {
			 this.$http.get('/weiXin/api/v1/deviceMend/deleteDevice',{
              deviceNum:row.deviceNumber,
              deviceType:3 //水表
          })
            .then(res=>{
                
                if(res){
                    this.$refs.edit.cancle()
                    this.currentData.splice(index,1)
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                }
            })
		})
		.catch(() => {  
		})
         
      },
    //确认开关阀操作
      switchConfirm(wid){
        this.switchLoad=true
        let t = 1
        this.$http.post('/weiXin/api/v1/deviceManager/bashValveSwitch',{
            deviceNums:wid,
            collectorNum:this.deviceNum,
            value:this.radioSwitch,
            deviceType:3    //代表水表
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
    //批量开关阀：行内
    //批量操作
    isbatchProcessing(){
        this.batchProcessing=true
        this.$refs.moreOperation.cancle()
    },
    quitBatch(){
        this.batchProcessing=false
        this.$refs.multipleTable.clearSelection()
    },
    //筛选
    watermeterFilter(){
        this.$refs.filt.open()
        
    },
    //刷新
    refreshPage(){
        this.pageNum=1
        this.getListDataFromNet(this.pageNum, (arr) => {
            this.tableDataNav=arr
            this.tableData=[]
            this.tableData.push(...this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE))
            this.$nextTick(()=>{
                this.watermeterWrapper.refresh()
                
                
            })
          

        })
    }
  },
  created(){},
  mounted(){
        if(this.$route.query.deviceNum!==null){
            this.deviceNum=this.$route.query.deviceNum
        }
        this.getCollectorData()
        this.searchData(this.pageNum)
        .then((res)=>{
            this.tableDataNav=res
            this.tableData.push(...this.tableDataNav.slice((this.pageNum-1)*PAGESIZE,this.pageNum*PAGESIZE))
            this.$nextTick(()=>{
                this.initScroll(this.watermeterWrapper,this.$refs.watermeterScroll)
            })
        })
        
  }
}
</script>
<style lang="less">

#watermeterDetail{
	overflow: scroll;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    height: 100vh;
	>header{
		background: #747776;
		position: relative;
		line-height: 30px;
        width: 100%;
        .water-menu{
			overflow: hidden;
			height: 130px;
			transition:height 0.3s ease-in-out;
		}
		.isShow{
			height:0px;
		}
		span{
			display: inline-block;
			font-size: 16px;
			color: #fff;
		}
		.idSearch{
            width: 350px;
            margin:0 auto;
            margin-top: 10px;
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
                padding-right: 10px;
                
				li{
                   
                    border-bottom: 4px solid #747776;
                    margin:0px 10px; 
                    padding: 10px
                }
                li:last-child{
                    border: 0;
                }
			}
			
        }
        .batchOperate{
            text-align: center;
        }
        .collectorReplace{
            color:#f8f8f8;
            // width:350px;
            margin: 0 10px;
            font-size: 15px;
            
        }
        .collectorPassageway{
            margin: 0 15px;
            color: #f8f8f8;
            
            >div{
                // background: #5287f1;
                // padding: 5px;
                // border-radius: 5px;
                p{
                    font-size: 18px;
                    line-height: 1;
                    text-align: center;
                    margin: 2px 0;
                }
            }
        }
        .collectorDetail{
            width: 100%;
            background:#fff;
            z-index: 500;
            position: absolute;
            top: 100%;
            left: 0;
        }
	}
	>.block{
        flex: 1;
        overflow: hidden;
        text-align: center;
        margin-top: -5px;
        padding: 0 10px 0 10px;	
        >.Wrapper{
        height: 90%;
        width: 100%;
            >div{
                min-height: calc(100% + 1px);
                width: 1500px;
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
    }
    .watermeterEdit{
       padding: 5px 10px 0 10px;
       .editTitle{
           font-size: 15px;
            padding: 5px;
       }
       .el-form-item{
           margin-bottom:5px;
       }
    }
    
	.isDown{
        visibility: hidden;
		transform:translate(0,-40px)
	}

}
</style>