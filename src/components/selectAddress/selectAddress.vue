<template>
  <div id="selectAddress" v-show="select" @click="back">
    <div class="select" @click.stop="stop">
      <div class="head">  
        <span>选择地址</span>
      </div>
      <mt-picker ref="picker" :slots="slots"  valueKey="part" @change="onValuesChange" showToolbar >
      <el-button type="text" @click="confirm">确定</el-button>  
      </mt-picker> 
    </div>
  </div>
</template>

<script>
import { Picker } from 'mint-ui';
export default {
  components:{
    MtPicker:Picker
  },
  props:{
    areaID:{
      type:Object
    }
  },
  data(){
    return {
        select:false,
        area:[],
        slots: [
          {
            flex: 1,
            values: [{id:-1,part:"请选择"}],
            defaultIndex:0,
            className: 'slot1',
            textAlign: 'center'
          },{
            divider: true,
            content: '-'
          },
          {
            flex: 1,
            values: [{id:'-1',part:" "}],
            textAlign: 'center',
            defaultIndex:0,
          }, {
            divider: true,
            content: '-'
          }, {
            flex: 1,
            values: [{id:'-1',part:" "}],
            className: 'slot3',
            textAlign: 'center',
            defaultIndex:0,
          }
        ],
        ProvinceId: '',
        ProId:'',   //回显ID
        CityId: '',
        CId:'',
        XianId: '',
        XId:''

        
    }
  },

  watch:{
    areaID:function(oldID,newID){
      console.log(oldID)
      if(oldID.pId&&oldID.cId&&oldID.iId){
        let that = this
        let area
        that.$https.all([that.researchData(oldID.pId),that.researchData(oldID.cId),that.researchData(oldID.iId)])
        .then(that.$https.spread(function (a,b,c){
            area=[a,b,c]
            
            that.$emit('reshowarea',area)
        }))
      }else{
        // this.$message({
        //   type:'error',
        //   message:'位置信息出错，请手动选择区域'
        // })
      }

        
        
    }
    
  },
  computed:{},
  methods:{
      onValuesChange(picker, values) {
          this.searchDate(1).then(result=>{
          picker.setSlotValues(0,result)
          this.ProvinceId=values[0].id
          
            })  
          .then(()=>{
            this.searchDate(values[0].id).then(result=>{
            result.unshift({
              part:' ',
              id:'-1'
            })
            picker.setSlotValues(1,result)
            this.CityId=values[1].id
            })

          })
         .then(()=>{
           this.searchDate(values[1].id).then(result=>{
           result.unshift({
              part:' ',
              id:'-1'
            })
           picker.setSlotValues(2,result)  
           this.XianId=values[2].id
           })
         })
         .then(()=>{
           this.area = values
          //  this.$emit('areaSelect',values)
         })

  
      },
      onStreetChange(picker, values){
        this.addressStreet = values[0]
        
          


			},
      show(){
          this.select=true
      },
      back(){
            this.select=false
      },
      confirm(){
        this.$emit('areaConfirm',this.area)
        this.select=false
      },
      researchData(num){
        let a = this.$http.get('/weiXin/api/v1/common/getAreaById',{id:num})
        .then(res=>{
          if(res){
            return res.data.data.district

          }
        })
        return a
      },
      stop(){

      },
      async searchDate(num){ 
      let area=[]
      let response = await this.$http.get('/weiXin/api/v1/common/getAreaByPid',{id: num})
      .then((res)=>{
        if(res){
          res.data.data.map((value,index)=>{
            area.push({
              part:value.district,
              id:value.id
            })
          })

        }
        
      })
      return area
    }
  },
  created(){

  },
  mounted(){
    // console.log(this.areaID)
    // if(this.areaID.provinceId){
      
    // }
    
  }
}
</script>
<style  lang="less">
#selectAddress{
    background: rgba(0,0,0,0.3);
    position:fixed;
    top:0;
    left:0;
    z-index: 100;
    width:100%;
    height:100vh;
    vertical-align: bottom;
    text-align: center;
    .select{
      position: absolute;
      bottom: 0;
      background: #e9e8e8;
      width: 100%;
      .head{
        padding: 0 15px;
        display: flex;
        justify-content: center;
        vertical-align: center;
        padding: 10px 0 10px 0;
        span{
          font-size: 18px;
        }
      }

      .picker{ 
      background: #fff;
      .picker-toolbar{
        height: 0;
      }
      button{
        padding: 15px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    }
    
}
</style>