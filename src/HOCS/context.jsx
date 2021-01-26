import React, { Fragment } from "react"

/**
 * 
 * @param props
 * - children:子组件
 * - contextMode: 是否开启context
 * - Provider: context.Provider
 * - ...rest: Provider's value
 */
export const ContextCan = ({ contextMode, Provider, children, ...rest }) =>
    !contextMode ? <Fragment>{children}</Fragment> :
        <Provider value={rest}>{children}</Provider>
