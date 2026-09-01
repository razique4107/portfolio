document.addEventListener('DOMContentLoaded', () => {
  async function loadProfile() {
    try {
      const response = await fetch('/api/users');
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      const user = await response.json();
      document.getElementById('profileEmail').textContent = user.email || '-';
      document.getElementById('profileName').textContent = user.displayName || '-';
      document.getElementById('profileCreated').textContent = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-';
      document.getElementById('profileLastLogin').textContent = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never';
      document.getElementById('profileLoginCount').textContent = user.loginCount ?? 0;
      document.getElementById('profileRole').textContent = user.role || 'USER';

      if (user.role === 'ADMIN') {
        const adminBtn = document.getElementById('adminPanelBtn');
        if (adminBtn) adminBtn.style.display = 'inline-block';
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('passwordMessage');
      msgEl.classList.remove('show');

      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (newPassword !== confirmPassword) {
        msgEl.textContent = 'Passwords do not match';
        msgEl.style.color = '#ff6b6b';
        msgEl.style.background = 'rgba(255, 107, 107, 0.1)';
        msgEl.style.borderLeftColor = '#ff6b6b';
        msgEl.classList.add('show');
        return;
      }

      try {
        const response = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Password change failed');
        }

        msgEl.style.color = '#34d399';
        msgEl.style.background = 'rgba(52, 211, 153, 0.1)';
        msgEl.style.borderLeftColor = '#34d399';
        msgEl.textContent = 'Password updated successfully!';
        msgEl.classList.add('show');
        passwordForm.reset();
      } catch (error) {
        msgEl.textContent = error.message;
        msgEl.style.color = '#ff6b6b';
        msgEl.style.background = 'rgba(255, 107, 107, 0.1)';
        msgEl.style.borderLeftColor = '#ff6b6b';
        msgEl.classList.add('show');
      }
    });
  }

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  });

  loadProfile();
});
