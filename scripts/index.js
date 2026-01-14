(function () {
  const wrapper = document.querySelector('.projects__box-wrapper');
  const modalClose = document.querySelector('.modal-close');
  const body = document.body;

  if (!wrapper && !modalClose) return;

  const handleOpen = (e) => {
    const box = e.target.closest('.box');
    if (box && wrapper.contains(box)) {
      body.classList.add('modal--open');
    }
  };

  const handleClose = () => {
    body.classList.remove('modal--open');
  };

  if (wrapper) {
    wrapper.addEventListener('click', handleOpen);
  }

  if (modalClose) {
    modalClose.addEventListener('click', handleClose);
  }

  const handleKeydown = (e) => {
    if (e.key === 'Escape' && body.classList.contains('modal--open')) {
      handleClose();
    }
  };

  document.addEventListener('keydown', handleKeydown);
})();