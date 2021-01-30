let stored
export const getScrollBarSize = (refresh) => {
    if (refresh || !stored) {
        let inner = document.createElement('div')
        inner.style.height = '110%';

        let outer = document.createElement('div')
        outer.style.visibity = 'hidden'
        outer.style.width = '100px'
        outer.style.height = '100px'
        outer.style.overflow = 'hidden'
        outer.appendChild(inner)
        document.body.appendChild(outer)
        const hidden = inner.offsetWidth
        outer.style.overflow = 'scroll'
        let scroll = inner.offsetWidth
        if (hidden === scroll) {
            scroll = outer.clientWidth
        }
        stored = hidden - scroll
        document.body.removeChild(outer)
    }
    return stored
}