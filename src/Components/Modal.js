import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import { Overlay, Callout } from './Styled'

export const modalParentClassName = 'modal-container'
export const modalParentSelector = `.${modalParentClassName}`

export default class Modal extends PureComponent {
  static defaultProps = {
    show: false,
    open: () => { /* no op */ },
    close: () => { /* no op */ }
  }

  handleClose = (e) => {
    if (e.target !== this.overlay) {
      e.stopPropagation()
      return
    }
    this.props.close()
  }

  render () {
    const {children, show} = this.props
    
    return (
      <Overlay hide={!show} onClick={this.handleClose} innerRef={el => { this.overlay = el }}>
        <Callout hide={!show}>
          {children}
        </Callout>
      </Overlay>
    )
  }
}
