<template>
	<div id="repairRecord">
		<header>
			<span>设备维修</span>
		</header>
		<Main>
			<div class="block">
				<el-select class="typeSlect" v-model="equipType" placeholder="设备类型">
					<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				
				<el-date-picker
					v-model="timechoice"
					format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					type="daterange"
					popper-class="timeSelect2"
					align="right"
					unlink-panels
					ref="select"
					@touchstart.native='getblur()'
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					:picker-options="pickerOptions">
				</el-date-picker>
				<div class="qr">
					<el-input
						class="idSearch"
						placeholder="输入设备编号"
						v-model="equipID"
						clearable>
					</el-input>	
					<QR/>
				</div>
				
				
				<el-row>
					<el-button type="primary" class="searchConfirm" @click="reset">重置</el-button>
					<el-button type="primary" class="searchConfirm" @click="searchbyneeds">查询</el-button>
				</el-row>
				<div class="cloWra" ref="histryWrapper">
					<el-table
						class="searchResult"
						size="mini"
						border
						v-loading="load"
						stripe
						header-row-class-name="equipHead"
						:data="tableData"
						style="width: 100%">
						<el-table-column 
							fixed
							:filters="filters"
							:filter-method="filterType"
							prop="type"
							label="设备类型"
							width="110">
						</el-table-column>
						<el-table-column
							prop="date"
							label="设备编号"
							width="100">
						</el-table-column>
						<el-table-column
							prop="message"
							label="维修信息">
						</el-table-column>
						<el-table-column
							prop="time"
							label="维修时间">
						</el-table-column>
					</el-table>
				</div>
				
			</div>
		</Main>
	</div>
</template>
<script>
const PAGESIZE=15
import BScroll from 'better-scroll'
import QR from '@/components/QR/QR.vue'
import store from '@/store/index.js'
	export default{
		computed:{
		qrId:function(){
			return this.$store.state.qrId
				}
		},
		watch:{
			qrId(newdata){
				this.equipID=newdata
			}
		},
		components:{
			QR
		},
		 data() {
		  return {
			filters:[{text: '水表', value: '水表'},{text: '无线单表', value: '无线单表'},{text: '采集器', value: '采集器'},],
			options: [{
			  value: '3',
			  label: '水表'
			}, {
			  value: '1',
			  label: '无线单表'
			}, {
			  value: '2',
			  label: '采集器'
			}],
			equipType: '',
			load:false,
			histryScroll:null,
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
			timechoice: '',
			equipID: this.$store.state.qrId,
			tableData: []
		  }
		},
		methods:{
			getblur(){
				this.$nextTick(()=>{
					this.$refs.select.$el.childNodes[1].blur()
					this.$refs.select.$el.childNodes[3].blur()
				}
					
				)
				
			},
			filterType(value,row,column){
				return row.type === value;
			},
			initScroll(Obj,SCobj){
				if( !Obj ){
					Obj = new BScroll(SCobj,{
					click:true,
					pullUpLoad:{
						threshold: -50,
						moreTxt:'加载更多',
						noMoreTxt:'没有更多数据了'
						}
					})
					let page = 1
					Obj.on('pullingUp',()=>{
						page++
						let type = this.equipType||"1,2,3"
						this.searchData(type,this.equipID,this.timechoice,page)
						.then(()=>{
							Obj.refresh()
						})
					})
				}else{
					Obj.refresh()
				}
			},
			searchbyneeds(){
			let time = this.timechoice
			let id = this.equipID
			let type = [this.equipType]
			this.searchData(type,id,time)
			// console.log(time[0])
			},
			reset(){
			this.searchData("1,2,3")
			this.timechoice=null
			this.equipID=null
			this.equipType=null
			},
			searchData(type,ID,time,page=1){
				this.load=true
				return this.$http.get('/weiXin/api/v1/deviceMend/getDeviceExceptions',{
					deviceTypes:`${type}`,
					pageNum:page,
					pageSize:PAGESIZE,
					deviceNum:ID||null,
					mendStartTime:time?time[0]:null,
					mendEndTime:time?time[1]:null
				})
				.then(res=>{
					// console.log(type)
					this.load=false
					if(res.data.code==0){
						let list = res.data.data.map(val=>{
							return {
								type:(val.deviceType==2&&'采集器')||(val.deviceType==3&&'水表')||(val.deviceType==1&&'无线单表'),
								date:val.deviceNumber,
								message:val.remark,
								time:val.mendTime
							}
						})
						if(page==1){
							this.tableData=list
						}else{
							this.tableData.push(...list)
						}
						
					}
				})
			}
		},
		mounted(){
			this.searchData("1,2,3")
			this.$nextTick(()=>{
				this.initScroll(this.histryScroll,this.$refs.histryWrapper);
			});
		}
	}
</script>
<style lang="less" scoped>
	header{
		height: 40px;
		background: #747776;
		text-align: center;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 100;
		span{
			display: inline-block;
			font-size: 16px;
			line-height: 36px;
			color: #fff;
		}
		.back{
		padding: 0 15px 0 10px;
		height: 40px;
		position: absolute;
		left: 0;
		}
	}
</style>
<style lang="less">
#repairRecord{
	.el-date-editor{
		margin-top: 10px;
		width: 320px;
	}
	.block{
		margin-top: 10px;
		text-align: center;
		.typeSlect{
			width: 320px;
			.el-input__suffix{
				right:0;
			}
		}
		.idSearch{
			width: 320px;

		}
		.qr{
        position: relative;
        margin: auto;
        margin-top:10px; 
        width: 320px;
        
		}
		.searchConfirm{
			width: 155px;
			margin-top: 10px;
		}
		.searchResult{
			padding-bottom:10px;
		}
		.cloWra{
			margin-top:10px;
			height: 55vh;
			overflow: hidden;
			
			.el-table{
				margin-bottom:130px;
			}
		}
	}
}
	.timeSelect2::-webkit-scrollbar{
		display: none;
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