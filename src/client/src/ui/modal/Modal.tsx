import * as React from 'react'
import './modal.scss'

export interface ModalProps {
  shouldShow?: boolean
  title?: string
  children?: any
}

// TODO disable tabbing outside of the modal
// tslint:disable-next-line:variable-name
const Modal = (props:ModalProps) => {
  if (!props.shouldShow) {
    return null
  }
  return (
    <div>
      <div className="modal__overlay"></div>
      <div className="modal">
        <div className="modal__header">
          <span className="modal__header-title">{props.title}</span>
        </div>
        <div className="modal__body">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Modal
