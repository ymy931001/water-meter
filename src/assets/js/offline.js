import { Message} from 'element-ui'

var offline=(type,data)=>{
    var time = new Date().getTime()
    if(localStorage.getItem(type)){
        let oldArray=JSON.parse(localStorage.getItem(type))
        oldArray.push({
                time:time,
               ...data
            })
        localStorage.setItem(type,
            JSON.stringify(
                oldArray
            )
                
        )
    }else{
        localStorage.setItem(type,
            JSON.stringify(
                [{
                    time:time,
                    ...data
                }])
            ) 	
        
    }
    Message.error({
        message:'信号较差，录入信息已缓存',
    })
}
// 删除的类型及设备id
var removeStorage=(type,id)=>{
    let collectorOffline=JSON.parse(localStorage.getItem(type))
    if(toString.call(id) == '[object Array]'){
        id.forEach(water=>{
            let index = collectorOffline.findIndex(val=>val.deviceNumber==water.deviceNumber)
            
            if(index>-1){
                collectorOffline.splice(index,1)
            }
        })
    }else{
        if(collectorOffline){
            let index = collectorOffline.findIndex(val=>val.deviceNumber==id)
            if(index>-1){
                collectorOffline.splice(index,1)
                
            }
    
        }

    }
    localStorage.setItem(type,JSON.stringify(collectorOffline))
}
//修改设备信息

var editStroage = (type,oid,nid,data)=>{
    let collectorOffline=JSON.parse(localStorage.getItem(type))
    if(collectorOffline){
        let index = collectorOffline.findIndex(val=>val.deviceNumber==oid)
        if(index>-1){
            
            collectorOffline[index] = data
            localStorage.setItem(type,JSON.stringify(collectorOffline))
        }
    }
}
export  {
        offline,
        removeStorage,
        editStroage
    }
