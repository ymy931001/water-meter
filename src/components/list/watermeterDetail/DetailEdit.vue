<template>
  <div id="DetailEdit" >
    <header>
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-arrow-left"  @click="cancle" >返回</el-button>
        </el-col>
        <el-col :span="6" class="title">{{this.title}}</el-col>
        <el-col :span="4">
          <slot name="operation"></slot>
        </el-col> 
      </el-row>
    </header>
    <section>
      <slot name="content"></slot>
    </section>
  </div>
</template>

<script>
export default {
  components:{},
  props:{
    title:{
      type:String,
      default:"title"
    }

  },
  data(){
    return {
    }
  },
 
  watch:{},
  computed:{},
  methods:{
    cancle(){
      this.$el.style.display="none"
    }
  },
  created(){},
  mounted(){}
}
</script>
<style  lang="less">
@keyframes editPosition {
	from{
		right: -100%;
	}
	to{
		right: 0;
	}
}
#DetailEdit{
  width: 100%;
  height: 100vh;
  background: #f8f8f8;
  position: fixed;
  top: 0;
  right:100%;
  display: none;
  z-index: 1000;
  animation:editPosition 0.3s ease-in forwards;
  header{
    background: #747776;
    .title{
      font-size: 15px;
      color: #f8f8f8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>