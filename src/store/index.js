import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

const state = {
    qrId:null,
    testId:null,
    historytimeChoice:null,
    hasWxConfig:false
}
const mutations={
    changeId(state,res){
        state.qrId=res
    },
    changetestId(state,res){
        state.testId=res
    },
    changehistorytimeChoice(state,res){   //查询历史数据选择的时间
        state.historytimeChoice=res
    },
    changeConfigStatus(state,res){
        state.hasWxConfig=res
    }
}
export default new vuex.Store({
    state,
    mutations

    
})