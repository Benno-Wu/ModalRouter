import React from "react"

export function Control ({ openModal, closeModal, closeAllModal, who }) {
    console.log('control:', arguments)

    const random = () => {
        Math.random() > 0.5 ? openModal(who) : closeModal(who)
    }

    return <button className="button" onClick={random}>random{who}</button>
}
export function Open ({ openModal, who }) {
    // console.log('open:', arguments)

    return <button className="button" onClick={() => openModal(who)}>open{who}</button>
}
export function Close ({ closeModal, who }) {
    console.log('close:', arguments)

    return <button className="button" onClick={() => closeModal(who)}>close{who}</button>
}
