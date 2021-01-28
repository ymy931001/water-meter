<template>
  <div id="testonlineResult">
    <section>
        <ul v-if="detail">
            <li v-for="(value, key) in detail" :key="key">
                <span>{{key}}</span>: {{value}}
            </li>
        </ul>
        <div v-else class="resultDefault">
          暂无数据...
        </div>    
    </section>    
  </div>
</template>

<script>
import store from '@/store/index.js'
export default {
  components:{},
  props:{},
  data(){
    return {
      detail:null
    }
  },
  watch:{},
  computed:{
    // testDetail:function(){
    //   return this.$store.state.testId
    // }
  },
  methods:{
    getResult(){
      if(this.$route.query.testId){
        
        this.$http.get('/weiXin/api/v1/deviceManager/selectNetworkingTest',{
          deviceNum:this.$route.query.testId
        })
        .then(res=>{
          if(res&&res.data.code==0){
            if(res.data.data.status==3){
              this.detail=JSON.parse(res.data.data.detail)

            }
          }else{
            this.$message.closeAll()
          }
        })

      }
    }
  },
  created(){},
  mounted(){
    this.getResult()
  }
}
</script>
<style lang='less' >
#testonlineResult{
  li{
    font-size: 25px;
    background: #efefef;
    margin: 5px;
    span{
      font-weight: bold;
    }
  }
  .resultDefault{
    font-size: 30px;
    height: 60px;
    line-height: 60px;
    color: #929191;
    text-align: center;
  }
}
</style>