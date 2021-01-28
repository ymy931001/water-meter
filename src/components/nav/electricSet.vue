<template>
  <div class="electricSet">
        <!-- <div slot="menu" class="elecParams" > -->
            <el-form :rules="rules" :model="elecForm" ref="elecForm">
                <el-form-item prop="param1" label="采集器电压">
                    <el-input placeholder="采集器电压" v-model="elecForm.param1"></el-input><span class="company">伏</span>
                </el-form-item>
                <el-form-item prop="param2" label="采集器信号强度">
                    <el-input-number placeholder="采集器信号强度" v-model="elecForm.param2" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item prop="param3" label="无线单表信号强度">
                    <el-input-number placeholder="无线单表信号强度" v-model="elecForm.param3" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item prop="param4" label="无线单表电压">
                    <el-input placeholder="无线单表电压" v-model="elecForm.param4"></el-input><span class="company">伏</span>
                </el-form-item>
                <el-form-item prop="param5" label="上报间隔天数" >
                    <el-input-number placeholder="上报间隔天数" v-model="elecForm.param5" :min="0" ></el-input-number><span style="position: absolute;right: 50px;z-index: 1000;">天</span>
                </el-form-item>
                
                
                
                
                <el-button type="primary" class="elecConfirm" @click="elecConfirm">设定</el-button>

            </el-form>
        <!-- </div> -->
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        elecForm:{
            param1:'',
            param2:'',
            param3:'',
            param4:'',
            param5:'',
        },
        rules:{
            param1:[{required: true,message:'请输入值'}],
            param2:[{type:'integer',message:'请输入整数',required: true}],
            param3:[{type:'integer',message:'请输入整数',required: true}],
            param4:[{required: true,message:'请输入值'}],
            param5:[{required: true,message:'请输入值'}],
        },
    }
  },
  watch:{},
  computed:{},
  methods:{
      elecConfirm(){
        this.$refs.elecForm.validate((valid) => {
            if (valid) {
                this.$confirm('是否保存修改?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(()=>{
                    this.$http.post('/weiXin/api/v1/thresholdValue/set',{
                    waterMerchantId:this.$route.query.waterMerchantId,
                    cVoltageThreshold:+this.elecForm.param1,
                    cRssiThreshold:+this.elecForm.param2,
                    wRssiThreshold:+this.elecForm.param3,
                    wVoltageThreshold:+this.elecForm.param4,
                    wOfflineInterval:this.elecForm.param5*24*3600,
                    },{'Content-Type': 'application/json; charset=UTF-8'},true)
                    .then(res=>{
                        if(res){
                            this.$message({
                                type:"success",
                                message:'修改成功'
                            })
                            this.$router.go(-1)
                        }
                    })

                })
                .catch(()=>{
                    // this.$message({
                    //     type:"info",
                    //     message:'取消修改'
                    // })
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        })
          
      },
      elecGet(){
          this.$http.get('/weiXin/api/v1/thresholdValue/get',{
              waterMerchantId:this.$route.query.waterMerchantId,
          })
          .then(res=>{
              if(res&&res.data.data){
                    this.elecForm.param1=res.data.data.cVoltageThreshold
                    this.elecForm.param2=res.data.data.cRssiThreshold
                    this.elecForm.param3=res.data.data.wRssiThreshold
                    this.elecForm.param4=res.data.data.wVoltageThreshold
                    this.elecForm.param5=res.data.data.wOfflineInterval
              }
          })
      }
  },
  created(){},
  mounted(){
      this.elecGet()
  }
}
</script>
<style  lang="less">
.electricSet{

    padding: 0 10px;
    padding-bottom: 150px;
    // .el-form-item{
    //     margin-bottom: 10px;
    // }
    input{
        // margin: 5px 0;
    }
    .elecConfirm{
        width: 80%;
        margin: 0 auto;
        display: block;
        margin-top: 50px;
    }
    .company{
        position: absolute;
        right: 10px;
        z-index: 1000;
    }
    .el-form{
        .el-form-item{
            margin-bottom: 10px;
        }
        .el-input-number{
            width: 100%;
        }
        .el-input{
            
        }    
    }
}
</style>