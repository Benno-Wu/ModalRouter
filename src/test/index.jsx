import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import ModalRouter from "../index.js";
import "./index.css";
import { SmallModal, BigModal } from "./modal.jsx";
import { Control, Open, Close } from "./control.jsx";

const map = {
    small: SmallModal,
    big: BigModal,
    giant: 'GiantModal',
}


const App = () => {

    return <Fragment>
        <ModalRouter.Multi map={map} contextMode>
            <Control who='giant' />
            <Open who='small' />
            <Close who='small' />
            <Open who='big' />
            <Close who='big' />

            <div className="simpleEle">
                simpleEle
            </div>
        </ModalRouter.Multi>
    </Fragment>
}


ReactDOM.render(<App />, document.getElementById('root'))