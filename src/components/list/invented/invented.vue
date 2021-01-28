<template>
  <div id="invented">
    <div class="opera">
        <el-button size="mini" type="primary" class="add" @click="offlineSetUp">离线录入</el-button>
        <el-button size="mini" type="primary" class="add" @click="creatVirtual" >添加采集器</el-button>
    </div>
    <div class="cloWra" ref="inventWrapper">
        <div>
            <el-collapse  accordion class="elist" v-loading="freshData" v-model="activeName" @change="handleChange">
                <el-collapse-item  :name="item.id" v-for="(item,index) in listDate" :key="item.ind" >
                    <template slot="title">
                            <div class="invtitle">
                                <p>编号：{{item.id}}</p>
                                <div>
                                    <span class="replace" @click.stop="replace(item.id,item,index)">替换</span> 
                                    <span class="remove"  @click.stop="remove(item.id)" >删除</span>
                                </div> 
                            </div>
                    </template>
                    
                    <div class="item-opera">
                        <p class="tip">备注：{{item.remark}}</p>
                        
                        <el-button size="mini" type="primary" class="add" @click="addEquip">水表录入</el-button>

                        
                    </div>
                    <p style="padding-left:15px;">当前录入数量：{{item.list.length}}</p>
                    <el-table
                    :data="item.list"
                    @selection-change="handleSelectionChange"
                    :row-class-name="({row})=>row.offline&&'offline'"
                    style="width: 100%">
                        <el-table-column
                            prop="deviceNumber"
                            label="设备编号"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="houseNumber"
                            label="设备位置"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="setupDatetime"
                            label="录入时间"
                            >
                        </el-table-column>
                        <el-table-column
                        label="操作"
                        >
                        <template slot-scope="water" >
                            <div style="text-align:center" >
                                <el-button size="mini" type="text" @click="deleteWater(item.list,water.row.deviceNumber,water.row,water)">删除</el-button> <span></span>
                                <el-button size="mini" type="text" @click="$refs.edition.show(water.row)">详情</el-button>

                            </div>
                        </template>
                        </el-table-column>
                    </el-table>
                    
                </el-collapse-item>
            </el-collapse>
            <div class="origintip" v-if="this.listDate.length==0">
                <i class="el-icon-warning"></i>
                <span>您还未创建虚拟采集器,点击右上角添加创建虚拟采集器</span>
            </div>
        </div>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>请输入新的设备ID,点击确认替换成功后,该虚拟采集器将被删除</span>
        <br><br>
        <div>
            虚拟采集器ID：{{id}}
        </div>
        <div id="remarks">
            新的设备ID<el-input v-model="trueId" placeholder="请输入ID"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click ="confirm(trueId)">确 定</el-button>
        </span>
    </el-dialog>

    <edit ref="edition" ></edit>
  </div>
</template>

<script>

const PAGESIZE = 10  //每页显示数量

