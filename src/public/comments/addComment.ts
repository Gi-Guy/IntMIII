
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-comment-form') as HTMLFormElement;
    const message = document.getElementById('message') as HTMLParagraphElement;
  
    const url = new URL(window.location.href);
    const postId = url.searchParams.get('post');
  
    if (!postId) {
      message.textContent = 'Missing post ID';
      return;
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      (data as any).postId = postId;
  
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        });
  
        const result = await res.json();
  
        if (res.ok) {
          message.textContent = 'Comment submitted!';
          message.style.color = 'var(--accent)';
          form.reset();
          setTimeout(() => {
            window.location.href = `/post/post.html?post=${postId}`;
          }, 1000);
        } else {
          message.textContent = result.message || 'Error submitting comment';
          message.style.color = 'var(--text)';
        }
      } catch (err) {
        message.textContent = 'Request failed';
        message.style.color = 'var(--text)';
      }
    });
  });
  