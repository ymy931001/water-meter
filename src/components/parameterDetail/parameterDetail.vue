<template>
  <div id="parameterDetail">
     <el-table
        class="searchResult"
        size="mini"
        border
        stripe
        header-row-class-name="equipHead"
        row-class-name="equipTabel"
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="para"
            label="参数"
            width="100">
        </el-table-column>
        <el-table-column
            prop="number"
            label="数值">
        </el-table-column>
    </el-table>
      
      
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        tableData: [{
                para: 'k1111',
                number: '某某小区1'
                }]
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){}
}
</script>
<style  lang="less">
#parameterDetail{
			// margin-top: 20px;
			// text-align: center;
			.idSearch{
				width: 320px;
				margin-top: 20px;
			}
			.searchConfirm{
				width: 320px;
				margin-top: 20px;
            }
			.searchResult{
				margin:0px 0px 50px 0px
            }
            .el-tabs__nav{
                margin-left: 28px;
            }
		}
</style>