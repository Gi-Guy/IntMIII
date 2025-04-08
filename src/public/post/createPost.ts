
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-post-form') as HTMLFormElement;
    const message = document.getElementById('message') as HTMLParagraphElement;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        });
  
        const result = await res.json();
  
        if (res.ok) {
          message.textContent = 'Post created successfully!';
          message.style.color = 'var(--accent)';
          form.reset();
          setTimeout(() => {
            window.location.href = '/index.html';
          }, 1000);
        } else {
          message.textContent = result.message || 'Error creating post.';
          message.style.color = 'var(--text)';
        }
      } catch (err) {
        message.textContent = 'Request failed.';
        message.style.color = 'var(--text)';
      }
    });
  });
  