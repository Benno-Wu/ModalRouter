import React from "react"
import { Open, Close } from "./control.jsx";

export const SmallModal = ({ children, openModal, closeModal, closeAllModal, ...rest }) => {

    return <div className="modal small" onClick={() => closeAllModal()}>
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