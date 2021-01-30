import React, { Fragment, useContext, useEffect } from "react"
import ReactDOM from "react-dom"
import ModalRouter, { AllModals } from "../index.js";
import "./index.css";
import { SmallModal, BigModal, GiantModal, GiantContent } from "./modal.jsx";
import { Control, Open, Close } from "./control.jsx";

const map = {
    small: SmallModal,
    big: BigModal,
    giant: <GiantModal><GiantContent /></GiantModal>,
}

const App = () => {
    // console.log('app rendering...', Date.now());
    return <Fragment>
        <div className="simpleHead">simpleHead</div>
        <ModalRouter.Multi map={map} contextMode>
            <Open who='giant' />
            <Open who='small' />
            <Open who='big' />
            <GiantModal />
            <div className="simpleEle">
                simpleEle
            </div>
            <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>
                <FuncTest />
            </div>
        </ModalRouter.Multi>
    </Fragment>
}

const FuncTest = ({ children, ...rest }) => {
    const { openModal, closeModal, closeAllModal } = useContext(AllModals)

    useEffect(() => {
        openModal('small')
        return () => closeModal('small')
    }, [])

    return <span>FC Test</span>
}

ReactDOM.render(<App />, document.getElementById('root'))