<template>
  <div class="waterMerchantList">
    <el-table
      class="searchResult"
      size="mini"
      border
      stripe
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      header-row-class-name="equipHead"
      row-class-name="equipTabel"
      :data="dataSource"
      style="width: 100%">
      <el-table-column
      v-if="!isSet"
      type="selection"
      fixed="left"
      width="45">
      </el-table-column>
      <el-table-column 
          prop="name"
          label="税务商名称"
          >
      </el-table-column>
      <el-table-column
          prop="linkman"
          label="联系人姓名"
          >
      </el-table-column>
      <el-table-column
      v-if="isSet"
          label="操作"
          >
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({path:'electricSet',query:{
              waterMerchantId:row.id
          }})">参数设定</el-button>
          </template>
          
      </el-table-column>
      
    </el-table>
    <el-button v-if="!isSet" type="primary" class="confirm" @click="addConfirm"> 确认</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  components:{},
  props:{},
  data(){
    return {
      dataSource:[],
      selectData:[],
      isSet:this.$route.query.set,//税务商参数跳转过来
      selectedRow:undefined
    }
  },
  watch:{
    selectedRow(data){
      var ids = data.map(num=>num.id)
      var result = []
      var res = this.dataSource.forEach((row,ind) => {
        if(ids.indexOf(row.id)>-1){
          result.push(ind)
        }
      });
      result.forEach(val=>{
        this.$refs.multipleTable.toggleRowSelection(this.dataSource[val])
      })
      
    }
  },
  computed:{},
  methods:{
    getWaterMerchantIds(id){
          return this.$http.get('/weiXin/api/v1/WaterMerchantIds/getWaterMerchantIds',{
            userId:id
          })
          .then(res=>{
              if(res){
                  return res.data.data
              }
          })
      },
    handleSelectionChange(val){
      this.selectData = val.map(sele=>sele.id);
    },
    addConfirm(){
      if(this.selectData.length>0){
        this.$http.post('/weiXin/api/v1/WaterMerchantIds/setWaterMerchantIds',{
          waterMerchantIds:this.selectData,
          userId:this.$route.query.userId
        },{
              'Content-Type': 'application/json; charset=UTF-8'
          },true)
        .then(res=>{
          if(res){
            this.$message({
              type:'success',
              message:'分配成功',
              showClose:true,
            })
          }
        })
      }
    },
  },
  created(){
    axios.all([this.getWaterMerchantIds(), !this.isSet&&this.getWaterMerchantIds(this.$route.query.userId)])
    .then(axios.spread( (acct, perms) =>{
      this.dataSource = acct
      this.$nextTick(()=>{
        this.selectedRow = perms
      })
    }));
  },
  mounted(){}
}
</script>
<style  lang="less">
  .waterMerchantList{
    padding-bottom: 50px;
    .confirm{
      width:120px;
      display: block;
      margin: 30px auto;
    }
    .el-table{
      .el-button{
        color:#5287f1;
			  cursor: pointer;
      }
    }
  }
</style>