import React from "react";
export class ABC extends React.Component {
    constructor(props) {
        super(props)
        console.log(props.children);
        this.ref = React.createRef()
    }

    render () { return (<div className="HOC_modal" ref={this.ref}>{this.props.children}</div>) }
}