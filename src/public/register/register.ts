document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form') as HTMLFormElement;
    const message = document.getElementById('message') as HTMLParagraphElement;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          message.textContent = 'Registration successful!';
          message.style.color = 'var(--accent)';
          form.reset();
        } else {
          message.textContent = result.message || 'Error registering.';
          message.style.color = 'var(--primary)';
        }
      } catch (err) {
        message.textContent = 'Request failed.';
        message.style.color = 'var(--primary)';
      }
    });
  });