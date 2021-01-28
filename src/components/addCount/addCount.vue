<template>
	<div id="addCount">
		<div class="header">
			<div class="title">
				账户信息
			</div>
			<el-button type="text" class="addcount" @click="countAdd">添加账户</el-button>
		</div >
		<div class="searchAcount">
			<el-input v-model="searchFiled" placeholder="搜索账号姓名"></el-input>
			<el-button type="primary" size="mini" @click="countDate">取消</el-button>
			<el-button type="primary" size="mini" @click="searchUser">查询</el-button>
		</div>
		<div class="cloWra" ref="accountWrapper">
			<div >
				<el-table
					size="mini"
					border
					row-key="id"
					@row-click="accountClick"
					:expand-row-keys="expands"
					header-row-class-name="equipHead"
					row-class-name="equipTabel"
					:data="tableData"
					style="width: 100%">
					<el-table-column
					type="expand"
					>
					<template slot-scope="{row}">
						<el-form label-position="left" inline >
							<el-form-item label="用户id:">
								<span>{{ row.id||'暂无' }}</span>
							</el-form-item>
							<el-form-item label="邮箱:">
								<span>{{ row.email||'暂无' }}</span>
							</el-form-item>
							<el-form-item label="电话:">
								<span>{{ row.phone||'暂无' }}</span>
							</el-form-item>
						</el-form>
					</template>
					</el-table-column>
					<el-table-column 
					
					prop="userName"
					label="用户名"
					>
					</el-table-column>
					<el-table-column
					prop="name"
					label="姓名"
					>
					</el-table-column>
					<el-table-column
					label="操作"
					width="120">
					<template slot-scope={$index,row}>
						<el-button
							@click.stop="deleteRow($index,row,tableData)"
							type="text"
							size="small">
							移除
						</el-button>
						<el-button
							@click.stop="handleEdit($index,row,tableData)"
							type="text"
							size="small">
							编辑
						</el-button>
						<el-button
							@click.stop="areaAllot(row)"
							type="text"
							size="small">
							分配水务商
						</el-button>
					</template>
				</el-table-column>
				</el-table>

			</div>
		</div>

		<el-dialog
        title="编辑"
        :visible.sync="editSwitch"
        >

			<el-form :model="editData" label-position='left' class="textform"  label-width="80px" >
				<el-form-item label="账户" >
					<el-input v-model="editData.userName" placeholder="输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="电子邮箱" >
					<el-input v-model="editData.email" placeholder="请输入常用邮箱" ></el-input>
				</el-form-item>
				<el-form-item label="手机号" >
					<el-input v-model="editData.phone" placeholder="输入用户手机号" ></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" >
					<el-button @click="editSwitch = false">取 消</el-button>
					<el-button  type="primary" @click="editConfirm"> 确认</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	export default{
		data() {
			return {
				tableData: [],
				expands:[],
				accountscroll:null,
				editSwitch:false,
				editData:[],
				row:null,
				searchFiled:'',
				}
			},
		methods:{
			searchUser(){
			
				this.tableData=this.tableData.filter(val=>{
				  return val.name==this.searchFiled
				})
			},
			areaAllot(row){
				this.$router.push({
					path:'/waterMerchantList',
					query:{'userId':row.id}
				})
			},
			deleteRow(index,row,data){
					this.$confirm('是否删除该账户','提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					})
					.then(()=>{
						this.$http.get('/weiXin/api/v1/user/deleteUser',{
							id:row.id
						})
						.then(res=>{
							if(res.data.code==0){
								data.splice(index, 1);
							}else{
								this.$message({
									type:'error',
									message:'删除失败'
								})
							}
						})
						
					})
					.catch(()=>{

					})
					
				},
			handleEdit(index,row,data){

				this.editSwitch=true
				this.editData={...row}
			},
			editConfirm(){
				this.$http.post('/weiXin/api/v1/user/modifiedUser',{
					"email":this.editData.email,
					"id": this.editData.id,
					"phone": this.editData.phone,
					"username": this.editData.userName,
				},{
					'Content-Type': 'application/json; charset=UTF-8'
				},true)
				.then(res=>{
					if(res){
						this.countDate()
						this.editSwitch=false
						this.$message({
							type:'success',
							message:'修改成功'})
							
						
					}else{
						this.editSwitch=false
						
						this.$message({
							type:'error',
							message:'修改失败'
						})
					}
				})
			},
			initScroll(Obj,SCobj){
				if( !Obj ){
				Obj = new BScroll(SCobj,{
						
						scrollX:false,
						tap:true,
						eventPassthrough:"horizontal"
					})
				}else{
						Obj.refresh()    
				}
			},
			accountClick(row, event, column){
			if (this.expands.indexOf(row.id) < 0) {
					this.expands.splice(0,this.expands.length)
					this.expands.push(row.id)
				} else {
					let num =this.expands.indexOf(row.id)
					console.log(num)
					this.expands.splice(num,1)
				}
				
			},
			countAdd(){
				this.$router.push('/accountDetail')
			},
			countDate(){
				this.$http.get('/weiXin/api/v1/user/viewUser')
				.then(res=>{
					if(res.data.code==0){
						this.tableData=res.data.data.map(val=>{
							return {
								id:val.id,
								userName:val.username,
								name:val.name,
								email:val.email,
								phone:val.phone,

							}	
						})
						
					}
				})
			}
		},
		mounted(){
			this.countDate()
			this.$nextTick(()=>{
				this.initScroll(this.accountScroll,this.$refs.accountWrapper);
			});
		} ,
		activated(){
			this.countDate()
			this.$nextTick(()=>{
				this.initScroll(this.accountScroll,this.$refs.accountWrapper);
			});
		}
	}
</script>
<style lang="less">
#addCount{
	background: #fff;
	.title{
		border-bottom: 2px solid #747776;
		color: #303133;
		height: 40px;
		width: 70px;
		line-height: 40px;
		margin-left: 20px;
		padding: 0 20px;
		font-size: 15px;
	}
	.searchAcount{
		display: flex;
		justify-content: space-between;
		padding: 5px 7px;
		background: #f8f8f8;
	}
	.header{
		display: flex;
		justify-content: space-between;
	}
	.addcount{
		padding: 0 10px;
		height: 40px;
		margin-right: 20px;
	}
	.el-table__header{
		width: 100%;
	}
	.el-table__body{
		width: 100% !important;
	}
	.el-form-item{
		margin-bottom: 2px;
	}
	.el-dialog__body{
		padding: 20px  20px;
	}
	.cloWra{
		height: 70vh;
		overflow: hidden;
		>div{
			min-height: calc(100% + 5px);	
		}
	}
}	
</style>