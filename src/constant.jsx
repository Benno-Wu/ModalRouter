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

export const enhance = (mainFunc, sub) => {
    return function () {
        mainFunc(...arguments)
        sub()
    }
}

/**
 * 为非html类的props.children注入funcs
 * @param children 子组件
 * @param funcs 注入props的函数
 */
export const enhanceChildren = (children, funcs) =>
    React.Children.map(children, (c, i) =>
        React.isValidElement(c) && typeof c.type !== 'string' ?
            React.cloneElement(c, { ...funcs }) : c
    )