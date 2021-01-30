import React, { Fragment, useCallback } from "react"
import { AllModals } from "./context.jsx";
import { enhance, enhanceChildren } from "./constant.jsx";
import { ModalCan, ContextCan } from "./HOCS/index.js";
import { useUpdate, useModals } from "./hooks.jsx";

// todos：lifetime\callback

export default function Single ({ children, map, contextMode, container, locker, ...rest }) {
    const [modals, modalData, { getModal, ...funcs }] = useModals(map, false, locker)
    const getChildren = enhanceChildren(children, funcs)

    return (
        <Fragment>
            {React.createElement(ContextCan, { contextMode, Provider: AllModals.Provider, ...funcs }, getChildren)}
            {React.createElement(ModalCan, { container, hidden: !modals.length, ...funcs }, getModal())}
        </Fragment>
    )
}
