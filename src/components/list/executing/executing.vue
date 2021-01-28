<template>
  	<div id="executing">
		<div class="block " ref="commandWrapper">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="item in commandDate" :key="item.ind" :name="item.ind" >
          <template slot="title">
            <div :style="{color:item.status=='错误'?'red':'',display:'inline-block',fontSize:'14px'}">
              <span>编号:{{item.meternum}}</span>
              <span>下发时间:{{item.gmtcreate}}</span>

            </div>
            
            
          </template>
          <el-form label-position="left" inline >
						<el-form-item label="执行状态：">
							<span>{{ item.status||'暂无' }}</span>
						</el-form-item>
						<el-form-item label="执行内容：">
							<span>{{ item.command||'暂无' }}</span>
						</el-form-item>
					</el-form>
        </el-collapse-item>
      </el-collapse>
				
	
		</div>
	</div>
	  
</template>

<script>
import BScroll from 'better-scroll'
export default {
  components:{},
  props:{},
  data(){
    return {
    activeName:'1',
    commandDate:null,
    commandScroll:null,
    }
  },
  watch:{},
  computed:{},
  methods:{
    getData(){
      this.$http.get('/weiXin/api/v1/deviceManager/getLoggingCommandInfo')
      .then(res=>{
        let list = res.data.data.map((val,ind)=>{
          return {
            ind:ind,
            meternum:val.meternum,
            command:val.commandDES,
            status:val.statusDes,
            gmtcreate:val.gmtcreate
          }
        })
        this.commandDate=list
      })
    },
    initScroll(Obj,SCobj){
      if( !Obj ){
        Obj = new BScroll(SCobj,{
            click:true,
        })  
        Obj.on('scroll',(pos)=>{
				})
      }else{
        Obj.refresh()    
      }
    },
  },
  created(){},
  mounted(){
    
  },
  activated() {
    this.getData()
    this.$nextTick(()=>{
    this.initScroll(this.commandScroll,this.$refs.commandWrapper);
    });
  },
}
</script>
<style  lang="less">
#executing{
	margin-top: 10px;
	.block{
    height: 67vh;
    overflow:scroll;
    .el-collapse{
      min-height: calc(100% + 1px)
    }
		.el-collapse-item__header {
      span{
        padding-left: 10px;
      }
    }
		.el-collapse-item__content{
      padding-bottom: 5px;
      padding-left: 30px;
    }
	}
}
</style>