<template>
  <div id="replaceCollector">
		<div class="block">
		<div class="qr">
			<el-input
				class="idSearch"
				placeholder="输入或扫描设备编号"
				v-model="equipId"
				>
			</el-input>
			<QR/>	
		</div>
	  
	  <el-row>
		<el-button type="primary" class="searchConfirm" @click="searchData">查询</el-button>
	  </el-row>
	  
	  <el-table
		  class="searchResult"
		  size="mini"
		  border
		  stripe
			@cell-click="replaceId"
		  header-row-class-name="equipHead"
		  row-class-name="equipTabel"
		  :data="tableData"
		  style="width: 100%">
		  <el-table-column
			  prop="id"
			  label="设备编号"
			  width="100">
		  </el-table-column>
		  <el-table-column
			  prop="address"
			  label="设备位置">
		  </el-table-column>
		  		  <el-table-column
			  prop="typename"
			  label="设备类型">
		  </el-table-column>
	  </el-table>
			
		</div>
  </div>
</template>

<script>
import QR from '@/components/QR/QR.vue'
import store from '@/store/index.js'

const typelist={
	1:"无线单表",
	2:'采集器',
	3:'普通水表',
}
export default {
  components:{
		QR
	},
  props:{},
  data(){
    return {
		equipId:'',
		tableData: []
    }
  },
computed:{
		qrId:function(){
		return this.$store.state.qrId
			}
		},
	watch:{
		qrId(newdata){
			this.equipId=newdata
		}
	},
  methods:{
		replaceId(row, column, cell, event){
		  this.$router.push({
				path:'/replace',
				query:{collectorId:row.id,type:row.type}
			})
		},
		searchData(){
			if(this.equipId){
				this.$http.get('/weiXin/api/v1/deviceManager/getDeviceByDeviceNum',{deviceNumber:this.equipId})
				.then(res=>{
					if(res){
						let cont= []
						let Obj = res.data.data[0]
						cont.push({
							id:Obj.deviceNumber,
							address:Obj.completeDistrict,
							type:Obj.deviceType,
							typename:typelist[Obj.deviceType]
						})
						this.tableData=cont
						
					}
				})

			}
		}
	},
  created(){},
  mounted(){}
}
</script>
<style  lang="less">
#replaceCollector{
	.block{
		text-align: center;
		.idSearch{
				width: 320px;
		}
		.qr{
			position: relative;
			width: 320px;
			margin: auto;
			line-height: 40px;
		}
		.searchConfirm{
				width: 320px;
				margin-top: 20px;
				margin-bottom: 20px;
			}
	}
}
</style>