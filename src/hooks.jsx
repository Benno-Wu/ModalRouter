import React, { Fragment, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { NotMatched, NotMatchedButPop } from "./constant.jsx";

// 目的：打开modal，背景内容不滚动，modal本身和内部元素可滚动
// bug?关闭一个弹窗的同时打开另一个，页面会怎么样？
// 源自https://github.com/ant-design/ant-design/issues/19340
import { ScrollLocker } from "./ScrollLocker.jsx";

export const useUpdate = () => {
    const [, forceUpdate] = useReducer(o => [], null)
    return forceUpdate
}

// delete: element=window
// issue: ali的ahooks是默认window对象，
// 但是这里用到一个禁止滚动的func，对滚动的root不友好，删了
// 原因是ModalCan首次渲染时element先拿到undefined，会默认挂方法到window上，
// ahooks的没试过，不知道
export const useListener = (element, event, handler, options = {}) => {
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
export const useModals = (map, multi, locker_) => {
    // console.log('modals', Date.now());
    const update = useUpdate()
    const { current: modalData } = useRef([])
    const { current: modals } = useRef([])
    // issue:始终锁定document.body
    const { current: locker } = useRef(ScrollLocker(locker_))

    // multi? always push or ?
    const open = useCallback((str, data) => {
        if (map.hasOwnProperty(str)) {
            modals.push(str)
            modalData.push(data)
        } else throw new ReferenceError(NotMatched)
    }, [map])
    const openModal = useCallback((str, data) => {
        open(str, data)
        update()
        locker.lock()
    }, [map])

    // multi? always splice or ?
    // single: always close all?
    // bug!!!!!
    // issue: same key/double open cause unmatch
    const close = useCallback(multi ? (str) => {
        let index = modals.findIndex((v, i) => v === str)
        if (index !== -1) {
            modals.splice(index, 1)
            modalData.splice(index, 1)
        } else {
            console.warn(NotMatchedButPop)
            modals.pop()
            modalData.pop()
        }
    } : () => closeAllModal(), [multi])
    const closeModal = useCallback((str) => {
        close(str)
        update()
        locker.unlock()
    }, [])
    // issue: should this func always provided to developer?
    // especially in singleMode, remind them to close after open
    const closeAllModal = useCallback(() => {
        modals.length = 0
        modalData.length = 0
        update()
        locker.unlockAll()
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