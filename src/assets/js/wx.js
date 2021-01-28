import axios from './axios'
import store from '@/store/index.js'

const wxtoken=()=>{
    if(store.state.hasWxConfig) return ;
    axios.get('/weiXin/api/v1/user/getWxConfig')
    .then(res=>{
        if(res.data.code==0){
            wx.config({
                debug:false,
                appId:res.data.data.appId,
                timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
                signature: res.data.data.signature,// 必填，签名
                jsApiList: [
                    "scanQRCode"
                ] // 必填，需要使用的JS接口列表
            })
            store.commit('changeConfigStatus',true) 
        }else{
            
            // wxtoken()
        }
    })
}
const scanCode=()=>{
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
        var result = res.resultStr;
        store.commit('changeId',result.substring(result.length-10)) // 当needResult 为 1 时，扫码返回的结果
        }
    })			
}
wx.ready(function(){
    console.log(123)
});
wx.error(function(res){

});
export {
    wxtoken,
    scanCode
}