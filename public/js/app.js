import { AnimationEngine } from './animation.js';
import { SceneManager } from './scenes.js';
import { SightSlider } from './slider.js';
import { NavigationManager } from './navigation.js';
import { setupImageFallbacks } from './images.js';

class KarachiCinematicApp {
  constructor() {
    this.animationEngine = new AnimationEngine();
    this.sceneManager = new SceneManager();
    this.slider = new SightSlider();
    this.navigation = new NavigationManager();
  }

  async initialize() {
    // Setup image error recovery and fallbacks
    setupImageFallbacks();

    // Initialize UI components
    await this.slider.initialize();
    this.navigation.initialize();

    // Initial scene update at current scroll position
    const initialScroll = this.animationEngine.updateScrollAnimation();
    this.sceneManager.updateScenes(initialScroll);
    this.animationEngine.applyAnimationState(document.documentElement, initialScroll);

    // Animation loop via requestAnimationFrame
    const animate = () => {
      const scrollPos = this.animationEngine.updateScrollAnimation();
      this.sceneManager.updateScenes(scrollPos);
      this.animationEngine.applyAnimationState(document.documentElement, scrollPos);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Subtle pointer parallax
    document.addEventListener('pointermove', (e) => {
      this.animationEngine.updatePointerParallax(e.clientX, e.clientY);
    }, { passive: true });

    // Fetch and populate verified sources
    this.loadSources();

    console.log('✓ Karachi — City of Light cinematic application initialized successfully.');
  }

  async loadSources() {
    const sourcesList = document.getElementById('sourcesList');
    if (!sourcesList) return;

    try {
      const response = await fetch('/api/content/sources');
      if (!response.ok) throw new Error('Failed to fetch sources');

      const sources = await response.json();

      if (Array.isArray(sources) && sources.length > 0) {
        sourcesList.innerHTML = sources.map(source => {
          const landmarkTitles = (source.landmarks || [])
            .map(l => l.landmark?.title || l.title || '')
            .filter(Boolean)
            .join(', ') || 'Karachi Archive';

          return `
            <div class="source-item">
              <div class="source-landmark">${landmarkTitles}</div>
              <div class="source-url">
                <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.title || source.url}</a>
              </div>
              <div class="source-license">
                ${source.license ? `License: ${source.license}` : ''}
                ${source.attributionRequired ? ' • Attribution Required' : ''}
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (error) {
      console.warn('Using static source fallback listing:', error);
      sourcesList.innerHTML = `
        <div class="source-item">
          <div class="source-landmark">Mazar-e-Quaid, Mohatta Palace, Frere Hall, Empress Market, Clifton Beach</div>
          <div class="source-url"><a href="/sources">Public Heritage & Wikimedia Archives</a></div>
          <div class="source-license">License: Creative Commons Attribution-ShareAlike</div>
        </div>
      `;
    }
  }
}

// Instantiate on document ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new KarachiCinematicApp().initialize();
  });
} else {
  new KarachiCinematicApp().initialize();
}
