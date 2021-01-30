import React from "react"
import { Open, Close, CloseAll } from "./control.jsx";

export const SmallModal = ({ children, openModal, closeModal, closeAllModal, ...rest }) => {

    return <div className="modal small">
        SmallModal{children}
        <Close who='small' closeModal={closeModal} />
    </div>
}

export const BigModal = ({ children, openModal, closeModal, closeAllModal, ...rest }) => {

    return <div className="modal big">
        BigModal{children}
        <Open who='small' openModal={openModal} />
        <Close who='big' closeModal={closeModal} />
    </div>
}

export const GiantModal = ({ children, openModal, closeModal, closeAllModal, ...rest }) => {

    return (
        <div style={{ overflow: 'scroll' }}>
            <div className="modal giant">
                GiantModal
            <Open who='small' openModal={openModal} />
                <Close who='small' closeModal={closeModal} />
                <Open who='big' openModal={openModal} />
                <Close who='big' closeModal={closeModal} />
                <Open who='giant' openModal={openModal} />
                <Close who='giant' closeModal={closeModal} />
                <CloseAll closeAllModal={closeAllModal} />
                {children}
            </div>
        // </div>
    )
}

export const GiantContent = ({ }) => {
    return <div className="giant">
        giantContent
    </div>
}