type PostPreview = {
  id: string;
  title: string;
  createdAt: number;
  commentCount: number;
  isLocked: boolean;
  author: {
    username: string;
    id: string;
  };
};

type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('posts-container') as HTMLElement;

  const topBar = document.createElement('div');
  topBar.style.display = 'flex';
  topBar.style.justifyContent = 'space-between';
  topBar.style.marginBottom = '1.5rem';

  const leftButton = document.createElement('button');
  const rightButton = document.createElement('button');

  let user: User | null = null;

  try {
    const userRes = await fetch('/api/users/me', { credentials: 'include' });
    if (userRes.ok) {
      user = await userRes.json();

      leftButton.textContent = 'Create Post';
      leftButton.onclick = () => window.location.href = '/post/createPost.html';

      rightButton.textContent = 'Logout';
      rightButton.onclick = async () => {
        await fetch('/api/users/logout', { credentials: 'include' });
        location.reload();
      };

      topBar.append(leftButton, rightButton);
    } else {
      const registerBtn = document.createElement('button');
      registerBtn.textContent = 'Register';
      registerBtn.onclick = () => window.location.href = '/register/register.html';

      const loginBtn = document.createElement('button');
      loginBtn.textContent = 'Login';
      loginBtn.onclick = () => window.location.href = '/login/login.html';

      topBar.append(registerBtn, loginBtn);
    }
  } catch (err) {
    console.error('User check failed');
  }

  document.body.insertBefore(topBar, container);

  try {
    const res = await fetch('/api/posts');
    const posts: PostPreview[] = await res.json();

    posts
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach(post => {
        const postDiv = document.createElement('section');
        postDiv.className = 'post-preview';

        const title = document.createElement('h2');
        title.textContent = post.title;
        title.style.textAlign = 'center';

        const details = document.createElement('p');
        details.className = 'meta';
        details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${post.commentCount ?? 0} comments | by ${post.author.username}`;

        const link = document.createElement('a');
        link.href = `post/post.html?post=${post.id}`;
        link.textContent = 'View Full Post';

        postDiv.append(title, details, link);

        if (user && (user.id === post.author.id || user.isAdmin)) {
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete Post';
          deleteBtn.style.marginLeft = '1rem';
          deleteBtn.onclick = async () => {
            const confirmDelete = confirm('Are you sure you want to delete this post?');
            if (!confirmDelete) return;

            const delRes = await fetch(`/api/posts/${post.id}`, {
              method: 'DELETE',
              credentials: 'include'
            });

            if (delRes.ok) {
              postDiv.remove();
            } else {
              alert('Failed to delete post');
            }
          };
          postDiv.appendChild(deleteBtn);

          const lockBtn = document.createElement('button');
          lockBtn.textContent = post.isLocked ? 'Unlock Post' : 'Lock Post';
          lockBtn.style.marginLeft = '0.5rem';
          lockBtn.onclick = async () => {
            const lockRes = await fetch(`/api/posts/${post.id}/lock`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ isLocked: !post.isLocked })
            });

            if (lockRes.ok) {
              post.isLocked = !post.isLocked;
              lockBtn.textContent = post.isLocked ? 'Unlock Post' : 'Lock Post';
            } else {
              alert('Failed to update lock status');
            }
          };
          postDiv.appendChild(lockBtn);
        }

        container.appendChild(postDiv);
      });
  } catch (err) {
    container.textContent = 'Failed to load posts.';
  }
});
