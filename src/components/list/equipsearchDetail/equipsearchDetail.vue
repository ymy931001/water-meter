<template>
  <div id="equipsearchDetail" :class="{vis,hidden}" >
    <header>
			<span>设备详情</span>
		</header>
    <div class="block">
      <el-collapse accordion v-model="activeId">
        <el-collapse-item  v-for="(item,index) in SEARCHRESULT" :key="index" :title="'设备编号：'+item.id" :name="index" >
          <el-form ref="form"  label-width="80px" class="textform" >
            <el-form-item label="设备类型">
              <span>{{item.type}}</span>
            </el-form-item>
            <el-form-item label="设备位置">
              <span>{{item.address}}</span>
            </el-form-item>
            <el-form-item label="上报时间" v-if="item.type=='无线单表'">
              <el-col >
                <el-time-select
                  placeholder="选择时间"
                  v-model="item.reportTime"
                  :disabled="revise"
                  :picker-options="{
                    start: '01:00',
                    step: '1:00',
                    end: '24:00'
                  }">
                </el-time-select>
              </el-col>
            </el-form-item>
            <el-form-item label="开关阀" v-if="item.type!=='采集器'">
              <el-radio-group v-model="item.switch" :disabled="revise">
                <el-radio label="1">开</el-radio>
                <el-radio label="0">关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="primary" v-if="showrevise&&item.type!=='采集器'" @click="reviseParams">修改</el-button>
            <el-button type="primary" v-if="showsave" @click="saveParams">保存</el-button>
          </el-form>
        </el-collapse-item>
      </el-collapse>


      <el-row class="searchConfirm">
					<el-button type="primary" @click="back" >返回</el-button>
			</el-row>
    </div>
     
  </div>
</template>

<script>
export default {
  props:{
    SEARCHRESULT:{

    }
  },
	data() {
      return {
        vis:false,
        hidden:true,
        activeId:0,
        revise:true,
        showrevise:true,
        showsave:false
			}
    }, 
  components:{},
  watch:{

  },
  computed:{},
  methods:{
      show(){
        this.vis=true
        this.hidden=false
      },
      back(){
        this.showrevise=true
        this.showsave=false
        this.vis=false
        this.hidden=true
        this.revise=true
      },
      saveParams(){//修改设备上报时间和开关阀
        if(this.SEARCHRESULT[this.activeId].type=="无线单表"&&this.SEARCHRESULT[this.activeId].reportTime){

          this.$http.get('/weiXin/api/v1/deviceManager/changeInterval',{
            deviceNum:this.SEARCHRESULT[this.activeId].id,
            time:Number(this.SEARCHRESULT[this.activeId].reportTime.split(':')[0]*60)
          })
          .then(res=>{
          this.showrevise=true
          this.showsave=false
          this.revise=true
          this.$message({
            type:'success',
            message:'修改成功'
          })
          }) 
        }
        this.$http.get('/weiXin/api/v1/deviceManager/valveSwitch',{
          deviceNum:this.SEARCHRESULT[this.activeId].id,
          value:this.SEARCHRESULT[this.activeId].switch,
          deviceType:(this.SEARCHRESULT[this.activeId].type=="无线单表"&&1)||(this.SEARCHRESULT[this.activeId].type=="水表"&&3)
        })
        .then(res=>{
          this.$message({
            type:'success',
            message:'修改成功'
          })
        })
      },
      reviseParams(){
        if(this.revise){
          this.revise=false
          this.showrevise=false
          this.showsave=true
        }else{
          
          this.revise=true
        }
  
      }

      
  },
  created(){},
  mounted(){
    
  }
}
</script>

<style lang="less" >
#equipsearchDetail{
  background: #fff;
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 999;
  transition:top .2s ease-in .2s;
  
  .block{
    text-align: center;
    overflow: hidden;
    .textform{
    padding: 0 20px 0 20px;
    }
		.idSearch{
				width: 320px;
    }
    .el-collapse{
      text-align: left;
      .el-collapse-item__header{
        padding-left: 20px;
      }
    }
		.searchConfirm{
      width: 100%;
      position: absolute;
      bottom: 50px;
        button{
          width: 320px;
          margin-top: 20px;
          margin-bottom: 20px;
        }
          
		}
	}
}
</style>
<style scoped>
.vis{
    top:0;
  }
.hidden{
  top: -100%;
}
header{
	height: 40px;
	background: #747776;
	text-align: center;
	width: 100%;
}
header span{
	display: inline-block;
	font-size: 16px;
	line-height: 36px;
	color: #fff;
}
</style>


