<template>
  <div id="app">
    <keep-alive>
			<router-view    v-if="$route.meta.keep_alive"></router-view>
		</keep-alive>
		<router-view    v-if="!$route.meta.keep_alive"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted(){
			
		},
}
</script>

<style>
#app::-webkit-scrollbar{
  display: none;
 
}
#app{
   height: 100vh;
  background:#f8f8f8;
}
*{
	margin: 0;
	padding: 0;
}
.el-message-box{
  width: 8rem !important;
}
.el-dialog{
	width: 8rem !important;
}
.qr{
    position: relative;
    margin: auto;
    width: 320px;
    line-height: 40px;
}
li{
    list-style: none;
  }
.el-table{
  font-size: 17px !important;
}
.el-button{
  font-size:17px !important;
}
.block{
  font-size:17px !important;
}
.el-autocomplete-suggestion__wrap{
  max-height: 170px!important;
}
</style>
