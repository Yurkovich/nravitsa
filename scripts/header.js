const headerOpenBtn = document.querySelector('.burger')
const body = document.querySelector('.body')
const burgerCloseBtn = document.querySelector('.burger-close')
const CLASS = 'body--active';

headerOpenBtn?.addEventListener('click', () => body.classList.add(CLASS));
burgerCloseBtn?.addEventListener('click', () => body.classList.remove(CLASS));

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) body.classList.remove('body--active')
})