import React, { Fragment, useCallback } from "react"
import { AllModals } from "./context.jsx";
import { enhance, enhanceChildren } from "./constant.jsx";
import { ModalCan, ContextCan } from "./HOCS/index.js";
import { useUpdate, useModals } from "./hooks.jsx";

// todos：lifetime\callback

export default function Single ({ children, map, contextMode, container, ...rest }) {
    const update = useUpdate()
    const [modals, modalData, { getModal, openModal: open, closeModal: close, closeAllModal: closeAll }] = useModals(map, false)

    const openModal = useCallback(enhance(open, update), [])
    const closeModal = useCallback(enhance(close, update), [])
    const closeAllModal = useCallback(enhance(closeAll, update), [])
    const funcs = { openModal, closeModal, closeAllModal }

    const getChildren = enhanceChildren(children, funcs)

    return (
        <Fragment>
            {React.createElement(ContextCan, { contextMode, Provider: AllModals.Provider, ...funcs }, getChildren)}
            {React.createElement(ModalCan, { container, hidden: !modals.length, ...funcs }, getModal())}
        </Fragment>
    )
}
