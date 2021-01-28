<template>
  <div class="edit">
      <header>
        <el-button type="text" icon="el-icon-arrow-left" @click="cancle">返回</el-button>
      </header>
      <el-form ref="form" :model="form" label-width="80px" >
          <el-form-item label="设备编号">
              <el-input v-model="form.deviceNumber"></el-input>
          </el-form-item>
          <el-form-item label="门牌号">
              <el-input v-model="form.houseNumber"></el-input>
          </el-form-item>
          <div v-if="!form.offline">
            <el-form-item label="详细地址">
                <el-input v-model="form.districtDetail"></el-input>
            </el-form-item>
            <el-form-item label="小区">
                <el-input v-model="form.districtSite"></el-input>
            </el-form-item>

          </div>
          <el-form-item style="text-align:right">
              <el-button @click="confirm" style="width:150px;">保存</el-button>
          </el-form-item>
          <!-- <el-form-item label="在线情况">
              <el-input v-model="form.onlineStatus" disabled></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="测试情况">
              <el-input v-if="form.test" v-model="form.test " disabled></el-input>
              <el-input v-else v-model="form.pollingTest" disabled></el-input>
          </el-form-item> -->
          <div v-if="form.waterNum">
            <el-form-item label="水表数量" >
                <el-input v-model="form.waterNum" disabled></el-input>
                
            </el-form-item>
            <el-form-item label="信号强度" v-if="form.waterNum">
                <el-input v-model="form.signalIntensity" disabled></el-input>
                
            </el-form-item>
            <el-form-item label="基站信息" v-if="form.waterNum">
                <el-input v-model="form.baseStation" disabled></el-input>
                
            </el-form-item>
            
          </div>
          
          
        
        
        </el-form>
  </div>
</template>

<script>
import { editStroage } from '@/assets/js/offline.js'
export default {
  components:{},
  props:{},
  data(){
    return {
        form: {
        },
        row:{}
    }
  },
  watch:{},
  computed:{},
  methods:{
      show(row){
        this.$el.style.setProperty('transform','translateX(-100%)')
          this.row=row
          this.form={...row}
      },
      cancle(){
        this.$el.style.setProperty('transform','translateX(100%)')
    },
    confirm(){
        this.$confirm('是否保存修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          if(this.row.offline){ 
            editStroage('watermeter',this.row.deviceNumber,this.form.deviceNumber,this.form )
            for(let key in this.form){
                this.row[key]=this.form[key]
            }
            this.cancle()
          }else{//非离线设备
            let newNum,oldNum
            if(this.row.deviceType==3){
              newNum=this.form.deviceNumber
              oldNum=this.row.deviceNumber
            }else{
              newNum=this.form.id
              oldNum=this.row.id
            }
            this.$http.post('/weiXin/api/v1/deviceManager/deviceEdit',{
                deviceNumber:oldNum,
                houseNumber:this.form.houseNumber,
                newDeviceNum:newNum==oldNum?null:newNum,
                districtSite:this.form.districtSite,
                districtDetail:this.form.districtDetail,
                deviceType:this.row.deviceType
            })
            .then(res=>{
                
                if(res){
                    for(let key in this.form){
                        this.row[key]=this.form[key]
                    }
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.cancle()
                }
            })
          }
          
        }).catch(() => {
        
        })
        
    }
  },
  created(){},
  mounted(){}
}
</script>
<style  lang="less">

.edit{
  width: 100%;
  height: 100vh;
  background: #f8f8f8;
  position: fixed;
  top: 0;
  left:100%;
  display: block;
  z-index: 1000;
  transition:transform 0.3s ease-in;
  .el-form{
      width: 90%;
      margin:auto;
  }
  header{
    background: #747776;
    margin-bottom: 15px;
    >.el-button{
         color: #f8f8f8;
         margin-left: 15px;
         font-size: 15px;
    }
  }
}
</style>