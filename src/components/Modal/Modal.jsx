import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalOverlay, ModalContent } from './Modal.styled';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ children, handleClose }) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      handleClose();
    }
  };

  return createPortal(
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContent>{children}</ModalContent>
    </ModalOverlay>,
    modalRoot
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
};
