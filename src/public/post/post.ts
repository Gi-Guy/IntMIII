type CommentData = {
  id: string;
  content: string;
  createdAt: number;
  author: {
    username: string;
    id: string;
  };
};

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  isLocked: boolean;
  likes: string[];
  author: {
    username: string;
    id: string;
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

  const homeBtn = document.getElementById('home-btn');
  homeBtn?.addEventListener('click', () => {
    window.location.href = '/index.html';
  });
  if (homeBtn) homeBtn.style.backgroundColor = 'var(--secondary)';

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

    const likeBtn = document.createElement('button');
    likeBtn.textContent = post.likes.includes(user?.id) ? 'Unlike' : 'Like';
    likeBtn.style.margin = '1rem 0';
    likeBtn.onclick = async () => {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) {
        const updated = await res.json();
        likeBtn.textContent = updated.likes.includes(user?.id) ? 'Unlike' : 'Like';
        likesInfo.textContent = `${updated.likes.length} like(s)`;
      }
    };

    const likesInfo = document.createElement('p');
    likesInfo.textContent = `${post.likes.length} like(s)`;
    metaEl.after(likeBtn, likesInfo);
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

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Post';
    deleteBtn.style.margin = '1rem auto 1rem 0.5rem';
    deleteBtn.style.backgroundColor = 'var(--secondary)';
    deleteBtn.onclick = async () => {
      const confirmDelete = confirm('Are you sure you want to delete this post?');
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (res.ok) {
          alert('Post deleted successfully');
          window.location.href = '/index.html';
        } else {
          alert('Failed to delete post');
        }
      } catch {
        alert('Error deleting post');
      }
    };

    const actionContainer = document.createElement('div');
    actionContainer.append(editBtn, deleteBtn);

    commentBtn.before(actionContainer);
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

      if (user && (user.isAdmin || user.id === c.author.id)) {
        const deleteCommentBtn = document.createElement('button');
        deleteCommentBtn.textContent = 'Delete';
        deleteCommentBtn.style.marginTop = '0.5rem';
        deleteCommentBtn.style.backgroundColor = 'var(--secondary)';
        deleteCommentBtn.onclick = async () => {
          const confirmed = confirm('Delete this comment?');
          if (!confirmed) return;

          const delRes = await fetch(`/api/comments/${c.id}`, {
            method: 'DELETE',
            credentials: 'include'
          });

          if (delRes.ok) {
            commentDiv.remove();
          } else {
            alert('Failed to delete comment');
          }
        };

        commentDiv.appendChild(deleteCommentBtn);
      }

      commentsContainer.appendChild(commentDiv);
    });
  } catch {
    commentsContainer.textContent = 'Failed to load comments';
  }
});
