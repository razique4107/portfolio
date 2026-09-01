import { KARACHI_IMAGES } from './images.js';

export class SightSlider {
  constructor() {
    this.slides = [];
    this.allSlides = [];
    this.currentIndex = 0;
    this.track = document.getElementById('sliderTrack');
    this.prevBtn = document.getElementById('sliderPrev');
    this.nextBtn = document.getElementById('sliderNext');
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Scroll targets for each landmark
    this.targetOffsets = {
      'mazar-e-quaid': 800,
      'mohatta-palace': 1700,
      'frere-hall': 2400,
      'empress-market': 3100,
      'clifton-beach': 3900,
    };
  }

  async initialize() {
    try {
      const response = await fetch('/api/content/landmarks');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.slides = data.slice(0, 5);
        }
      }
    } catch (e) {
      console.warn('Using local landmark records for slider');
    }

    if (this.slides.length === 0) {
      this.slides = Object.values(KARACHI_IMAGES).map(img => ({
        slug: img.slug,
        title: img.title,
        kicker: img.kicker,
        description: `${img.title} is one of Karachi's defining cultural landmarks.`,
        imageKey: Object.keys(KARACHI_IMAGES).find(k => KARACHI_IMAGES[k].slug === img.slug),
        sectionId: img.slug.includes('beach') ? 'coast' : (img.slug.includes('quaid') ? 'mazar' : 'heritage')
      }));
    }

    // 3-set clone strategy for seamless infinite loop
    this.allSlides = [...this.slides, ...this.slides, ...this.slides];
    this.currentIndex = this.slides.length; // Start in middle set

    this.render();
    this.attachEventListeners();
  }

  render() {
    if (!this.track) return;
    this.track.innerHTML = '';

    this.allSlides.forEach((slide, index) => {
      const imgConfig = KARACHI_IMAGES[slide.imageKey] || KARACHI_IMAGES[Object.keys(KARACHI_IMAGES).find(k => KARACHI_IMAGES[k].slug === slide.slug)] || KARACHI_IMAGES.mazarHero;

      const card = document.createElement('article');
      card.className = 'sight-card';
      card.setAttribute('role', 'group');
      card.setAttribute('aria-label', `${slide.title} card`);
      card.setAttribute('tabindex', '0');
      card.dataset.slug = slide.slug;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="sight-card-image">
          <img src="${imgConfig.url}" alt="${imgConfig.alt || slide.title}" loading="lazy" decoding="async">
        </div>
        <span class="sight-card-kicker">${slide.kicker}</span>
        <h3 class="sight-card-title">${slide.title}</h3>
        <p class="sight-card-description">${slide.description}</p>
        <span class="sight-card-link">Explore Landmark ↗</span>
      `;

      // Click card to navigate to its scene
      card.addEventListener('click', () => {
        this.navigateToLandmark(slide.slug);
      });

      // Keydown on card (Enter / Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateToLandmark(slide.slug);
        }
      });

      this.track.appendChild(card);
    });

    this.updatePosition(false);
  }

  navigateToLandmark(slug) {
    const target = this.targetOffsets[slug] ?? 800;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  updatePosition(animated = true) {
    if (!this.track) return;
    const cardWidth = this.getCardWidthPercentage();
    const offset = -(this.currentIndex * cardWidth);

    if (!animated) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    this.track.style.transform = `translateX(${offset}%)`;

    if (!animated) {
      // Force reflow
      this.track.offsetHeight;
      this.track.style.transition = '';
    }
  }

  getCardWidthPercentage() {
    if (window.innerWidth <= 820) return 100;
    if (window.innerWidth <= 1100) return 50;
    return 33.333;
  }

  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex++;
    this.updatePosition(true);

    setTimeout(() => {
      if (this.currentIndex >= this.allSlides.length - this.slides.length) {
        this.currentIndex = this.slides.length;
        this.updatePosition(false);
      }
      this.isAnimating = false;
    }, 520);
  }

  prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex--;
    this.updatePosition(true);

    setTimeout(() => {
      if (this.currentIndex < this.slides.length) {
        this.currentIndex = this.allSlides.length - this.slides.length * 2 - 1;
        this.updatePosition(false);
      }
      this.isAnimating = false;
    }, 520);
  }

  attachEventListeners() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Keyboard Arrow navigation when slider is focused or hovered
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.closest('#sightsSlider')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      }
    });

    // Touch Swipe support
    this.track?.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track?.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      const diff = this.touchStartX - this.touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.updatePosition(false);
    });
  }
}
