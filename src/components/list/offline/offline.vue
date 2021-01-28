<template>
  <div id="textResult">
    <el-tabs v-model="activeName" >
        <el-tab-pane label="无线单表" name="first" class="offlinedata">
            <ul v-for="(item,ind) in offlineSinglemeter" :key="ind" @touchstart="remove(item,offlineSinglemeter,$event)" @mouseup="clear">
                <li>
                    <el-row type="flex" justify="space-between">
                        <div>
                            <h3>设备ID：{{item.deviceNumber}}</h3>
                            <p>{{item.time | timestampToTime }}</p>
                        </div>
                        <div><el-button @click.stop="install(1,item)">安装</el-button></div>
                    </el-row>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="采集器" name="second" class="offlinedata">
            <ul v-for="(item,ind) in offlineCollector" :key="ind" @touchstart="remove(item,offlineCollector,$event,ind)" @mouseup="clear">
                <li>
                    <el-row type="flex" justify="space-between">
                        <div>
                            <h3>设备ID：{{item.deviceNumber}}</h3>
                            <p>{{item.time | timestampToTime }}</p>
                        </div>
                        <div><el-button @click.stop="install(2,item)">安装</el-button></div>
                    </el-row>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="水表" name="third" class="offlinedata">
            <ul v-for="(item,ind) in offlineWatermeter" :key="ind" @touchstart="remove(item,offlineWatermeter,$event)" @mouseup="clear">
                <li>
                    <el-row type="flex" justify="space-between">
                        <div>
                            <h3>设备ID：{{item.deviceNumber}}</h3>
                            <p>{{item.time | timestampToTime }}</p>
                        </div>
                        <div><el-button @click.stop="install(3,item)">安装</el-button></div>
                    </el-row>
                </li>
            </ul>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {removeStorage} from '@/assets/js/offline.js'
export default {
  components:{},
  props:{},
  data(){
    return {
        offlineCollector:[],
        offlineSinglemeter:[],
        offlineWatermeter:[],
        activeName: 'second',
        loop:null
    }
	},
	methods:{
		install(type,data){
            this.$confirm('是否重新安装该设备?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(type==2){
                    this.$http.post('/weiXin/api/v1/deviceManager/collectorAndWirelessInstall',{...data})
                    .then(res=>{
                        if(res){
                            this.offlineCollector.splice(data,1)
                            removeStorage('collector',data.deviceNumber)
                            this.$message({
                                type: 'success',
                                message: '安装成功!'
                            });
                        }
                    })
                }else if(type==1){
                    this.$http.post('/weiXin/api/v1/deviceManager/collectorAndWirelessInstall',{...data})
                    .then(res=>{
                        if(res){
                            this.offlineSinglemeter.splice(data,1)
                            removeStorage('singlemeter',data.deviceNumber)
                            this.$message({
                                type: 'success',
                                message: '安装成功!'
                            });
                        }
                    })
                }
                else{
                    this.$http.post('/weiXin/api/v1/deviceManager/generalInstall',{...data})
                    .then(res=>{
                        if(res){
                            this.offlineWatermeter.splice(data,1)
                            removeStorage('watermeter',data.deviceNumber)
                            this.$message({
                                type: 'success',
                                message: '安装成功!'
                            });
                        }
                    })
                }
            }).catch(() => {
    
            });
            
        },
        remove(item,table,e,index){
            this.loop=setTimeout(() => {
                    this.$confirm('是否删除该设备?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        table.splice(index,1)
                        if(item.type==1){
                            let result=JSON.parse(localStorage.getItem('singlemeter'))
                            result.splice(index,1)
                            localStorage.setItem('singlemeter',JSON.stringify(result))
                        }else if(item.type==2){
                            let result=JSON.parse(localStorage.getItem('collector'))
                            result.splice(index,1)
                            localStorage.setItem('collector',JSON.stringify(result))
                        }else{
                            let result=JSON.parse(localStorage.getItem('watermeter'))
                            result.splice(index,1)
                            localStorage.setItem('watermeter',JSON.stringify(result))
                        }   
                    }).catch(() => {
            
                    });
                }, 500);
            
        },
        clear(){
            clearTimeout(this.loop)
        }
    },
  filters:{
      timestampToTime(timestamp) {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate()+'  ' 
        let H = date.getHours()+ ':';
        let m = date.getMinutes()
        return Y+M+D+H+m;
    } 

  },
  watch:{},
  computed:{},
  created(){},
  mounted(){
      (()=>{
          var seen = new Map()
          if(localStorage.getItem('collector')){
              let array=JSON.parse(localStorage.getItem('collector'))
              this.offlineCollector=array.filter((a) => !seen.has(JSON.stringify(a)) && seen.set(JSON.stringify(a), 1))
             
          }
          if(localStorage.getItem('singlemeter')){
              let array=JSON.parse(localStorage.getItem('singlemeter'))
              this.offlineSinglemeter=array.filter((a) => !seen.has(JSON.stringify(a)) && seen.set(JSON.stringify(a), 1))
          }
          if(localStorage.getItem('watermeter')){
              let array=JSON.parse(localStorage.getItem('watermeter'))
              this.offlineWatermeter=array.filter((a) => !seen.has(JSON.stringify(a)) && seen.set(JSON.stringify(a), 1))
          }

      })()
  }
}
</script>
<style  lang="less">
#textResult{
	overflow: scroll;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    height: 100vh;
    .el-tabs__nav{
        width: 100%;
    }
	.el-tabs__item{
        width: 33%;
        text-align: center;
    }
    .offlinedata{
        ul{
            border-bottom: 1px solid rgb(224, 224, 224);
            padding: 10px 5px;
            cursor: pointer;
        }
    }


}
</style>