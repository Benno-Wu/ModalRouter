import React, { Fragment, useCallback, useRef, useState, useMemo, useEffect } from "react";
import { NotMatched, InvalidElement_i, InvalidElement } from "./constant.jsx";
import { AllModals } from "./context.jsx";
import { useUpdate } from "./hooks.jsx";
import { modalCan } from "./HOCS/modal.jsx";

// todo
// mutile type

export default function Multi ({ children, map, contextMode, container, ...rest }) {
    const update = useUpdate()
    const { current } = useRef([])
    const modals = useRef([])
    console.log('-multi update at ' + +new Date(), modals)

    const openModal = useCallback((str, data) => {
        console.log('opening...', str, modals.current)
        if (map.hasOwnProperty(str)) {
            current.push(data)
            modals.current = [...modals.current, str]
            update()
        } else throw new ReferenceError(NotMatched)
    }, [map])
    // bug
    // double open, single close, not match
    const closeModal = useCallback((str) => {
        console.log('closing...', str, modals.current)
        let index = modals.current.findIndex((v, i) => v === str)
        if (index != -1) {
            current.splice(index, 1)
            modals.current.splice(index, 1)
            update()
        } else {
            // todo: undefined为pop?error?false?
            console.log('close fail:', str)
            modals.current.pop()
            // return false
        }
    }, [])

    // 假设modal存在
    // object 自动展开
    // openModal('name',{ModalDateObject||props})
    const getModals = useCallback(() => {
        console.log('---Render Modals', modals.current);
        let temp = []
        modals.current.map((str, i) => {
            let prop = { modalData: current[i] }
            if (typeof current[i] === 'object' && !current[i][Symbol.iterator]) {
                prop = Object.assign(prop, current[i])
            }
            // todo: 一般形式{key:name} 可能{key:<name/>}
            temp.push(
                React.isValidElement(map[str]) ?
                    React.createElement(map[str], { ...prop, openModal, closeModal, key: str + i })
                    : React.cloneElement(map[str], { ...prop, openModal, closeModal, key: str + i })
            )
        })
        // todo: bug or better?
        // return <Fragment>{temp}</Fragment>
        return temp
    }, [map])

    // const getCan = useMemo(() => {
    //     console.log('---Render Can')

    //     if (typeof container === 'function') {
    //         let Can = container
    //         return container.prototype.isReactComponent ? { type: 'object', render: Can }
    //             : { type: 'func', render: Can }
    //     }
    //     return container
    // }, [container])


    // container 优化不重新渲染
    const getModal = () => {
        // React.memo?
        if (!modals.current.length)
            return <Fragment />
        else {
            let _ = getModals()
            let Container = modalCan(_)
            if (typeof container === 'function') {
                // class
                if (container.prototype.isReactComponent) {
                    Container = container
                    return <Container>{_}</Container>
                }
                // func
                else Container = container(_)
            }
            // object
            else if (React.isValidElement(container)) {
                return React.cloneElement(container, { openModal, closeModal }, _)
            }
            // else throw new TypeError(InvalidElement)
            return <Container />
        }
    }

    // bug children unupdated
    // memo necessary? causes bug: unable to update children
    const getChildren = () => {
        console.log('getChild', modals.current)
        return React.Children.map(children, (c, i) => {
            // children can be an object{type,props,key,ref,children} or an array
            // todo:
            // string,return
            // div
            // isvalid,.type is string,return
            // func
            // not valid,typeof is func,return
            // <func/>
            // isValid,.type is func,useClone
            // class
            // not valid,typeof is func,proto.isRact，useCreate
            // <class/>
            // isValid,.type is class 👆,useClone

            // Object from <> likes {type }
            if (React.isValidElement(c) && c.type != 'string')
                return React.cloneElement(c, { openModal, closeModal })
            else return c
            //  throw new TypeError(InvalidElement_i(i))
        })
    }

    const getWrapped = () => {
        return contextMode ? React.createElement(AllModals.Provider, { value: { openModal, closeModal } }, getChildren())
            : React.createElement(Fragment, null, getChildren())
    }

    return (
        <Fragment>
            {getWrapped()}
            {getModal()}
        </Fragment>
    )
}



// note
// export function isValidElement (object) {
//     return (
//         typeof object === 'object' &&
//         object !== null &&
//         object.$$typeof === REACT_ELEMENT_TYPE
//     );
// }