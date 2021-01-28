<template>
  <div class="testResult">
        <div ref="wrapperDetail" class="wrapper"> 
            <div>
                <el-table
                    class="searchResult"
                    size="mini"
                    border
                    :data="history"
                    >
                    <el-table-column
                        fixed
                        prop="date"
                        label="读数时间"
                        
                        >
                    </el-table-column>
                    <!-- <el-table-column
                        label="历史读数"
                        prop="reading"   
                        >
                        <template slot-scope={row}>
                            {{row.reading?row.reading+'吨':'无'}}
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="voltage"
                        label="电压"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="signalIntensity"
                        label="信号强度"
                        >
                    </el-table-column>
                </el-table>

            </div>
        </div>
        <div class="hisOption">
            <el-button  @click="$el.style.setProperty('height',0)">取消安装</el-button>
            <el-button type="primary" @click="install">确定安装</el-button>
        </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
import {offline,removeStorage} from '@/assets/js/offline.js'
export default {
  components:{},
  props:{
      deviceNum:{
          type:String
      }
  },
  data(){
    return {
        history:[],
        pageNum:1,
        historyScroll:false,
        isEnd:false,
        collector:{},
        isOffline:false//是否离线
    }
  },
  watch:{},
  computed:{},
  methods:{
      initScroll(Obj,SCobj){
            if( !Obj ){
                Obj = new BScroll(SCobj,{
                    eventPassthrough:"horizontal",
					pullUpLoad:true
				})
				Obj.on('pullingUp',()=>{
                    this.pageNum++
                    this.getResult()
                    .then(arr=>{
                        
                        if(arr.length==0) this.isEnd=true
                        this.history.push(...arr)
                        Obj.finishPullUp();
                        Obj.refresh()
                    
                    })
				})
            }else{
                Obj.refresh() 
            }
        },
      show(data){
          this.collector=data
          this.pageNum=1
          this.isEnd=false
          this.getResult()
          .then(arr=>{
              this.history=arr
              setTimeout(()=>{
                  this.initScroll(this.historyScroll,this.$refs.wrapperDetail)

              },350)
              
          })
      },
      getResult(success){
          return new Promise(resolve=>{
              if(!this.isEnd){
                  this.$http.get('/weiXin/api/v1/historyReading/getHistoryReading',{
                      deviceNum:this.deviceNum,
                      pageNum:this.pageNum,
                      pageSize:10
                  })
                  .then(res=>{
                      if(res){
                          this.$el.style.setProperty('height','100vh')
                          resolve(res.data.data)
                          
                      }
                  })
    
              }

          })
      },
      install(){
            var offlineType
						
            if(this.collector.type==1){
                offlineType="singlemeter"
            }else if(this.collector.type==2){
                offlineType="collector"
            }

            if(this.isOffline){
                offline(offlineType,data)
            }else{
                this.$http.post('/weiXin/api/v1/deviceManager/collectorAndWirelessInstall',{
                        ...this.collector
                    })//设备安装
                .then(res=>{
                    if(res){
                        this.$http.post('/weiXin/api/v1/deviceManager/networkingTest',{deviceNums:[this.collector.deviceNumber],deviceType:this.collector.type},{//发起联网测试
                            'Content-Type': 'application/json; charset=UTF-8'
                        },true)
                        .then(res=>{
                            if(res){
                                this.$message({
                                    type: 'success',
                                    message: this.collector.deviceNumber+'联网测试已下发'
                                });
                                this.$el.style.setProperty('height',0)
                                this.$router.push('/textonline')
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: '设备安装成功，联网测试下发失败'
                                });
                            }			
                        })
                    }else {//安装失败
                        this.$message({
                            type:'error',
                            message:res.data.message
                        })
                        this.$el.style.setProperty('height',0)
                        this.$router.push('/textonline')
                    }
                })
                .catch(e=>{
                    if(e=='timeout'){
                        offline(offlineType,data)
                    }
                })

            }

         
      }
  },
  created(){},
  mounted(){
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
               this.isOffline = false
        });
        EventUtil.addHandler(window, "offline", ()=> {
            this.isOffline = true
            
    
        });
  }
}
</script>
<style  lang="less">
.testResult{
    padding-top: 40px;
    height: 0;
    width: 100%;
    position: fixed;
    top: 0;
    background: #fff;
    transition: height 0.3s ease-in-out;
    overflow: hidden;
    .wrapper{
        height: 70%;
        overflow: hidden;
        >div{
            min-height: calc(100% + 1px)
        }
        // .el-table{
        //     // 
        // }
    }
    .hisOption{
        display: flex;
        justify-content: space-between;
        margin: 0 30px;
    }
}
</style>