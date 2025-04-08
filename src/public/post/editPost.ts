// public/post/editPost.ts

document.addEventListener('DOMContentLoaded', async () => {
    const url = new URL(window.location.href);
    const postId = url.searchParams.get('post');
    if (!postId) return;
  
    const form = document.getElementById('edit-post-form') as HTMLFormElement;
    const message = document.getElementById('edit-message')!;
    const titleInput = form.elements.namedItem('title') as HTMLInputElement;
    const contentInput = form.elements.namedItem('content') as HTMLTextAreaElement;

      // Home button
    const homeBtn = document.getElementById('home-btn');
    homeBtn?.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
    // const homeBtn = document.getElementById('home-btn')!;
    // homeBtn.onclick = () => location.href = '/index.html';
  
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const post = await res.json();
      titleInput.value = post.title;
      contentInput.value = post.content;
    } catch {
      message.textContent = 'Failed to load post';
    }
  
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: titleInput.value,
            content: contentInput.value
          })
        });
        const result = await res.json();
        if (res.ok) {
          window.location.href = `/post/post.html?post=${postId}`;
        } else {
          message.textContent = result.message;
          message.style.color = 'var(--text)';
        }
      } catch {
        message.textContent = 'Update failed';
        message.style.color = 'var(--text)';
      }
    };
  });
  