import axios from './axios.js'

const landing =(ev)=>{
    return new Promise(resolve=>{
        let openId=ev.$route.query.openId
        let access_token=ev.$route.query.access_token
        if(openId&&access_token){
            localStorage.setItem('access_token',access_token)
            localStorage.setItem('openId',openId)
            axios.get('/weiXin/api/v1/user/getUserInfoByAccessToken')
            .then(res=>{
                if(res.data.code==0){
                    localStorage.setItem('roleId',res.data.data.roleId)
                    // let info = JSON.stringify(res.data.data)
                    // localStorage.setItem('count',info)
                }
            })
        }
        resolve()
    })

}

export {
    landing
}