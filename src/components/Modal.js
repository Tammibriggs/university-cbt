import { useEffect, useRef } from 'react'
import '../styles/modal.css'
import {X} from '@phosphor-icons/react'

function Modal({open, modalLable, children, onClose, custom_modal}) {
  const backdropRef = useRef();

  useEffect(() => {
    document.body.classList.toggle('noscroll', open)
  }, [open])

  const handleClose = (e) => {
    if (backdropRef.current === e.target) {
      onClose(e);
    }
    return null;
  };
 
  if(open) {
    return (
      <div ref={backdropRef} className={`modalContainer ${custom_modal}`} onClick={handleClose}>
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