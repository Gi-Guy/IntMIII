document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const message = document.getElementById('message') as HTMLParagraphElement;
    const toRegister = document.getElementById('to-register') as HTMLButtonElement;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const res = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          message.textContent = 'Login successful!';
          message.style.color = 'var(--text)';
          window.location.href = '/index.html';
        } else {
          message.textContent = result.message || 'Invalid credentials';
          message.style.color = 'var(--text)';
        }
      } catch (err) {
        message.textContent = 'Login request failed.';
        message.style.color = 'var(--text)';
      }
    });
  
    toRegister?.addEventListener('click', () => {
      window.location.href = '/register/register.html';
    });
  });