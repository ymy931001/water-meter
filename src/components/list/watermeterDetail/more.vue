<template>
  <div id="more">
      <div class="menu">
        <div v-if="this.custom!==true">
            <i @click.stop="open" class="el-icon-plus"></i>
            <div :class="{showlist}" class="menuList">
                <p :class="{showlist}" class="mark"></p>
                <slot name="list"></slot>
            </div>
        </div>
        <slot v-else  name="operate"></slot>
      </div>
      <div v-if="this.custom==true" class="filt" ref="filtMenu">
        <slot name="menu" ></slot>
      </div> 
      <div :class="{show}" @click.stop="cancle()" class="moreCover"></div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{
      custom:{
          type:Boolean,
          default:false
      }
  },
  data(){
    return {
        show:false,
        showlist:false
    }
  },
  watch:{},
  computed:{},
  methods:{
      open(){
          //
          this.show=true
          this.showlist=true
          if(this.$refs.filtMenu){
              this.$refs.filtMenu.style.display="block"

          }
      },
      cancle(){
          this.show=false	
          this.showlist=false
          if(this.$refs.filtMenu){
              this.$refs.filtMenu.style.display="none"

          }
      },
  },
  created(){},
  mounted(){}
}
</script>
<style  scoped>
@keyframes opacity {
	from{
		opacity: 0;
	}
	to{
		opacity: 0.3;
	}
}

@keyframes filtPosition {
	from{
		right: -100%;
	}
	to{
		right: 0;
	}
}
.menu{
    position:relative ;
    font-size: 18px;
}
.menuList{
    position: absolute;
    right: 5px;
    border-radius: 5px;
    background: #fff;
    width: 140px;
    text-align: center;
    display: none;
    
}
.moreCover{
    width: 100vw;
	height:100vh;
	transition:opacity ease-in 0.3s;
	background: #000;
	position: fixed;
    left: 0;
    top: 0;
	display: none;
	animation:opacity 0.3s ease-in forwards;
}
.show{
	display: block;
	z-index: 20;
}
.mark{
    position: absolute;
    top: -15px;
    right: 5px;
    border: 8px solid transparent;
    border-bottom-color: #fff;
    
    width: 0;
    height: 0;

}
.showlist{
    display: block;
	z-index:50;
}
.rightmenu{
    z-index: 3000;
}
.el-icon-plus{
        font-size:25px;
        line-height: 40px;
        color:#f8f8f8;
    }
 .filt{
        position: fixed;
        background: #ececec;
        right:-100%;
        top: 0;
        width: 70%;
        height:100vh;
        z-index: 1000;
        display: none;
        animation:filtPosition 0.3s ease-in forwards;
        padding-top: 20px;
        overflow-y: scroll;
    }
</style>