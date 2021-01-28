<template>
  <div id="equipErr">
    <div class="block" >
        <header>
            <!-- <el-button type="text">批量处理</el-button> -->
            <el-button style="color:#67c23a" type="text" @click="confirm" v-show="conFirm">维修确认</el-button>
        </header>
        <div class="cloWra" ref="errWrapper">
            <el-table
                class="searchResult"
                size="mini"
                border
                stripe
                v-loading="load"
                @selection-change="handleSelectionChange"
                header-row-class-name="equipHead"
                row-class-name="equipTabel"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                type="selection"
                fixed="left"
                width="45">
                </el-table-column>
                <el-table-column 
                    :filters="filters"
                    :filter-method="filterType"
                    prop="type"
                    label="设备类型"
                    width="85">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="设备编号"
                    width="95">
                </el-table-column>
                <el-table-column
                    prop="alarmTime"
                    label="报警时间">
                </el-table-column>
                <el-table-column
                    prop="exception"
                    label="异常原因"
                    >
                </el-table-column>
                
            </el-table>
        </div>
    </div>
                
      
  </div>
</template>

<script>

export default {
  components:{},
  props:{},
  data(){
    return {
    conFirm:false,
    filters:[{text: '水表', value: '水表'},{text: '无线单表', value: '无线单表'},{text: '采集器', value: '采集器'}],
    selected:'',
    load:false,
    errScroll:null,
    tableData: []
    }
  },
  watch:{},
  computed:{},
  methods:{
        filterType(value,row,column){
            return row.type === value;
        },
        initScroll(Obj,SCobj){
            if( !Obj ){
                var BScroll
                import('better-scroll').then(res=>{
                    BScroll = res.default
                    Obj = new BScroll(SCobj,{
                    eventPassthrough:"horizontal",
                    })
                    Obj.on('scroll',(pos)=>{
                    })
                })
            }else{
                Obj.refresh() 
            }
        },
        searchdata(type){
            
            return this.$http.get('/weiXin/api/v1/deviceMend/getDeviceExceptions',{
                deviceTypes:type,
                pageNum: 1,
                pageSize: 30,
                searchType:1
            },{
                'Content-Type': 'application/json; charset=UTF-8'
            },true)
            .then(res=>{
                if(res&&res.data.data.length>0){
                    let list = res.data.data.map(val=>{
                        return {
                            type:(val.deviceType==2&&'采集器')||(val.deviceType==3&&'水表')||(val.deviceType==1&&'无线单表'),
                            date:val.deviceNumber,
                            alarmTime:val.alarmTime,
                            exception:val.exception

                        }
                    })
                    this.tableData=[...list]

                }
            })
        },
        confirm() {
            this.$prompt('请输入维修信息', '设备维修', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
            this.$http.post('/weiXin/api/v1/deviceMend/mendDevice',{
                deviceNumbers:this.selected.map(val=>{
                    return val.date
                }),
                remark:value
            },{
                'Content-Type': 'application/json; charset=UTF-8'
            },true)
            .then(res=>{
                console.log(res)
                if(res.data.code==0){
                    this.selected.forEach((VAL,IND)=>[
                        this.tableData.forEach((val,ind)=>{
                            if(val.date==VAL.date){
                                this.tableData.splice(ind,1)
                            }
                        })
                    ])
                    
                    this.$message({
                    type: 'success',
                    message: '维修成功'
                    });
                }else{
                    this.$message({
                    type: 'error',
                    message: '维修失败'
                    });
                }
                
            })
            
        }).catch(() => {
            // this.$message({
            // type: 'info',
            // message: '取消输入'
            // });       
        });
      },
      handleSelectionChange(val) {
        
        this.multipleSelection = val;
        this.conFirm=this.multipleSelection.length>0?true:false;
        this.selected=this.multipleSelection
 
        console.log(this.selected)
      },
  },
  created(){},
  mounted(){
      this.load=true 
      this.$https.all([this.searchdata(1),this.searchdata(2),this.searchdata(3)])
        .then(this.$https.spread((a,b,c)=>{
           this.load=false
        }))
        this.$nextTick(()=>{
            this.initScroll(this.errScroll,this.$refs.errWrapper);

        });
  },
  activated(){
      this.$https.all([this.searchdata(1),this.searchdata(2),this.searchdata(3)])
        .then(this.$https.spread((a,b,c)=>{
           this.load=false
        }))
        this.$nextTick(()=>{
            this.initScroll(this.errScroll,this.$refs.errWrapper);

        });
  }
}
</script>
<style lang="less">
	#equipErr{
        background: #fff;
		.el-date-editor{
			margin-top: 20px;
			width: 320px;
		}
		.block{
            header{
                padding: 0 20px 0 20px;
                display: flex;
                justify-content: flex-end;
            }
			.idSearch{
				width: 320px;
				margin-top: 20px;
			}
			.searchConfirm{
				width: 320px;
				margin-top: 20px;
			}
			
            .cloWra{
                height: 67vh;
                overflow: hidden;
                .searchResult{
                    margin:0 0px 50px 0px;
                    min-height:calc(100% + 1px)
                }
	    	}   
		}
	}

</style>