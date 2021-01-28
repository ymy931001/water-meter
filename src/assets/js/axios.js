import axios from 'axios'
import qs from 'qs'
import router from '../../router'
import {Loading, Message} from 'element-ui'
let loadinginstace; //load加载
/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 * **/
axios.interceptors.request.use(config => {
  //判断localStorage中是否存在access_token
  if (localStorage.getItem('access_token')) {
    // `${localStorage.getItem(access_token)}`
    config.headers.Authorization = `bearer${localStorage.getItem("access_token")}`;
  }
  
  // loadinginstace = Loading.service({fullscreen: true}) // 请求打开loading
  return config;
}, err => {
  Message.error({
    message: '退出登陆',
    onClose: function () {
      //关闭时的回调函数, 参数为被关闭的 message 实例
      // router.push();
    }
  })
  return Promise.resolve(err);
})


/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 **/
axios.interceptors.response.use(response => {
  // loadinginstace.close();  // 响应成功关闭loading
  return response
}, error => {
  Loading.service({fullscreen: true}).close(); 
  if(!error){
    return  Promise.reject()
  }
  if(error.response.status == 401){
        router.replace('/landing');
  }
  if(error.message.includes('timeout')){
    return Promise.reject('timeout')
  } 
  

  return Promise.reject(error.response)
});
/**
 * 状态码
 */
function statusCode(response) {
  if(response){
    switch (response.status) {
      case 401:
        Message.error({
          message: '未授权或授权失效，请重新登录',
        })
        
        break
      case 403:
        Message.error({
          message: '拒绝访问',
        })
        break
      case 404:
        Message.error({
          message: '请求地址出错',
        })
        break
      case 408:
        Message.error({
          message: '请求超时',
        })
        break
      case 500:
        Message.error({
          message: '服务器内部错误',
        })
        break
      case 200:
        return response
    }
  }else{
    console.log('服务端未响应')
  }
}
/**
 * 请求发出后检查返回的状态码,统一捕获正确和错误的状态码，正确就直接返回response,错误就自定义一个返回对象
 * @param {object} response 响应对象
 * @return {object} 响应正常就返回响应数据否则返回错误信息
 **/
function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response ) {
    if (response.status == 200) {
      
      return response
    } else{
      console.log(response)
      return statusCode(response)
    }
  }else {
   // 异常状态下，把错误信息返回去
   
    return statusCode(response)
  }
}
/**
 * 检查完状态码后需要检查后如果成功了就需要检查后端的状态码处理网络正常时后台语言返回的响应
 * @param {object} res 是后台返回的对象或者自定义的网络异常对象，不是http 响应对象
 * @return {object} 返回后台传过来的数据对象，包含code,message,data等属性，
 */
function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if(res){
    
    if(res.data.code==0){
      return res
    }else{
      Message.error({
        message: res.data.message,
      })
      return null
    }
  }
}


// 请求方式的配置
export default {
  post(url, data,head,json) {  //  post//formada格式数据需要Qs转换，json格式不需要
    return axios({
      method: 'post',
      baseURL: "/api/siteoperation",   //process.env.API_HOST
      url,
      data: json?data:qs.stringify(data),
      // timeout:3000,
      headers: head || {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
    .then(
      (response) => {
        
        return checkStatus(response)
      }
    )
    .then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params) {  // get
    return axios({
      method: 'get',
      baseURL: "/api/siteoperation", //process.env.API_HOST
      url,
      params, // get 请求时带的参数
      // timeout:3000,
      // headers: {
      //   // 'X-Requested-With': 'XMLHttpRequest'
       
      // }
    })
    .then(
      (response) => {
        return checkStatus(response)
      }
    )
    .then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  getHttp(url,params) { 
    return axios({
      method: 'get',
      url,
      params,
      // timeout:3000,
      headers:{
        Authorization:"Basic " +btoa(`app:app`),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        
      }
    })
    .then(
      (res) => {
        return checkCode(res)
      }
    )

  }
}
