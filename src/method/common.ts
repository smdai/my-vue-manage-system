export const getControlVisiableMap = (keys:any) =>{
    const retMap = new Map();
    if (keys === null || keys.length < 1){
        return retMap
    }
    let controlInfoStr = localStorage.getItem('control_info')
    if(controlInfoStr !== null && controlInfoStr.length>0 && controlInfoStr !== undefined && controlInfoStr !== "null"){
        let controlInfo = JSON.parse(controlInfoStr!)
        let controlKeys = controlInfo.map((item:any)=>item.controlKey)
        keys.forEach((item:any) => {
            if(controlKeys.includes(item)){
                retMap.set(item,true)
            }else{
                retMap.set(item,false)
            }
        })
    }
    return retMap
}