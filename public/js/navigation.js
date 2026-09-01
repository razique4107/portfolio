export class NavigationManager {
  constructor() {
    this.header = document.getElementById('header');
    this.authNavContainer = document.getElementById('authNavContainer');
    this.heritageBtn = document.getElementById('heritageNotesBtn');
    this.modal = document.getElementById('heritageModal');
    this.modalClose = document.getElementById('heritageModalClose');
    this.modalBackdrop = document.getElementById('modalBackdrop');
    this.lastActiveElement = null;
  }

  initialize() {
    // Header scroll background toggle
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        this.header?.classList.add('scrolled');
      } else {
        this.header?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Heritage Modal open/close
    this.heritageBtn?.addEventListener('click', () => {
      this.openModal();
    });

    this.modalClose?.addEventListener('click', () => {
      this.closeModal();
    });

    this.modalBackdrop?.addEventListener('click', () => {
      this.closeModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('open')) {
        this.closeModal();
      }
    });

    // Logo navigation
    const logo = document.querySelector('.site-logo');
    logo?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Anchor Link & Pill Smooth Navigation
    document.querySelectorAll('.nav-link, .pill').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dataTarget = link.getAttribute('data-target');
        if (dataTarget !== null) {
          window.scrollTo({ top: parseInt(dataTarget, 10), behavior: 'smooth' });
          return;
        }

        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetOffset = this.resolveAnchorScrollPosition(href);
          window.scrollTo({ top: targetOffset, behavior: 'smooth' });
        }
      });
    });

    // Update Header Auth state dynamically
    this.checkAuthState();
  }

  resolveAnchorScrollPosition(hash) {
    const map = {
      '#cinema': 0,
      '#mazar': 800,
      '#heritage': 1700,
      '#coast': 3600,
      '#sights': 4400,
      '#sources': 5100,
    };
    return map[hash] ?? 0;
  }

  openModal() {
    if (!this.modal) return;
    this.lastActiveElement = document.activeElement;
    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.modalClose?.focus();
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (this.lastActiveElement && typeof this.lastActiveElement.focus === 'function') {
      this.lastActiveElement.focus();
    }
  }

  async checkAuthState() {
    if (!this.authNavContainer) return;

    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const user = await response.json();
        let html = '';

        if (user.role === 'ADMIN') {
          html += '<a href="/admin" class="auth-button" style="border-color: var(--karachi-gold); color: var(--karachi-gold);">ADMIN</a>';
        }

        html += '<a href="/account" class="auth-button">ACCOUNT</a>';
        html += '<button id="navLogoutBtn" class="auth-button">LOGOUT</button>';

        this.authNavContainer.innerHTML = html;

        document.getElementById('navLogoutBtn')?.addEventListener('click', async () => {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.reload();
        });
      } else {
        this.authNavContainer.innerHTML = '<a href="/login" class="auth-button" id="authButton">LOGIN</a>';
      }
    } catch (e) {
      this.authNavContainer.innerHTML = '<a href="/login" class="auth-button" id="authButton">LOGIN</a>';
    }
  }
}
