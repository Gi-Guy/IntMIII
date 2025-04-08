type CommentData = {
  id: string;
  content: string;
  createdAt: number;
  author: {
    username: string;
  };
};

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  isLocked: boolean;
  author: {
    username: string;
  };
};

document.addEventListener('DOMContentLoaded', async () => {
  const url = new URL(window.location.href);
  const postId = url.searchParams.get('post');
  if (!postId) return;

  const titleEl = document.getElementById('post-title')!;
  const metaEl = document.getElementById('post-meta')!;
  const contentEl = document.getElementById('post-content')!;
  const commentsContainer = document.getElementById('comments-container')!;
  const commentBtn = document.getElementById('add-comment')!;

  const commentFormContainer = document.createElement('div');
  commentFormContainer.id = 'comment-form-container';
  commentsContainer.before(commentFormContainer);

  // Home button
  const homeBtn = document.getElementById('home-btn');
  homeBtn?.addEventListener('click', () => {
    window.location.href = '/index.html';
  });

  let user: any = null;
  let post: any = null;

  try {
    const meRes = await fetch('/api/users/me', { credentials: 'include' });
    if (meRes.ok) {
      user = await meRes.json();
    }
  } catch {}

  try {
    const res = await fetch(`/api/posts/${postId}`);
    post = await res.json();

    titleEl.textContent = post.title;
    contentEl.textContent = post.content;
    metaEl.innerHTML = `By <strong>${post.author.username}</strong> | ${new Date(post.createdAt).toLocaleString()}`;
  } catch {
    titleEl.textContent = 'Failed to load post';
    return;
  }
  if (user && (user.id === post.author.id || user.isAdmin)) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Post';
    editBtn.style.margin = '1rem auto';
    editBtn.onclick = () => {
      window.location.href = `/post/editPost.html?post=${post.id}`;
    };
    commentBtn.before(editBtn);
  }
  
  if (post.isLocked) {
    commentBtn.style.display = 'none';
    commentFormContainer.innerHTML = `
      <div class="comment-box" style="max-width: 600px; margin: auto; text-align: center;">
        <p>This post is locked for new comments.</p>
      </div>
    `;
  } else {
    commentBtn.addEventListener('click', () => {
      commentBtn.style.display = 'none';

      if (!user) {
        commentFormContainer.innerHTML = `
          <div class="comment-box" style="max-width: 600px; margin: auto; text-align: center;">
            <p>Please log in to leave a comment.</p>
            <button onclick="location.href='/login/login.html'">Login</button>
          </div>
        `;
      } else {
        commentFormContainer.innerHTML = `
          <form id="inline-comment-form">
            <textarea name="content" placeholder="Write your comment..." required rows="4"></textarea>
            <button type="submit">Submit</button>
            <p id="comment-message"></p>
          </form>
        `;
      }
    });
  }

  document.addEventListener('submit', async (e) => {
    const form = e.target as HTMLFormElement;
    if (form.id !== 'inline-comment-form') return;
    e.preventDefault();

    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
    const messageEl = document.getElementById('comment-message')!;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postId }),
        credentials: 'include'
      });

      const result = await res.json();

      if (res.ok) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-box';
        commentDiv.innerHTML = `<p><strong>${result.comment.author.username}</strong> | ${new Date(result.comment.createdAt).toLocaleString()}</p><p>${result.comment.content}</p>`;
        commentsContainer.prepend(commentDiv);

        form.reset();
        messageEl.textContent = 'Comment added!';
        messageEl.style.color = 'var(--accent)';
      } else {
        messageEl.textContent = result.message || 'Error adding comment';
        messageEl.style.color = 'var(--text)';
      }
    } catch {
      messageEl.textContent = 'Request failed';
      messageEl.style.color = 'var(--text)';
    }
  });

  try {
    const res = await fetch(`/api/comments/post/${postId}`);
    const comments: CommentData[] = await res.json();

    comments.forEach(c => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment-box';
      commentDiv.innerHTML = `<p><strong>${c.author.username}</strong> | ${new Date(c.createdAt).toLocaleString()}</p><p>${c.content}</p>`;
      commentsContainer.appendChild(commentDiv);
    });
  } catch {
    commentsContainer.textContent = 'Failed to load comments';
  }
});
