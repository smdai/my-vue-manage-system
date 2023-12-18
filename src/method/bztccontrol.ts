const getControlVisiable = (controlKey: string) => {
    if (controlKey === null || controlKey.length < 1) {
        return false
    }
    let controlInfoStr = localStorage.getItem('control_info')
    if (controlInfoStr !== null && controlInfoStr.length > 0 && controlInfoStr !== undefined && controlInfoStr !== "null") {
        let controlInfo = JSON.parse(controlInfoStr!)
        let controlKeys = controlInfo.map((item: any) => item.controlKey)
        if (controlKeys.includes(controlKey)) {
            return true
        } else {
            return false
        }
    }
};
export default getControlVisiable;