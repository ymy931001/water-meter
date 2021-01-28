<template>
  <div class="areaList">
      <div class="area-select">
        <div class="province">
            <p>选择省</p>
            
                <div class="province-item" ref="provScroll">
                    <div>
                        <li v-for="item in province" :key="item.id" @click="getCity(item.id)" >
                            <el-badge :value="manageArea.filter(val=>val.oid==item.id).length" :hidden="!manageArea.filter(val=>val.oid==item.id).length>0">
                            {{item.district}}
                            </el-badge>
                            
                        </li>
                    </div>
                </div>


        </div>
        <div class="district">
            <div class="clear-area">
                <el-button @click="clearArea">清空</el-button>
            </div>
            <div v-show="isSelect" class="city" ref="cityScroll">
                <div >
                    <el-button v-for="item in city" :key="item.id" @click="getArea(item.id,item.pid)">
                        <el-badge :value="manageArea.filter(val=>val.pid==item.id).length" :hidden="!manageArea.filter(val=>val.pid==item.id).length>0">
                            {{item.district}}
                        </el-badge>
                    </el-button>

                </div>
            </div>
            <div v-show="areaList.length>0" class="area-list" > 
                
                <div class="area" ref="areaScroll">
                    <div>
                        <label :for="item.id"  v-for="item in areaList" :key="item.id">
                            <el-row class="areaitem" type="flex" justify="space-between" align="middle">
                                
                                <el-col :span="20">
                                    {{item.district}}
                                </el-col>   
                                <el-col :span="3">
                                    <input type="checkbox" v-model="manageArea"  :id="item.id" :value="{id:item.id,pid:item.pid,oid:item.oid}">
                                    <div class="checklabel"></div>
                                </el-col>
                                
                            </el-row> 
                        </label>

                    </div>

                </div>
                <div class="area-confirm">
                    <el-button @click="commit">确定</el-button>
                </div>

            </div>

        </div>
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
        areaList:[],
        manageArea:[],
        province:[],
        city:[],
        provinceId:'',
        cityId:'',
        isSelect:false
    }
  },
  watch:{
      manageArea(data){
          console.log(data)
      }
  },
  computed:{},
  methods:{
      initScroll(SCobj){
            new BScroll(SCobj,{
                scrollY:true,
                click:true,
            })
		},
      getArea(id,pid){
          this.cityId=id
          this.$http.get('/weiXin/api/v1/common/getAreaByPid',{
              id:id
          })
          .then(res=>{
              if(res){
                  this.areaList=res.data.data.map(val=>{
                      return {
                          ...val,oid:pid
                      }
                  })
                  this.isSelect=false
              }
          })
      },
      getProvince(){
          this.$http.get('/weiXin/api/v1/common/getAreaByPid',{
              id:1
          })
          .then(res=>{
              if(res){
                  this.province=res.data.data
                  
              }
          })
      },
      getCity(id,ev){
        //   ev.path[0].focus()
          this.provinceId=id
          this.$http.get('/weiXin/api/v1/common/getAreaByPid',{
              id:id
          })
          .then(res=>{
              if(res){
                  this.city=res.data.data
                  this.isSelect=true
              }
          })
      },
      clearArea(){
          this.manageArea=[]
          this.commit()
      },
      commit(){
          this.$http.post('/weiXin/api/v1/user/managerSetManagerAreas',{
              "leadSubordinatesList": 
                this.manageArea.map(val=>{
                    return{
                    "cityId": val.pid,
                    "districtId": val.id,
                    "provinceId": val.oid,
                    }
                })
              ,
              "userId": this.$route.query.userId
          },{
              'Content-Type': 'application/json'
          },true)
          .then(res=>{
              if(res){
                  this.$router.go(-1)
              }
          })
      },
      getUserIfo(){
          this.$http.get('/weiXin/api/v1/user/selectLeadSubordinatesByUserId',{
              userId:this.$route.query.userId
          })
          .then(res=>{
              if(res){
                  this.manageArea=res.data.data.map(val=>{
                      return{
                          id:val.districtId,
                          pid:val.cityId,
                          oid:val.provinceId
                      }
                  })
              }
          })
      },
      getWaterMerchantIds(){
          this.$http.get('/weiXin/api/v1/WaterMerchantIds/getWaterMerchantIds')
          .then(res=>{
              if(res){
                  var value =res.data.data.map(link=>{
                      return {
                          id:link.districtId,
                          pid:link.cityId,
                          oid:link.provinceId
                      }
                  }) 
                  
                this.manageArea = this.manageArea.concat(value)
              }
          })
      }
  },
  created(){
      this.getProvince()
      this.getUserIfo()
      this.getWaterMerchantIds()
  },
  mounted(){
      
      this.initScroll(this.$refs.provScroll)
      this.initScroll(this.$refs.cityScroll)
      this.initScroll(this.$refs.areaScroll)
  }
}
</script>
<style  lang="less">
.areaList{
    
    margin-top: 10px;
    .area-select{
        display: flex;
        height: 85vh;
        .el-badge__content{
            right: 0;
        }
        .province{
            flex-shrink:0;
            width: 150px;
            display: flex;
            flex-direction: column;
            >p{
                text-align: center;
                font-weight: bold;
                font-size: 15px;
            }
        }
        .province-item{
            
            flex: 1;
            overflow: scroll;
            width: 100%;
            
            >div{
                min-height:calc(100% + 1px) ;
                
            }
            li{
                padding: 10px 2px;
                text-align: center;
                cursor: pointer;
            }
            
            // li:focus{
            //     color: #686b6a;
            //     background: #d5dbd9;
            // }
            // li:active{
            //     color: #686b6a;
            //     background: #d5dbd9;
            // }
            
            
        }
        .district{
            width: 100%;
            
            position: relative;
            display: flex;
            flex-direction: column;
            .clear-area{
                width: 100%;
                button{
                    width: 80%;
                    display: block;
                    margin: auto;
                    padding: 5px;
                }
            }
            .city{
                overflow-y:scroll;
                position: absolute;
                top: 40px;
                width: 100%;
                height: 94%;
                z-index: 500;
                background: #f8f8f8;
                >div{
                    width: 100%;
                    min-height: calc(100% + 1px);
                    .el-button{
                        height: 40px;
                        margin: 5px  ;
                        width: 45%;
                    }
                }
            }
            .area-list{
                height:100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .area-confirm{
                
                width: 100%;
                button{
                    width: 80%;
                    margin: auto;
                    display: block;

                }
            }
        }
    }
    .area{
        width: 100%;
        background: #f8f8f8;
        overflow-y: scroll;
        >div{
            min-height: calc(100% + 1px)
        }
    }
    .areaitem{
        border:1px solid #f8f8f8;
        margin: 5px 15px;
        border-radius: 5px;
        cursor:pointer;
        background: #f8f8f8;
        color: rgb(134, 134, 134);
        padding: 5px 0;
        .checklabel{
            position: relative;
            border-radius: 50%;
            width: 20px;
            height:20px;
            background: #fff;
        }
        input[type="checkbox"]{
            display: none;
        }
        input[type="checkbox"]:checked + .checklabel::after{
            position: absolute;
            top: -3px;
            right: 2px;
            content: "\2714";
            font-size: 20px;
            color: rgb(49, 135, 247)
        }
    }
    .areaitem:hover{
        
            color: #686b6a;
            background: #d5dbd9;
        
    }
    // .arealist:active{
    //     background:rgb(77, 149, 243)
    // }
    .areaTitle{
        padding: 0;
        padding-top: 10px;
        .el-col{
            text-align: right;
            button{
                margin-right: 15px;
            }
        }
    }
    .areaMenu{
        height: 60vh;
        overflow: scroll;
    }
    
}
</style>