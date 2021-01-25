import React, { Fragment, useState, useEffect, useMemo, useRef, useCallback } from "react"
import { NotMatched, InvalidElement_i, InvalidElement } from "./constant.jsx";
import { modalCan } from "./HOCS/modal.jsx";
import { useUpdate } from "./hooks.jsx";
import { AllModals } from "./context.jsx";
// todos：lifetime\callback

export default function Single ({ children, map, contextMode, container, ...rest }) {
    const forceUpdate = useUpdate()
    const [modal, setModal] = useState(null)
    const modalData = useRef()

    const openModal = useCallback((str, data) => {
        console.log('opening...', str, modal, data)
        if (map.hasOwnProperty(str)) {
            modalData.current = data
            setModal(str)
        } else throw new ReferenceError(NotMatched)
        forceUpdate()
    }, [map])
    const closeModal = useCallback(() => {
        console.log('closing...', modal)
        modalData.current = undefined
        setModal(null)
        forceUpdate()
    }, [])


    // object 自动展开
    // openModal('name',{ModalDateObject||props})
    const getModal = useCallback(() => {
        let prop = { modalData: modalData.current }
        if (typeof modalData.current === 'object' && !modalData.current[Symbol.iterator])
            prop = Object.assign(prop, modalData.current)
        console.log('---getModal', modal)

        if (!map[modal])
            return <Fragment />
        else {
            let _ = React.createElement(map[modal], { ...prop, openModal, closeModal })
            let Container = modalCan(_)
            if (typeof container === 'function') {
                if (container.prototype.isReactComponent) {
                    Container = container
                    return <Container>{_}</Container>
                }
                // bug???
                else Container = container(_)
            }
            // else throw new TypeError(InvalidElement)
            return <Container />
        }
    }, [modal, modalData.current])


    const getChildren = () => {
        return React.Children.map(children, (c, i) => {
            if (React.isValidElement(c))
                return React.cloneElement(c, { openModal, closeModal })
            else throw new TypeError(InvalidElement_i(i))
        })
    }

    const getWrapped = () => {
        return contextMode ? React.createElement(AllModals.Provider, { value: { openModal, closeModal } }, getChildren())
            : React.createElement(Fragment, null, getChildren())
    }

    return (
        <Fragment>
            {getWrapped}
            {getModal()}
        </Fragment>
    )
}
