import React, { Fragment, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { NotMatched } from "./constant.jsx";

export const useUpdate = () => {
    const [, forceUpdate] = useReducer(o => [], null)
    return forceUpdate
}

export const useListener = (element = window, event, handler, options = {}) => {
    let { current } = useRef()
    current = handler
    useEffect(() => {
        if (!element || !element.addEventListener) return;
        const listener = e => current(e)
        element.addEventListener(event, listener, {
            capture: !!options.capture,
            once: !!options.once,
            passive: !!options.passice,
        })
        return () => element.removeEventListener(event, listener, { capture: !!options.capture })
    }, [element, event, options.capture, options.once, options.passice])
}

// issue: necessery to useCallback?
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
    const openModal = useCallback((str, data) => open(str, data), [map])

    // multi? always splice or ?
    // single: always close all?
    // issue: same key/double open cause unmatch
    const close = useCallback(multi ? (str) => {
        let index = modals.findIndex((v, i) => v === str)
        if (index !== -1) {
            modals.splice(index, 1)
            modalData.splice(index, 1)
        } else {
            modals.pop()
            modalData.pop()
        }
    } : () => closeAllModal(), [multi])
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
    const getModal = useCallback(multi ? () =>
        modals.map((str, i) =>
            getElement(map[str], modalData[i], str + i)
        ) : () => !modals.length ? null :
            [getElement(map[modals.slice(-1)[0]], modalData.slice(-1)[0], modals.slice(-1)[0] + 0)]
        , [multi, map])

    // bug?
    // 自动展开object类型的data
    function getElement (ele, data, key) {
        let prop = { modalData: data, openModal, closeModal, closeAllModal }
        if (typeof data === 'object' && !data[Symbol.iterator]) {
            prop = { ...prop, ...data }
        }
        return (
            React.isValidElement(ele) ?
                React.cloneElement(ele, { ...prop, key })
                : React.createElement(ele, { ...prop, key }))
    }

    return [modals, modalData, { getModal, openModal, closeModal, closeAllModal }]
}