<template>
  <div id="equipMain">
    <Main>
        
        <div class="block">
           
             <li>
                <div>
                    <i class="iconfont">&#xec67;</i>
                    <span>
                        无线单表
                    </span>
                </div>
                <p>数量：{{single}}</p>
             </li>
             <li>
                <div>
                    <i class="iconfont">&#xe602;</i>
                    <span>
                        采集器
                    </span>
                </div>                 
                <p>数量：{{collector}}</p>   
             </li>
             <!-- <li>
                <i class="iconfont">&#xeb59;</i>
                <span>
                    水表
                </span>
                <span></span>       
             </li> -->
            
        </div>
    </Main>  
  </div>
</template>

<script>
export default {
  components:{
  },
  props:{},
  data(){
    return{
        collector:'',
        single:'',
        }
    },
    methods:{
        getdata(type){
            
            this.$http.post('/weiXin/api/v1/deviceManager/getListDeviceBySearch',{
                "collectorSearchField":null,
                "pageNum": null,
                "pageSize": null,
                "searchField":null,
                "type": type,},{
                'Content-Type': 'application/json;'
            },true)
            .then(res=>{
                if(res){
                    let num = res.data.data.count
                    if(type==2){
                        this.collector=num
                    }
                    if(type==1){
                        this.single=num
                    }
                }
                
            })
            .catch(err=>{
            })

            
            
              
            
        }


     
    },
  computed:{
    },
    watch:{
        
    },
  created(){},
  mounted(){
      this.getdata(1)
      this.getdata(2)
  },
  destroyed() {
  },
}
</script>

<style lang="less">
#equipMain{
    .block{
        
        li{
            
            background: #fff;
            margin: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
                height: 50px;
                display: flex;
                align-items: center;
                i{
                    color: #6bbcff;
                    font-size: 40px;
                    margin:0 10px;
                    display: inline;
                }
                span{
                    font-size: 15px;
                    color: #606266;
                }
            }
            p{
                margin-right: 20px;
                font-size: 15px;
            }
        }
    }

}

</style>