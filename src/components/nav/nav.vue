<template>
  <div id="nav">
      <div class="nav-item">
        <el-row slot="operate" type="flex" justify="space-between" align="middle" >
            <span class="title">欢迎登陆恒信水表管理系统</span>
            <!-- <el-col :span="6">
                <p>区域选择</p>
            </el-col>
            <el-col :span="16">
                <p>已选择{{manageArea.find(val=>val=='全部')?manageArea.length-1:manageArea.length}}个区域</p>
            </el-col>
            <el-col  :span="4" @click.native="selectArea">
                <i  :class="isselect?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
            </el-col>
            <arealist ref="arealist">
                <div>
                    <el-row  class="areaTitle" type="flex" justify="space-between" align="middle">
                        <el-col :span="24"><el-button  @click="areaSelected">确认</el-button></el-col>
                    </el-row>
                    <el-row  justify="center" class="areaMenu">
                        <label for="all"  >
                            <el-row class="areaitem" type="flex" justify="space-between" align="middle">
                                
                                <el-col :span="20">
                                    全部
                                </el-col>   
                                <el-col :span="3">
                                    <input type="checkbox"  id="all" @click="checkAll($event)" value="全部">
                                    <div class="checklabel"></div>
                                </el-col>
                                
                            </el-row> 
                        </label>
                        <label :for="item.districtId"  v-for="item in areaitem" :key="item.districtId">
                            <el-row class="areaitem" type="flex" justify="space-between" align="middle">
                                
                                <el-col :span="20">
                                    {{item.fullName}}
                                </el-col>   
                                <el-col :span="3">
                                    <input type="checkbox" v-model="manageArea"  :id="item.districtId" :value="item">
                                    <div class="checklabel"></div>
                                </el-col>
                                
                            </el-row> 
                        </label>

                    </el-row>
                </div>
            </arealist> -->
        </el-row>
      </div>
      <div class="nav-item">
          <p>设备管理</p>
          <ul>
              <li @click="$router.push('/coloterManage')">
              <i class="iconfont">&#xe602;</i>
              <p>采集器</p>
              
              </li>
              <li @click="$router.push('/invented')">
              <i class="iconfont">&#xe602;</i>
              <p>虚拟采集器</p>
              
              </li>
              <li @click="$router.push('/singlemeter')">
              <i class="iconfont">&#xec67;</i>
              <p>无线单表</p>
              
              </li>
              <li @click="$router.push('/collectorlist')">
              <i class="iconfont">&#xe66c;</i>
              <p>地图概览</p>
              </li>
              <li @click="$router.push('/replaceCollector')">
              <i class="iconfont">&#xe600;</i>
              <p>设备替换</p>
              
              </li>
              <li @click="$router.push('/textonline')">
              <i class="iconfont">&#xe606;</i>
              <p>联网测试</p>
              
              </li>
              <li @click="$router.push('/waterMerchantList?set=true')" v-if="roleId==4">
                <i class="iconfont">&#xe604;</i>
                <p>水务商参数</p>
              </li>
              <li @click="$router.push('/offline')">
                <i class="iconfont">&#xe614;</i>
                <p>离线待安装</p>
              
              </li>
          </ul>
      </div>
      <div class="nav-item" v-if="roleId==4">
          <p>权限</p>
          <ul>
              <li @click="$router.push('/addCount')" >
              <i class="iconfont">&#xe63d;</i>
              <p>账户管理</p>
              
              </li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
          </ul>
      </div>
  </div>
</template>

<script>

import more from '@/components/list/watermeterDetail/more.vue'
import {landing} from '@/assets/js/land.js'
import { setTimeout } from 'timers';
import arealist from './arealist.vue'

export default {
  components:{
      more,
      arealist 
  },
  props:{},
  data(){
    return {
        areaitem:[],
        manageArea:[],
        roleId:localStorage.getItem('roleId'),
        isselect:true
    }
  },
  watch:{
      manageArea:function(data){
      
      }
  },
  computed:{},
  methods:{
      checkAll(e){
          if(e.target.checked){
              this.manageArea=this.areaitem
          }else{
              this.manageArea=[]
          }
      },
      selectArea(){
          if(this.isselect){
            this.$refs.arealist.show()
          }else{
            this.$refs.arealist.cancle()  
          }
          this.isselect=!this.isselect
      },
      setElec(){
          this.$refs.elecLimit.open()
      },
      //获取管理区域
      getmanageArea(){
        this.$http.get('/weiXin/api/v1/leadSubordinates/getManagerAreas')
        .then(res=>{
            if(res){
                this.areaitem=res.data.data
                this.manageArea=res.data.data.filter(val=>val.status)
            }
        })
      },
      areaSelected(){
              let array=[]
              for(let val of this.manageArea){
                  array.push({
                        "cityId": val.cityId,
                        "districtId": val.districtId,
                        "provinceId": val.provinceId
                  })
              }
              let all=this.manageArea.find(val=>val=="全部")
              this.$http.post('/weiXin/api/v1/leadSubordinates/setManagerAreas',
                    array
              ,{
                  'Content-Type': 'application/json'
              },true)
              .then(res=>{
                  if(res){
                      this.$refs.arealist.cancle()
                       
                  }
              })

          
      },
      

  },
  created(){
  },
  mounted(){
    landing(this)
    .then(()=>{
        // this.getmanageArea()
        this.role=localStorage.getItem('roleId')
    })
      
  },
  activated(){
    // this.isselect=true
    // this.$refs.arealist.cancle()
    // this.getmanageArea()
    this.role=localStorage.getItem('roleId')
  }
}
</script>
<style  lang="less">
#nav{
    
    background:rgb(248, 248, 248);
    .nav-item{
        background: #fff;
        margin-bottom: 15px;
        padding: 10px 0;
        font:  18px Arial;
        .title{
            display: block;
            margin: auto;
            color: #666;
        }
        .el-row{
            padding: 10px 20px;
            p{
                padding-bottom: 10px;
            }
        }
        >p{
            padding-bottom: 10px;
            margin: 0 20px;
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            justify-content: start;
        }
        li{
            list-style: none;
            text-align: center;
            display: inline-block;
            width: 25%;
            >.iconfont{
                font-size: 25px;
                color: rgb(107, 188, 255)
            }
        }
        .areaitem{
            text-align: center;
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
}

</style>