function quickcssFormatRule(val, ele, colorsSize){
    //async  is not needed, just trying to debug some error from colorpicker
    ele = parseInt(ele)
    //get sheet from style tag
    let quickcssSheet =  document.documentElement.querySelector("gradio-app").shadowRoot.querySelector("style").sheet
    //get it's rules
    let quickcssCssr = quickcssSheet.cssRules
    //convert to array for finding index
    let quickcssCssrArray = Array.from(quickcssCssr)
    //use custom target to find index
    let quickcssTarget =  quickcssCssrArray.find( item => item.cssText.includes("quickcss_target"))
    let quickcssTargetIndex =  quickcssCssrArray.indexOf(quickcssTarget)
    //Pull rule out
    let quickcssRuleAsString =  quickcssCssr[quickcssTargetIndex].cssText.toString()
    //splitter for rule targets and body
    let ruleSplitIndex = quickcssRuleAsString.indexOf("{")
    //Target of rule
    let ruleTargets = quickcssRuleAsString.slice(0, ruleSplitIndex)
    //Body of rule
    let quickcssRuleBody =  quickcssRuleAsString.slice(ruleSplitIndex)
    //Rule body edit
    let asSplit =  quickcssRuleBody.split(";")
    let endStr =  asSplit.slice(parseInt(colorsSize)).join(";")
    //Edit to element position, index and length given as string via hiddenvals components
    while (asSplit.length > parseInt(colorsSize))
    {
        asSplit.pop()
    }
    let asArray = new Array
     asSplit.forEach( e => {asArray.push(e.split(":"))})
    let stringarray = new Array
     asArray.forEach( (e, i) => {stringarray.push( i==ele ? `${e[0]}: ${val}`: `${e[0]}: ${e[1]}`)})
    stringarray = stringarray.join(";") + `;${endStr}`
    let cssRule = ruleTargets + stringarray
    //Delete old rule at
    quickcssSheet.deleteRule(quickcssTargetIndex)
    //insert (as in add at same location)
    quickcssSheet.insertRule(cssRule, quickcssTargetIndex)
    //returns must equal inputs size, so outputs must matchsize, python fn hijacks for finishing save data
    return [stringarray, "", ""]
}
