<template>
  <div class="offlineRecord">
      <p style="font-size:17px;line-height:30px;">设备ID:{{$route.query.deviceId}} </p>
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
    <div class="block">
        <div class="isDown" ref="isDown" v-show="!isDown">刷新数据</div>
		<div v-show="isDown" ref="freshing"><i class="el-icon-loading"></i>刷新中</div>
        <div class="Wrapper" ref="recordScroll">
            <div>
                <el-table
                    class="searchResult"
                    size="mini"
                    border
                    :data="tableData"
                    >
                    <el-table-column
                        fixed
                        prop="date"
                        label="读数时间"
                        
                        >
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        prop="reading"   
                        >
                        <template slot-scope={row}>
                            <span :style="{color:row.onlineOffline==1?'green':'#f56c6c'}">
                            {{row.onlineOffline==1?'上线':'下线'}}

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
const PAGESIZE=15
import BScroll from 'better-scroll'
export default {
  components:{},
  props:{},
  data(){
    return {
        tableData:[],
        timechoice: '',
        recordWrapper:null,
        pageNum:1,
        isDown:false,
		isUp:false,
		isEnd:false,
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
    }
  },
  watch:{},
  computed:{
      refreshTxt:function(){
        return this.isEnd?'--无更多数据--':'--上拉加载更多--'
    }
  },
  methods:{
      searchHistory(){
          this.getRecord()
      },
      getRecord(){
          return new Promise(resolve=>{
              this.$http.get('/weiXin/api/v1/historyReading/getHistoryOnline',{
                  deviceNum:this.$route.query.deviceId,
                  startTime:this.timechoice?this.timechoice[0]:null,
                  endTime:this.timechoice?this.timechoice[1]:null,
                  pageNum:this.pageNum,
                  pageSize:PAGESIZE,
              })
              .then(res=>{
                  if(res){
                      
                      resolve(res.data.data)
                  }
              })

          })
      },
      getListDataFromNet (pageNum,successCallback) {
	  // 延时一秒,模拟联网
	  
      setTimeout(() => {
		
        this.getRecord(pageNum)
        .then(res=>{
            successCallback(res)
        })
		
        
      }, 1000)
    },
      initScroll(Obj,SCobj){

            if( !Obj ){
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

                    this.isUp=true
                    this.pageNum++
                    this.getListDataFromNet(this.pageNum, (arr) => {
                        if(arr.length==0) this.isEnd=true
                        this.tableData.push(...arr)
                        this.isUp=false
                        Obj.refresh()
                        Obj.finishPullUp();
                    })

				})
				Obj.on('pullingDown',()=>{
                    this.isDown=true
					this.pageNum=1
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
  },
  created(){},
  mounted(){
      this.getRecord()
      .then(res=>{
          this.tableData=res
          this.initScroll(this.recordWrapper,this.$refs.recordScroll)
      })
  }
}
</script>
<style lang="less">
.offlineRecord{
    .selectTime{
        margin: 0 10px;
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
        height: 67vh;
        text-align: center;
        .isDown{
            visibility: hidden;
            transform:translate(0,-40px)
        }
        .Wrapper{
            height: 100%;
            overflow: hidden;
            >div{
                min-height: calc(100% + 1px)

            }
        }
        .searchResult{
            
        }
    }
}
</style>