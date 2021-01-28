<template>
  <div id="historyData">
  
        <el-row  type="flex" class="selectTime">  
            <el-col :span="20">
                <el-date-picker
                    v-model="timechoice"
                    :editable="false"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    popper-class="timeSelect2"
                    align="right"
                    unlink-panels
                    ref="select"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
            <el-col :span="4">
                <el-button class="search" @click="searchHistory">查询</el-button>
            </el-col> 
        </el-row>
        <div class="block" >
            <div class="isDown" ref="isDown" v-if="!isDown">刷新数据</div>
            <div v-else ref="freshing"><i class="el-icon-loading"></i>刷新中</div>
            <div class="Wrapper" ref="detailScroll">
                
                <div ref="wrapperDetail"> 
                    <el-table
                        class="searchResult"
                        size="mini"
                        border
                        :data="tableData"
                        :row-class-name="historyRowClassName"
                        >
                        <el-table-column
                            fixed
                            prop="date"
                            label="读数时间"
                            
                            >
                        </el-table-column>
                        <el-table-column
                            label="历史读数"
                            prop="reading"   
                            >
                            <template slot-scope={row}>
                                {{row.reading+'吨'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="voltage"
                            label="电压"
                            >
                            <template slot-scope={row}>
                                <span :style="{color:$parent.$parent.$parent.watermeterRow?(row.voltage<criticalValue.cRssiThreshold
?'green':'#f56c6c'):(row.voltage<criticalValue.wRssiThreshold
?'green':'#f56c6c')}">
                                {{row.voltage}}

                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        v-if="!$parent.$parent.$parent.watermeterRow"
                            prop="signalIntensity"
                            label="信号强度"
                            >
                            <template slot-scope={row}>
                                <span :style="{color:row.signalIntensity<criticalValue.wRssiThreshold?'green':'#f56c6c'}">
                                {{row.signalIntensity}}

                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                   
                    <div  ref="isUp" v-if="!isUp">{{refreshTxt}}</div>
                    <div v-else ref="download"><i class="el-icon-loading"></i>加载中</div>
                </div>
                
		    </div>

      </div>
   
     
  </div>
</template>

<script>
const PAGESIZE = 6

import store from '@/store/index.js'
import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
export default {
  components:{
  },
  props:{
      deviceNum:{
          type:String
      }
  },
  data(){
    return {
        isDown:false,
        isUp:false,
        isEnd:false,
		pageNum:1,
		detailWrapper:null,
        tableData:[],
        timechoice: '',
        pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        },
        elecData:[],
        criticalValue:''
    }
  },
   
  watch:{
  },
  computed:{
    refreshTxt:function(){
        return this.isEnd?'--无更多数据--':'--上拉加载更多--'
    }
  },
  methods:{
      
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
           var pullUp=()=>{
                console.log(this)
                this.isUp=true
                this.pageNum++
                this.getListDataFromNet(this.pageNum, (arr) => {
                    if(arr.length==0) this.isEnd=true
                    this.tableData.push(...arr)
                    this.isUp=false
                    Obj.finishPullUp();
                    Obj.refresh()
                })
           }
           var pullDown=()=>{
               this.isDown=true
					this.pageNum=1
					this.getListDataFromNet(this.pageNum, (arr) => {
						this.tableData=[]
						this.tableData.push(...arr)
						this.isDown=false
                        Obj.finishPullDown();
						Obj.refresh()
						if(!arr.length>0){

						}
					})
           }
            if( !Obj ){
                // console.log(this.$refs.detailScroll.offsetHeight)
				// this.$refs.wrapperDetail.style.minHeight=`${this.$refs.detailScroll.offsetHeight+1}px`
                Obj = new BScroll(SCobj,{
                    eventPassthrough:"horizontal",
					pullUpLoad:{
					threshold: -50,
					},
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

                    pullUp()

				})
				Obj.on('pullingDown',()=>{
                    pullDown()

				})
            }else{
                Obj.refresh() 
            }
        },
       //获取数据
       searchData(num){
          return new Promise(resolve=>{
              this.$http.get('/weiXin/api/v1/historyReading/getHistoryReading',{
                  deviceNum:this.deviceNum,
                  startTime:this.timechoice[0],
                  endTime:this.timechoice[1],
                  pageNum:num,
                  pageSize:PAGESIZE
              })
              .then(res=>{
                  if(res){

                      resolve(res.data.data)
                  }
              })

          })
       },
       searchHistory(){
            // this.$store.commit('changehistorytimeChoice',this.timechoice)
            this.searchData(this.pageNum)
            .then((res)=>{
                this.tableData=res
                console.log(this.tableData)
                this.$nextTick(()=>{
                    this.initScroll(this.detailWrapper,this.$refs.detailScroll)
                })
            })
            this.$http.get('/weiXin/api/v1/thresholdValue/get')
            .then(res=>{
                if(res){
                    this.criticalValue=res.data.data
                }
            })
      },
      elecGet(){
          this.$http.get('/weiXin/api/v1/thresholdValue/get')
          .then(res=>{
              if(res){
                    this.elecData=res.data.data
              }
          })
      },
      historyRowClassName({row}){
            // if (row.onlineStatus >this.elecData.) {
            //     return 'onlineSingle';
            // } else if (row.onlineStatus == '离线') {
            //     return 'offlineSingle';
            // }
	  },
  },
  created(){},
  mounted(){
    //   this.elecGet()
  }
}
</script>
<style  lang="less">
#historyData{
    width: 100%;
    height: 55vh;
    
    .selectTime{
        margin-bottom: 10px;
        .el-date-editor{
            width: 300px;
        }
        .search{
        width: 100%;
        margin-left: 5px;
        padding: 0;
        height: 100%;
        }

    }
    .block{
        text-align: center;
    }
    .Wrapper{
        overflow: hidden;
        height: 70vh;
        // height: 90%;
        width: 100%;
        
        >div{
                min-height: calc(100% + 1px);
                
            }
    }
}
.timeSelect2{
        width: 320px !important;
        overflow: scroll;
        height: 400px;
    .el-picker-panel__sidebar{
        width: 95px;
        border: 0;
        height: 100%;
    }
    .el-picker-panel__body{
    min-width: 0 !important;
    margin-left: 95px !important;
    border-left: 1px solid #e4e4e4;
    }
    .el-date-range-picker__content{
        width: 100%;
        margin-right: 30px;
        padding: 0;
    }
    .is-left{
        border: 0;
    }
}
</style>