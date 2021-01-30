import { getScrollBarSize } from "./getScrollBarSize.jsx";

// issue: 多locker同时存在时，由于dom元素始终只有一个
// 对于同一个元素的所有操作都得考虑任意顺序的执行方法，结果的正确性
const keys = new WeakMap()

/**
 * 用于锁定某滚动对象，全局公用一个存储池，由于dom元素即锁定对象唯一，在完全解锁前皆不可滚动
 * @param  element locker的dom元素，即锁定滚动的对象
 */
export const ScrollLocker = (element = document.body) => {
    // check: valid Node
    if (typeof element !== 'object' || !element?.baseURI || !document.body.contains(element)) {
        return console.warn("ScrollLocker: get invalid Node or dom doesn't exit in document.body, locker can't work as expected")
    }

    let random = Math.random().toString(16).slice(2, 10)
    let k
    if (keys.has(element)) {
        k = keys.get(element)
    } else {
        k = new key(element)
        keys.set(element, k)
    }
    // 每个新locker的标识是random，统一存储在keys上
    return {
        lock: () => {
            k.push(random)
        },
        unlock: () => {
            k.pop(random)
        },
        unlockAll: () => {
            k.clear(random)
        }
    }
}

/**
 * 记录各元素锁定滚动状态
 * element: 被锁定元素
 * previousStyle: 记录样式
 * locked/ed: 是否锁定
 * count/countSum: 多个locker使用同一个key，锁定同一个dom，用于确定锁定状态，0时解锁
 * locker:[{r,c}] r为生成的随机标识用于区分多个locker，c为单一locker计数
 * push: 某locker在key上增次
 * pop: 某locker在key上减次
 * clear: 某locker在key上清零
 */
class key {
    constructor(element) {
        this.element = element
        this.previousStyle = {
            overflow: element.style.overflow,
            width: element.style.width
        }
        this.ed = false
        this.countSum = 0
        // {r:标识,c:数目}
        this.locker = []
    }
    push (r) {
        let find = false
        for (const lock of this.locker) {
            if (lock.r === r) {
                lock.c++
                this.count++
                find = true
            }
        }
        if (!find) {
            this.locker.push({ r, c: 1 })
            this.count++
        }
    }
    pop (r) {
        for (const lock of this.locker) {
            if (lock.r === r) {
                if (lock.c >= 1) {
                    lock.c--
                    this.count--
                }
            }
        }
    }
    clear (r) {
        for (const lock of this.locker) {
            if (lock.r === r) {
                if (lock.c >= 1) {
                    this.count -= lock.c
                    lock.c = 0
                }
            }
        }
    }
    // count->countSum->locked?
    get count () { return this.countSum }
    set count (n) {
        if (n <= 0) {
            n = 0
            this.locked = false
        } else this.locked = true
        this.countSum = n
    }
    // locked?->style change
    get locked () { return this.ed }
    set locked (b) {
        // issue：确定locker对象处于滚动状态
        // if ((this.element === document.body && window.innerWidth > document.documentElement.clientWidth)
        //     || this.element.scrollHeight > this.element.clientHeight) {
        let w = getScrollBarSize()
        if (w) {
            this.element.style.width = b ? `calc(100% - ${w}px)` : this.previousStyle.width
        }
        // }
        this.element.style.overflow = b ? 'hidden' : this.previousStyle.overflow
        this.ed = b
    }
}