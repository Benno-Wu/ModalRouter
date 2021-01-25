import React, { useEffect, useRef, Component } from 'react'
import { useListener } from "../hooks.jsx";
import { InvalidElement, NoPopAndDef } from "../constant.jsx"
import './index.css'

// invalid
export const modal_ = (children) => {
    const ref = useRef()

    useListener(ref.current.current, 'click', NoPopAndDef)
    useListener(ref.current.current, 'touchmove', NoPopAndDef)

    return <div className="HOC_modal" ref={ref.current}>{children}</div>
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