import BScroll from 'better-scroll'
import edit from '@/components/list/coloterManage/edit.vue'
import {removeStorage} from '@/assets/js/offline.js'
export default {
  components:{
      edit
  },
  props:{},
  data(){
    return {
        activeName:'',
        freshData:false,
        marks:"备注",
        id:'',          //当前选择的虚拟设备ID
        trueId:'',
        listDate:[],
        dialogVisible: false,
        tableData: [],
        multipleSelection: [],
        inventSCroll:null,
        data:[
            {"cityId":383,"CollectorNum":"19110722","consumerUname":"","deviceNumber":"1509800029","districtDetail":"钱江路-","districtId":3234,"districtSite":"","houseNumber":"101","latitude":30.25924446,"longitude":120.21937542,"provinceId":31,"telephone":"","type":3},
            {"cityId":383,"CollectorNum":"19110722","consumerUname":"","deviceNumber":"1509800068","districtDetail":"钱江路-","districtId":3234,"districtSite":"","houseNumber":"102","latitude":30.25924446,"longitude":120.21937542,"provinceId":31,"telephone":"","type":3}
            ]
    }
  },
  watch:{},
  computed:{
      
  },
  methods:{
      handleChange(val){
          this.id = val
      },
      handleSelectionChange(val) {    //选择水表
        this.multipleSelection = val;
      },
      addEquip(){
          this.$router.push({
              path:"/watermeter",
              query:{inventedID:this.id}
              })
      },
      offlineSetUp(){
          this.water.forEach(val=>{
              val.collectorNum = val.CollectorNum
          }) 
          this.$confirm('是否导入所有离线设备','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            })
          .then(res=>{
              if(this.water.length>0){
                  this.$http.post('/weiXin/api/v1/deviceManager/bashGeneralInstall',
                      this.water
                  ,{
                        'Content-Type': 'application/json;'
                    },true)
                  .then(res=>{
                      if(res){
                        //   removeStorage('watermeter',this.water)
                        
                          if(res.data.data){
                            localStorage.setItem('watermeter',res.data.data)
                            this.$message(
                              {type:'error',message:`${JSON.parse(res.data.data).length}个设备导入失败`}
                            )
                          }else{
                              this.$message(
                              {type:'success',message:'导入成功'}
                              )
                          }
                          
                          this.searchData()
                      }
                  })

              }else{
                  this.$message(
                        {type:'error',message:'暂无离线设备'}
                    )
              }
          })
          .catch(()=>{
              
          })
          
      },
      deleteWater(table,id,row,water){
        this.$confirm('是否删除水表 ' ,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
		})
		.then(() => {
            if(row.offline){
                removeStorage('watermeter',id)
                table.splice(water.$index,1)
                this.$message({
                type: 'success',
                message: '删除成功!'
                });
            }else{
                this.$http.get('/weiXin/api/v1/deviceMend/deleteDevice',{
                  deviceNum:id,
                  deviceType:3
                })
                .then(res=>{
                    
                    if(res){
                        table.forEach((item,ind)=>{
              
                            if(item.deviceNumber==id){
                                table.splice(ind,1)
                            }
                                
                        })
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                    }
                })

            }

            
		})
		.catch(() => {  
		})
          
      },
      replace(eid,item,index){
          this.dialogVisible = true
          this.id = eid
          this.replaceIndex = index
      },
      initScroll(Obj,SCobj){
          if( !Obj ){
           Obj = new BScroll(SCobj,{
               click:true,
               pullDownRefresh:{
                threshold: 55,
                txt:'刷新'
                },			   
            })
            Obj.on('pullingDown',()=>{
                this.searchData()
                .then(_=>{
                    Obj.refresh()
                    Obj.finishPullDown();
                })
                    
             
            })
		  }else{
			  Obj.refresh()
          }
          
        },
      installWater(waterOrign,result){ //返回失败的水表
          return this.$http.post('/weiXin/api/v1/deviceManager/bashGeneralInstall',result,{
                'Content-Type': 'application/json;'
            },true)
            .then(res=>{
                if(res){
                    if(res.data.data){
                        var errorList = JSON.parse(res.data.data)
                        errorList.forEach(e=>{
                            e.CollectorNum = this.id
                        })
                       waterOrign=waterOrign.concat(errorList)
                       localStorage.setItem('watermeter',JSON.stringify(waterOrign))
                       this.water = waterOrign
                       return  errorList
                    }else{
                        return []
                    }
                    
                }
            })
      },
      setup(){
          this.$http.get('/weiXin/api/v1/virtualDevice/replaceVirtualCollectorNum',{deviceNumber:this.trueId,virtualCollectorId:this.id})
            .then(res=>{
                if(res.data.code==0){
                    this.$message({
                            type: 'success',
                            message: "替换成功"
                        })
                    this.listDate.splice(this.replaceIndex,1)
                    this.dialogVisible=false
                    
                }else{
                    this.dialogVisible=false
                    this.$message({
                        type: 'error',
                        message:res.data.message
                        })
                }
            })
            .catch(err=>{
                this.dialogVisible=false
            })
      },
      confirm(trueId){
          if(this.water.length>0){//有离线设备
                let waterOrign =JSON.parse(JSON.stringify(this.water))//缓存原始数据
                var result = []

                waterOrign = waterOrign.filter(val=>{//获取其中该采集器下的水表
                    if(val.CollectorNum == this.id){
                        result.push(
                            {
                            ...val,
                            "collectorNum": this.trueId,
                            "type": 3,
                            'time':new Date().getTime()
                            }
                        ) 
                        return false
                    }else{
                        return true
                    }
                })
                if(result.length>0){
                    this.installWater(waterOrign,result)
                    .then(meters=>{
                        if(meters.length == 0){ //没有失败的水表
                            this.setup()
                            localStorage.setItem('watermeter',JSON.stringify(waterOrign)) //删除成功的水表并更新            
                        }else{
                            this.searchData()
                            this.$message({
                                type: 'error',
                                message: "部分水表安装失败"
                            })
                            this.dialogVisible=false
                        }
                    })

                }

          }else{
              this.setup()
          }
          
      },
      remove(id) {
        this.$confirm('是否删除虚拟机？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
              
            this.$http.get('/weiXin/api/v1/virtualDevice/deleteVirtualCollectorNum',{
                virtualCollectorId:id
                }) .then(res=>{
                if(res.data.code==0){
                    this.listDate.forEach((val,ind)=>{
                        if(val.id==id){
                            this.listDate.splice(ind,1)
                        }
                    })
                    
                }else if(res.data.code==24){
                    this.$message({
                        type:'error',
                        message:'该设备下仍挂接水表不能删除,请点击替换设备'
                    })
                }else{
                    this.$message({
                        type:'error',
                        message:'删除失败'
                    })
                }
            })
          })
          .catch(action => {
            // this.$message({
            //   type: 'info',
            //   message: action === 'cancel'
            //     ? '已取消删除'
            //     : '删除成功'
            // })
          });
      },

      creatVirtual() {
        this.$prompt('请输入备注信息', '添加采集器', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator:function(res){
                if(res==null){
                    return false
                }
            },
            inputErrorMessage:'请输入备注'
        }).then(({ value }) => {
            this.$http.get('/weiXin/api/v1/virtualDevice/getVirtualCollectorNum',{remark:value})
            .then(res=>{
                if(res.data.code==0){
                    this.listDate.push({
                        id:res.data.data,
                        remark:value,
                        list:[],
                        ind:Math.random(10)
                    })

                }else{
                    this.$message({
                        type:'info',
                        message:'添加失败'
                    })
                }
            })
        }).catch(() => {
            // this.$message({
            // type: 'info',
            // message: '取消输入'
            // });       
        });
      },
      //获取数据
      searchData(){
        this.water = localStorage.getItem('watermeter')?JSON.parse(localStorage.getItem('watermeter')):[] //缓存的离线水表数据
        return new Promise(resolve=>{
            this.freshData=true
            this.$http.get('/weiXin/api/v1/virtualDevice/getAllVirtualCollectorNum',{
                pageNum:1,
                pageSize:200,//懒得做分页
            })
            .then(res=>{
                this.freshData=false
                
                let list = res.data.data.map((val,ind)=>{
                    let list = val.list
                    this.water&&this.water.forEach(water=>{
                        if(water.CollectorNum == val.id){
                            water.offline = true
                            list.push(water)
                        }
                    })
                    return{
                    id:val.id,
                    remark:val.remark,
                    list:list,
                    ind:ind
                }
                    
                })
                this.listDate=list
                
                resolve()
            })
        })
      },
  },
  created(){
      this.searchData();
  },
  mounted(){
      
      this.$nextTick(()=>{
            this.initScroll(this.inventScroll,this.$refs.inventWrapper);
        });
  }
}
</script>
<style  lang="less">

    #invented{
        .cloWra{
            height: 78vh;
            overflow:hidden;
            >div{
                min-height: calc(100% + 1px)
            }
        }
        .elist{
            margin-bottom: 50px;
            .el-collapse-item__header{
                height: 40px;
                line-height: 40px;
                display: flex;
                justify-content: space-between;
                .invtitle{
                    display: flex;
                    justify-content: space-between;
                    padding:0 15px;
                    width: 90%;
                    order: -1;
                    .remove{
                        color: #b4aeae;
                        margin: 15px 40px 0 15px;
                        height: 15px;
                        padding-left:  15px;
                        border-left: 1px solid #b8b3b3;
                    }
                    .replace{
                        color: #FC5B3B;
                        margin: 15px 0px 0 15px;
                        height: 15px;
                        padding-left:  15px;
                    }
                    
                }   
            }
            .offline{
                color: red;
            }
                
        }
        .opera{
                padding: 0 20px 10px 20px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                button{
                    border:0;
                }
                .add{
                    background: #FC5B3B;
                }
            }
        .item-opera{
            display: flex;
            justify-content: space-between;
            margin: 0 15px;
            .tip{
                line-height: 25px;
                text-align: left;
                width: 40%;
                white-space:pre-wrap;
                word-wrap : break-word ;
                overflow: hidden ;
                // padding:0 20px 10px  15px;
                
            }
            button{
                
            }
        }
        .origintip{
            margin: 20px;
            text-align: center;
            font-size:19px;/* no*/ 
        }
        .el-collapse-item__content{
            .opera{
                margin-top: 20px;
                padding: 0 20px 0 20px;
                display: flex;
                justify-content: space-between;
                button{
                    border:0;
                }
                .add{
                    background: #FC5B3B;
                }
            }
        }
        
    }

</style>