const name = 'ModalRouter: '
export const NotMatched = `${name}In the map you provided, key didn't matched`
export const InvalidElement_i = i => `${name}The Index:${i} Child isn't valid React Element`
export const InvalidElement = `${name}get InvalidElement from prop/child you given`
export const NoPopAndDef = (e) => {
    e.preventDefault && e.preventDefault()
    e.returnValue = false
    e.stopPropagation && e.stopPropagation()
    return false;
}
