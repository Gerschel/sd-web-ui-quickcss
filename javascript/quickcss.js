/*function quickcssPrep(){
    //get sheet
    var quickcssSheet = document.documentElement.querySelector("gradio-app").shadowRoot.querySelector("style").sheet
    //get as rules
    var quickcssCssr = quickcssSheet.cssRules
    //convert to array to for finding index
    var quickcssCssrArray = Array.from(quickcssCssr)
    //use custom target
    var quickcssTarget = quickcssCssrArray.find( item => item.cssText.includes("quickcss_target"))
    var quickcssTargetIndex = quickcssCssrArray.indexOf(quickcssTarget)
}

function quickcssRuleSwap(cssRule, cssTargetIndex){
    //Delete rule at
    window.quickcssSheet.deleteRule(cssTargetIndex)
    //insert (as in add)
    window.quickcssSheet.insertRule(cssRule, cssTargetIndex)
}
*/
function quickcssFormatRule(val, ele, colorsSize){
    //async  is not needed, just trying to debug some error from colorpicker
    console.log(ele)
    ele = parseInt(ele)
    //get sheet
    var quickcssSheet =  document.documentElement.querySelector("gradio-app").shadowRoot.querySelector("style").sheet
    //get as rules
    var quickcssCssr = quickcssSheet.cssRules
    //convert to array to for finding index
    var quickcssCssrArray = Array.from(quickcssCssr)
    //use custom target
    var quickcssTarget =  quickcssCssrArray.find( item => item.cssText.includes("quickcss_target"))
    var quickcssTargetIndex =  quickcssCssrArray.indexOf(quickcssTarget)
    var quickcssRuleAsString =  quickcssCssr[quickcssTargetIndex].cssText.toString()
    var quickcssRuleAsString =  quickcssRuleAsString.slice(quickcssRuleAsString.indexOf("{"))
    var asSplit =  quickcssRuleAsString.split(";")
    var endStr =  asSplit.slice(parseInt(colorsSize)).join(";")
    console.log(`endstr ${endStr}`)
    while (asSplit.length > parseInt(colorsSize))
    {
        asSplit.pop()
    }
    var asArray = new Array
     asSplit.forEach( e => {asArray.push(e.split(":"))})
    let stringarray = new Array
     asArray.forEach( (e, i) => {stringarray.push( i==ele ? `${e[0]}:${val}`: `${e[0]}:${e[1]}`)})
    stringarray = stringarray.join(";") + `;${endStr}`
    console.log(ele)
    console.log(asArray)
    console.log(stringarray)
    let cssRule = ":root, *, quickcss_target" + stringarray
    //let cssRule = ":root, *, quickcss_target{--primarycolor:" + val + "}"
    //Delete rule at
    quickcssSheet.deleteRule(quickcssTargetIndex)
    //insert (as in add)
    quickcssSheet.insertRule(cssRule, quickcssTargetIndex)
    //quickcssRuleSwap(r, window.quickcssTargetIndex)
    return "0"
}
