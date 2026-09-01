import { clamp, lerp, SceneController } from './animation.js';

export class SceneManager {
  constructor() {
    this.controller = new SceneController();
    this.stage = document.getElementById('stage');
    this.root = document.documentElement;
    this.navLinks = document.querySelectorAll('.nav-link');

    // Cache scene DOM elements
    this.sceneElements = {
      'scene-mazar': document.getElementById('scene-mazar'),
      'scene-story': document.getElementById('scene-story'),
      'scene-mohatta': document.getElementById('scene-mohatta'),
      'scene-frere': document.getElementById('scene-frere'),
      'scene-empress': document.getElementById('scene-empress'),
      'scene-clifton': document.getElementById('scene-clifton'),
      'scene-sights': document.getElementById('scene-sights'),
      'scene-sources': document.getElementById('scene-sources'),
    };
  }

  updateScenes(scrollPos) {
    const states = this.controller.getSceneStates(scrollPos);

    for (const [id, el] of Object.entries(this.sceneElements)) {
      if (!el) continue;

      const state = states[id];
      const opacity = state ? state.active : 0;

      // Only make visible when active to prevent any element stacking/collision
      if (opacity > 0.005) {
        el.style.opacity = opacity.toFixed(3);
        el.style.visibility = 'visible';
        el.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
        el.classList.add('active');
      } else {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        el.classList.remove('active');
      }
    }

    // Micro-motion depth
    const sceneProgress = clamp(scrollPos / 5000);
    const scaleVal = lerp(1, 1.04, Math.sin(sceneProgress * Math.PI));
    const sceneY = Math.sin(sceneProgress * Math.PI * 2) * 12;

    this.root.style.setProperty('--scene-scale', scaleVal.toFixed(3));
    this.root.style.setProperty('--scene-y', `${sceneY.toFixed(1)}px`);

    // Update active navigation state
    this.updateNavigation(scrollPos);
  }

  updateNavigation(scrollPos) {
    let activeNav = '#cinema';

    if (scrollPos < 600) {
      activeNav = '#cinema';
    } else if (scrollPos < 1400) {
      activeNav = '#mazar';
    } else if (scrollPos < 3500) {
      activeNav = '#heritage';
    } else if (scrollPos < 4200) {
      activeNav = '#coast';
    } else {
      activeNav = '#sights';
    }

    this.navLinks.forEach(link => {
      if (link.getAttribute('href') === activeNav) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
