<template>
  <div class="arealist">
      <!-- <el-button @click="cancle">返回</el-button> -->
      <slot></slot>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{
      show(){
        this.$el.style.setProperty('height','80vh')
          
      },
      cancle(){
        this.$el.style.setProperty('height','0')
    },
  },
  created(){},
  mounted(){}
}
</script>
<style  lang="less">
.arealist{
  width: 100%;
  height: 0;
  overflow: hidden;
  background: #fff;
  border-top: 2px solid #e8e8e8;
  left:0;
  display: block;
  z-index: 1000;
  transition:height 0.3s ease-in-out;
  position: absolute;
  top:0;
  margin-top: 60px;
}
</style>