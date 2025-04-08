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
  container.className = 'post-wrapper';

  const topBar = document.createElement('div');
  topBar.style.display = 'flex';
  topBar.style.justifyContent = 'space-between';
  topBar.style.marginBottom = '1.5rem';

  const leftButton = document.createElement('button');
  const rightButton = document.createElement('button');
  const profileButton = document.createElement('button');

  let user: User | null = null;

  try {
    const userRes = await fetch('/api/users/me', { credentials: 'include' });
    if (userRes.ok) {
      user = await userRes.json();

      leftButton.textContent = 'Create Post';
      leftButton.onclick = () => window.location.href = '/post/createPost.html';

      profileButton.textContent = 'Profile';
      profileButton.onclick = () => window.location.href = '/profile/profile.html';

      rightButton.textContent = 'Logout';
      rightButton.onclick = async () => {
        await fetch('/api/users/logout', { credentials: 'include' });
        location.reload();
      };

      topBar.append(leftButton, profileButton, rightButton);
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

    posts.sort((a, b) => b.createdAt - a.createdAt);

    posts.forEach(post => {
      const postDiv = document.createElement('section');
      postDiv.className = 'post-preview';

      const title = document.createElement('h2');
      title.textContent = post.title;
      title.style.textAlign = 'center';

      const details = document.createElement('p');
      details.className = 'meta';
      details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${post.commentCount ?? 0} comments | by ${post.author.username}`;

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View';
      viewBtn.onclick = () => location.href = `post/post.html?post=${post.id}`;

      const buttons = document.createElement('div');
      buttons.appendChild(viewBtn);

      if (user && (user.id === post.author.id || user.isAdmin)) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = async () => {
          const confirmed = confirm('Are you sure you want to delete this post?');
          if (!confirmed) return;

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

        const lockBtn = document.createElement('button');
        lockBtn.textContent = post.isLocked ? 'Unlock' : 'Lock';
        lockBtn.onclick = async () => {
          const res = await fetch(`/api/posts/${post.id}/lock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ isLocked: !post.isLocked })
          });

          if (res.ok) {
            post.isLocked = !post.isLocked;
            lockBtn.textContent = post.isLocked ? 'Unlock' : 'Lock';
          }
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => location.href = `/post/editPost.html?post=${post.id}`;

        buttons.append(editBtn, lockBtn, deleteBtn);
      }

      postDiv.append(title, details, buttons);
      container.appendChild(postDiv);
    });
  } catch (err) {
    container.textContent = 'Failed to load posts.';
  }
});
