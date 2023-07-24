import { useEffect } from 'react'
import '../styles/modal.css'
import {X} from '@phosphor-icons/react'

function Modal({open, modalLable, children, onClose, custom_modal}) {

  useEffect(() => {
    document.body.classList.toggle('noscroll', open)
  }, [open])

  const handleClose = (e) => {
    if(e.target.className === 'modalContainer'){
      onClose(e)
    }else if(e.target.className?.split(' ')[0] === 'modalContainer') {
      onClose(e)
    }
    return null
  }
 
  if(open) {
    return (
      <div className={`modalContainer ${custom_modal}`} onClick={handleClose}>
        <div className= 'modal'>
          <div className='modal__head'>
            <h2>{modalLable}</h2>
            <span className='modal__close' onClick={onClose}>
              <X size={25} className='text-gray-500 cursor-pointer hover:text-red-300'/>
            </span>
          </div>
          {children}
        </div>
      </div>
    )
  }
  return null
}

export default Modal