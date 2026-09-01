// Auth page handlers
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotForm = document.getElementById('forgotForm');
  const resetForm = document.getElementById('resetForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  const showError = (msg) => {
    if (errorMessage) {
      errorMessage.textContent = msg;
      errorMessage.classList.add('show');
    }
    if (successMessage) successMessage.classList.remove('show');
  };

  const showSuccess = (msg) => {
    if (successMessage) {
      successMessage.textContent = msg;
      successMessage.classList.add('show');
    }
    if (errorMessage) errorMessage.classList.remove('show');
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorMessage) errorMessage.classList.remove('show');

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Invalid credentials');
        }

        if (data.user?.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/account';
        }
      } catch (error) {
        showError(error.message);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorMessage) errorMessage.classList.remove('show');

      const displayName = registerForm.displayName.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value;
      const confirmPassword = registerForm.confirmPassword.value;

      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, displayName, password, confirmPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        window.location.href = '/account';
      } catch (error) {
        showError(error.message);
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = forgotForm.email.value.trim();

      try {
        const response = await fetch('/api/auth/request-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        showSuccess(data.message || 'If that email exists, you will receive a reset link.');
        if (data._dev_token) {
          console.info(`[Dev Password Reset Token]: ${data._dev_token}`);
          showSuccess(`Reset link requested! Dev token: ${data._dev_token} (Visit /reset-password?token=${data._dev_token})`);
        }
      } catch (error) {
        showError(error.message);
      }
    });
  }

  if (resetForm) {
    // Auto-fill token from query parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl && resetForm.token) {
      resetForm.token.value = tokenFromUrl;
    }

    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = resetForm.token.value.trim();
      const password = resetForm.password.value;
      const confirmPassword = resetForm.confirmPassword.value;

      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }

      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password, confirmPassword }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Reset failed');

        showSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } catch (error) {
        showError(error.message);
      }
    });
  }
});
