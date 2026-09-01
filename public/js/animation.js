/**
 * Animation Engine & Motion Helper Functions
 * Compliant with Master Prompt Section 27, 28, 29, 30, 31
 */

export const clamp = (v, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const smoothstep = (e0, e1, v) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};

export const lerp = (a, b, t) => a + (b - a) * t;

export const segmentInOut = (s, a, b, c, d) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return {
    enter,
    exit,
    active: enter * (1 - exit)
  };
};

/**
 * Scene timeline controller with calibrated non-colliding segments
 */
export class SceneController {
  constructor() {
    this.scenes = [
      { id: 'scene-mazar', start: 0, enterEnd: 200, exitStart: 520, end: 780, name: 'Mazar Hero' },
      { id: 'scene-story', start: 560, enterEnd: 820, exitStart: 1300, end: 1550, name: 'Mazar Story' },
      { id: 'scene-mohatta', start: 1350, enterEnd: 1650, exitStart: 2050, end: 2300, name: 'Mohatta Palace' },
      { id: 'scene-frere', start: 2100, enterEnd: 2400, exitStart: 2800, end: 3050, name: 'Frere Hall' },
      { id: 'scene-empress', start: 2850, enterEnd: 3150, exitStart: 3550, end: 3800, name: 'Empress Market' },
      { id: 'scene-clifton', start: 3600, enterEnd: 3900, exitStart: 4300, end: 4550, name: 'Clifton Beach' },
      { id: 'scene-sights', start: 4350, enterEnd: 4650, exitStart: 5050, end: 5300, name: 'Karachi Sights' },
      { id: 'scene-sources', start: 5080, enterEnd: 5350, exitStart: 99999, end: 99999, name: 'Sources & Credits' },
    ];
  }

  getSceneStates(scrollPos) {
    const states = {};
    for (const scene of this.scenes) {
      states[scene.id] = segmentInOut(scrollPos, scene.start, scene.enterEnd, scene.exitStart, scene.end);
    }
    return states;
  }
}

/**
 * High-performance smooth scroll & parallax animation engine
 */
export class AnimationEngine {
  constructor() {
    this.smoothScroll = window.scrollY || 0;
    this.targetScroll = window.scrollY || 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.initialized = false;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });
  }

  updateScrollAnimation() {
    this.targetScroll = window.scrollY || 0;

    if (!this.initialized || this.prefersReducedMotion) {
      this.smoothScroll = this.targetScroll;
      this.initialized = true;
    } else {
      this.smoothScroll = lerp(this.smoothScroll, this.targetScroll, 0.14);
    }

    if (Math.abs(this.smoothScroll - this.targetScroll) < 0.08) {
      this.smoothScroll = this.targetScroll;
    }

    return this.smoothScroll;
  }

  updatePointerParallax(clientX, clientY) {
    if (this.prefersReducedMotion) {
      this.mouseX = 0;
      this.mouseY = 0;
      return;
    }

    this.targetMouseX = clientX / window.innerWidth - 0.5;
    this.targetMouseY = clientY / window.innerHeight - 0.5;

    this.mouseX = lerp(this.mouseX, this.targetMouseX, 0.12);
    this.mouseY = lerp(this.mouseY, this.targetMouseY, 0.12);
  }

  applyAnimationState(root, scrollPos) {
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 5000;
    const scrollProgress = clamp(scrollPos / maxScroll);

    // Update scroll progress bar
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      progressBar.style.width = `${scrollProgress * 100}%`;
    }

    // Hero title rise & scale (Phase 1: 0 - 650px)
    const introExit = smoothstep(80, 650, scrollPos);
    root.style.setProperty('--hero-progress', scrollProgress);
    root.style.setProperty('--title-opacity', 1 - introExit * 0.95);
    root.style.setProperty('--title-y', `${Math.round(-210 * introExit)}px`);
    root.style.setProperty('--title-scale', lerp(1, 0.92, introExit));
    root.style.setProperty('--intro-opacity', 1 - introExit * 0.95);

    // Subtle pointer parallax coordinates
    root.style.setProperty('--mx', `${(this.mouseX * 24).toFixed(2)}px`);
    root.style.setProperty('--my', `${(this.mouseY * 24).toFixed(2)}px`);
  }
}
