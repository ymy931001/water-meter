<template>
  <div id="selectTime">
    <el-row  type="flex" >  
        <el-col :span="20">
            <el-date-picker
                v-model="timechoice"
                :editable="false"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                popper-class="timeSelect2"
                align="right"
                unlink-panels
                ref="select"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="pickerOptions">
            </el-date-picker>
        </el-col>
        <el-col :span="4">
            <el-button class="search" @click="searchHistory">查询</el-button>
        </el-col> 
    </el-row>
    
  </div>
</template>

<script>
import store from '@/store/index.js'
export default {
  components:{},
  props:{},
  data(){
    return {
        timechoice: '',
        pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        },
    }
  },
  watch:{},
  computed:{},
  methods:{
      searchHistory(){
          this.$store.commit('changehistorytimeChoice',this.timechoice)
      }
  },
  created(){},
  mounted(){}
}
</script>
<style lang="less" >
#selectTime{
	.el-date-editor{
        width: 300px;
    }
    .search{
    width: 100%;
    margin-left: 5px;
    padding: 0;
    height: 100%;
    }
}
.timeSelect2{
		 width: 320px !important;
		 overflow: scroll;
		 height: 400px;
		.el-picker-panel__sidebar{
			width: 95px;
			border: 0;
			height: 100%;
		}
		.el-picker-panel__body{
		min-width: 0 !important;
		margin-left: 95px !important;
		border-left: 1px solid #e4e4e4;
		}
		.el-date-range-picker__content{
			width: 100%;
			margin-right: 30px;
			padding: 0;
		}
		.is-left{
			border: 0;
		}
	}

</style>