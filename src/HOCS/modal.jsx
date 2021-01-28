import React, { useEffect, useRef, Component, Fragment } from 'react'
import { useListener } from "../hooks.jsx";
import { InvalidElement, NoPopAndDef } from "../constant.jsx"
import './index.css'

// issue: container 优化 不重新渲染
export const ModalCan = ({ container, hidden, children, ...funcs }) => {
    const ref = useRef()
    // bug?modal内容或者背景滚动
    useListener(ref.current, 'mousewheel', NoPopAndDef)
    useListener(ref.current, 'touchmove', NoPopAndDef)

    // issue: 优先mount?HOC_modal
    // if (hidden) {
    //     return <Fragment />
    if (!hidden) {
        if (typeof container === 'function') {
            // class
            if (container.prototype.isReactComponent) {
                return React.createElement(container, funcs, children)
            } else {
                // func, bug???
                return React.cloneElement(container({ children, funcs }))
            }
        }
        // object
        else if (React.isValidElement(container)) {
            return React.cloneElement(container, funcs, children)
        }
    }
    return <div className="HOC_modal" ref={ref} style={{ display: hidden ? 'none' : 'flex' }}>{children}</div>
}

export const modalCan = (children) => {
    return class extends Component {
        constructor(props) {
            super(props)
            this.ref = React.createRef()
        }
        componentDidMount () {
            this.ref.current.addEventListener('mousewheel', NoPopAndDef)
            this.ref.current.addEventListener('touchmove', NoPopAndDef)
        }
        componentWillUnmount () {
            this.ref.current.removeEventListener('mousewheel', NoPopAndDef)
            this.ref.current.removeEventListener('touchmove', NoPopAndDef)
        }
        render () { return (<div className="HOC_modal" ref={this.ref}>{children}</div>) }
    }
}