<template>
    <div id="QR">
        <label class="QR" @click.stop="scanCode">
            <i class="iconfont">&#xe661;</i>
            </label>
    </div>
</template>
<script> 
import {scanCode} from '@/assets/js/wx'
export default{
    methods:{
       scanCode(){
         scanCode()   
        }
    }
}
</script>
<style scoped>
    .QR{
		position: absolute;
		width: 40px;
		height:26px;
        right: 0px;
        line-height: 30px;
		top: 50%;
        margin-top: -13px;
		text-align: center;
		border-left: 1px dotted #dcdfe6;
	}
</style>
