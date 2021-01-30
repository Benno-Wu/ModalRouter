import React from "react";

const name = 'ModalRouter: '
export const NotMatched = `${name}In the map you provided, key didn't matched`
export const NotMatchedButPop = `${name}In the stack you pushed, key didn't matched. Maybe you closeModal with the wrong name, this may causes bug.`
export const InvalidElement_i = i => `${name}The Index:${i} Child isn't valid React Element`
export const InvalidElement = `${name}get InvalidElement from prop/child you given`


export const NoPopAndDef = (e) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    e.returnValue = false
    return false
}

export const enhance = (mainFunc, ...subs) => {
    return function () {
        mainFunc(...arguments)
        for (const sub of subs)
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