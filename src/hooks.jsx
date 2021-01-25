import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { NotMatched } from "./constant.jsx";

export const useUpdate = () => {
    const [, forceUpdate] = useReducer(o => [], null)
    return forceUpdate
}

export const useListener = (element = window, event, handler, options = {}) => {
    let { current } = useRef()
    current = handler
    useEffect(() => {
        if (!element.addEventListener) return;
        element.addEventListener(event, handler, {
            capture: !!options.capture,
            once: !!options.once,
            passive: !!options.passice,
        })
        return element.removeEventListener(event, handlers, { capture: !!options.capture })
    }, [element, event, ...options])
}

export const useChildren = (children, funcs) => {
    return React.Children.map(children, (c, i) => {
        return React.isValidElement(c) && c.type !== 'string' ?
            React.cloneElement(c, { ...funcs }) : c
    })
}

export const useModals = (map, multi) => {
    const { current: modalData } = useRef([])
    const { current: modals } = useRef([])

    // multi? always push or ?
    const open = useCallback((str, data) => {
        if (map.hasOwnProperty(str)) {
            modals.push(str)
            modalData.push(data)
        } else throw new ReferenceError(NotMatched)
    }, [map])
    const openModal = useCallback((str, data) => {
        open(str, data)
    }, [map])

    // multi? always splice or ?
    // single: always close all?
    const close = useCallback(multi ? (str) => {
        let index = modals.findIndex((v, i) => v === str)
        if (index !== -1) {
            modals.splice(index, 1)
            modalData.splice(index, 1)
        } else {
            modals.pop()
            modalData.pop()
        }
    } : () => {
        closeAllModal()
    }, [multi])
    const closeModal = useCallback((str) => {
        close(str)
    }, [])
    // issue: should this func always provided to developer
    // especially in singleMode, remind them to close after open
    const closeAllModal = useCallback(() => {
        modals.length = 0
        modalData.length = 0
    }, [])

    // 返回的是表达式还是函数？
    const getModal = useCallback(multi ? () => {
        return modals.map((str, i) => {
            return getElement(map[str], modalData[i], str + i)
            // let prop = { modalData: modalData[i], openModal, closeModal }
            // if (typeof modalData[i] === 'object' && !modalData[i][Symbol.iterator]) {
            //     prop = { ...prop, ...modalData[i] }
            // }
            // return (
            //     React.isValidElement(map[str]) ?
            //         React.createElement(map[str], { ...prop, key: str + i })
            //         : React.cloneElement(map[str], { ...prop, key: str + i }))
        })
    } : () => {
        return !modals.length ? null :
            getElement(modals[modals.length - 1], modalData[modalData.length - 1])
    }, [multi, map])

    // bug?
    function getElement (ele, data, key) {
        let prop = { modalData: data, openModal, closeModal, closeAllModal }
        if (typeof data === 'object' && !data[Symbol.iterator]) {
            prop = { ...prop, ...data }
        }
        return (
            React.isValidElement(ele) ?
                React.createElement(ele, { ...prop, key })
                : React.cloneElement(ele, { ...prop, key }))
    }

    return [modals, modalData, { getModal, openModal, closeModal, closeAllModal }]
}