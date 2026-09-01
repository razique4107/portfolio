document.addEventListener('DOMContentLoaded', () => {
  async function loadDashboard() {
    try {
      const [overviewRes, usersRes, eventsRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
        fetch('/api/admin/auth-events'),
      ]);

      if (overviewRes.status === 401 || usersRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (overviewRes.status === 403 || usersRes.status === 403) {
        document.getElementById('adminContainer').innerHTML = `
          <div style="padding: 40px; text-align: center; background: rgba(255,107,107,0.1); border: 1px solid #ff6b6b; border-radius: 8px;">
            <h2 style="color: #ff6b6b; margin-bottom: 12px;">Access Denied</h2>
            <p>You must have the ADMIN role to view this dashboard.</p>
            <a href="/account" class="btn-primary" style="display: inline-block; margin-top: 16px;">Return to Account</a>
          </div>
        `;
        return;
      }

      const overview = await overviewRes.json();
      const users = await usersRes.json();
      const events = await eventsRes.json();

      // Update overview cards
      document.getElementById('totalUsers').textContent = overview.users?.total ?? 0;
      document.getElementById('activeUsers').textContent = overview.users?.active ?? 0;
      document.getElementById('successLogins').textContent = overview.authentication?.successLogins ?? 0;
      document.getElementById('failedLogins').textContent = overview.authentication?.failedLogins ?? 0;

      // Update users table
      const tbody = document.getElementById('usersTableBody');
      if (tbody && Array.isArray(users)) {
        tbody.innerHTML = users.map(u => `
          <tr style="border-bottom: 1px solid rgba(253, 241, 225, 0.08);">
            <td style="padding: 14px 12px; font-weight: 500;">${escapeHtml(u.email)}</td>
            <td style="padding: 14px 12px;">${escapeHtml(u.displayName)}</td>
            <td style="padding: 14px 12px;"><span class="badge ${u.role === 'ADMIN' ? 'badge-gold' : 'badge-neutral'}">${escapeHtml(u.role)}</span></td>
            <td style="padding: 14px 12px;"><span class="badge ${u.isActive ? 'badge-success' : 'badge-danger'}">${u.isActive ? 'Active' : 'Disabled'}</span></td>
            <td style="padding: 14px 12px; font-size: 0.85rem; opacity: 0.8;">${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}</td>
            <td style="padding: 14px 12px; text-align: right;">
              <button class="action-btn toggle-status-btn" data-id="${u.id}" data-active="${u.isActive}">
                ${u.isActive ? 'Disable' : 'Enable'}
              </button>
            </td>
          </tr>
        `).join('');

        // Attach action handlers
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const userId = btn.dataset.id;
            const isActive = btn.dataset.active === 'true';
            const endpoint = isActive ? `/api/admin/users/${userId}/disable` : `/api/admin/users/${userId}/enable`;

            if (confirm(`Are you sure you want to ${isActive ? 'disable' : 'enable'} this user?`)) {
              await fetch(endpoint, { method: 'PATCH' });
              loadDashboard();
            }
          });
        });
      }

      // Update events list
      const eventsList = document.getElementById('eventsList');
      if (eventsList && Array.isArray(events)) {
        eventsList.innerHTML = events.map(e => `
          <div style="padding: 12px 16px; background: rgba(253, 241, 225, 0.04); border-radius: 6px; margin-bottom: 8px; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: var(--karachi-gold);">${escapeHtml(e.eventType)}</strong>
              <span style="margin: 0 8px;">—</span>
              <span>${escapeHtml(e.user?.displayName || 'Anonymous')} (${escapeHtml(e.user?.email || 'N/A')})</span>
            </div>
            <div style="font-size: 0.78rem; opacity: 0.7;">
              ${e.success ? '<span style="color:#34d399;">✓ Success</span>' : '<span style="color:#ff6b6b;">✗ Failed</span>'} • ${new Date(e.createdAt).toLocaleString()}
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  });

  loadDashboard();
});
