class Slider {
  constructor(sliderElement) {
    this.slider = sliderElement;
    this.slidesContainer = this.slider.querySelector('.slides');
    this.slides = this.slider.querySelectorAll('.slide');
    this.prevBtn = this.slider.querySelector('.prev');
    this.nextBtn = this.slider.querySelector('.next');
    this.dotsContainer = this.slider.querySelector('.dots');

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;

    if (this.totalSlides <= 1) return;

    this.isDragging = false;
    this.startX = 0;
    this.dragOffset = 0;
    this.threshold = 50;

    this.init();
  }

  init() {
    this.createDots();
    this.bindEvents();
    this.updateSlider();
  }

  createDots() {
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeSlide(-1);
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeSlide(1);
      });
    }

    this.slidesContainer.style.touchAction = 'pan-y';

    this.slidesContainer.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    window.addEventListener('pointermove', this.handlePointerMove.bind(this), { passive: false });
    window.addEventListener('pointerup', this.handlePointerUp.bind(this), { passive: true });
    window.addEventListener('pointercancel', this.handlePointerUp.bind(this), { passive: true });
  }

  handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    
    this.isDragging = true;
    this.startX = e.clientX;
    this.dragOffset = 0;
    this.slidesContainer.style.transition = 'none';

    document.body.classList.add('slider-dragging');
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();

    this.dragOffset = e.clientX - this.startX;
    const baseOffset = -this.currentIndex * 100;
    const dragPercent = (this.dragOffset / this.slider.offsetWidth) * 100;
    this.slidesContainer.style.transform = `translateX(${baseOffset + dragPercent}%)`;
  }

  handlePointerUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    document.body.classList.remove('slider-dragging');
    this.slidesContainer.style.transition = '';

    if (Math.abs(this.dragOffset) > this.threshold) {
      const direction = this.dragOffset > 0 ? -1 : 1;
      this.changeSlide(direction);
    } else {
      this.updateSlider();
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateSlider();
  }

  changeSlide(direction) {
    let newIndex = this.currentIndex + direction;
    if (newIndex >= this.totalSlides) newIndex = 0;
    if (newIndex < 0) newIndex = this.totalSlides - 1;
    this.goToSlide(newIndex);
  }

  updateSlider() {
    const offset = -this.currentIndex * 100;
    this.slidesContainer.style.transform = `translateX(${offset}%)`;
    this.updateDots();
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
  }
}

if (!document.getElementById('slider-drag-style')) {
  const style = document.createElement('style');
  style.id = 'slider-drag-style';
  style.textContent = `
    .slider-dragging,
    .slider-dragging * {
      user-select: none !important;
      -webkit-user-drag: none !important;
    }
  `;
  document.head.appendChild(style);
}

document.querySelectorAll('.slider').forEach(el => new Slider(el));