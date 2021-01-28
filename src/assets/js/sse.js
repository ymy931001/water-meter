
export default function sseRequest  (callback){
    var url = "https://wxback.everqin.com/siteoperation/weiXin/api/v1/sse/device_event?authorization=bearer"+localStorage.getItem('access_token')
    var source = new EventSource(url)
    var Vm 
    var openLink = ()=>{
        callback()
        .then(VueEl=>{
            Vm = VueEl
        })
        .catch(()=>{
            // source.addEventListener("open", openLink,false)
        })
        // source.removeEventListener("open",openLink)
    }
    source.addEventListener("open", openLink,false)

    source.addEventListener('message', e => {
        var result =e.data.length>10&&JSON.parse(e.data)
        if(typeof result=='object'){
            Vm.$set(Vm,'sseConnect',false)
            if(result.code==0){
                Vm.$message({
                    type:"success",
                    message:"执行完毕"
                })
                Vm.refreshPage();
                source.close();
            }
        }
    }, false);
    source.addEventListener('error', function (e) {
        
        if (e.target.readyState === EventSource.CLOSED) {
            console.log('Disconnected');
        } else if (e.target.readyState === EventSource.CONNECTING) {
            // console.log(e)
            // callback()
            source.close();
        }
    }, false);
}