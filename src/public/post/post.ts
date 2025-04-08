// public/post.ts

// Renamed to avoid conflict with built-in DOM type 'Comment'
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

  commentBtn.addEventListener('click', () => {
    window.location.href = `/comments/addComment.html?post=${postId}`;
  });

  try {
    const res = await fetch(`/api/posts/${postId}`);
    const post: Post = await res.json();

    titleEl.textContent = post.title;
    contentEl.textContent = post.content;
    metaEl.innerHTML = `By <strong>${post.author.username}</strong> | ${new Date(post.createdAt).toLocaleString()}`;
  } catch {
    titleEl.textContent = 'Failed to load post';
  }

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
