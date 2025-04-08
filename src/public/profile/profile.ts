
document.addEventListener('DOMContentLoaded', async () => {
    const usernameEl = document.getElementById('username')!;
    const firstNameEl = document.getElementById('firstName')!;
    const lastNameEl = document.getElementById('lastName')!;
    const birthDateEl = document.getElementById('birthDate')!;
    const registeredAtEl = document.getElementById('registeredAt')!;
    const postCountEl = document.getElementById('postCount')!;
    const commentCountEl = document.getElementById('commentCount')!;
    const postsContainer = document.getElementById('user-posts')!;
    const homeBtn = document.getElementById('home-btn')!;
  
    homeBtn.onclick = () => location.href = '/index.html';
  
    let user: any = null;
  
    try {
      const userRes = await fetch('/api/users/me', { credentials: 'include' });
      user = await userRes.json();
  
      usernameEl.textContent = user.username;
      firstNameEl.textContent = user.firstName;
      lastNameEl.textContent = user.lastName;
      birthDateEl.textContent = new Date(user.birthDate).toLocaleDateString();
      registeredAtEl.textContent = new Date(user.registeredAt).toLocaleString();
    } catch {
      alert('User not logged in');
      location.href = '/login/login.html';
    }
  
    try {
      const postRes = await fetch('/api/posts', { credentials: 'include' });
      const allPosts = await postRes.json();
      const userPosts = allPosts.filter((p: any) => p.author.id === user.id);
  
      postCountEl.textContent = userPosts.length.toString();
  
      userPosts.forEach((post: any) => {
        const section = document.createElement('section');
        section.className = 'post-preview';
  
        const title = document.createElement('h3');
        title.textContent = post.title;
        title.style.textAlign = 'center';
  
        const details = document.createElement('p');
        details.className = 'meta';
        details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${post.commentCount ?? 0} comments`;
  
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.onclick = () => location.href = `/post/post.html?post=${post.id}`;
  
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => location.href = `/post/editPost.html?post=${post.id}`;
  
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
            lockBtn.textContent = post.isLocked ? 'Lock' : 'Unlock';
            post.isLocked = !post.isLocked;
          }
        };
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = async () => {
          if (!confirm('Delete this post?')) return;
          const res = await fetch(`/api/posts/${post.id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          if (res.ok) {
            section.remove();
          }
        };
  
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.gap = '0.5rem';
        buttonRow.append(viewBtn, editBtn, lockBtn, deleteBtn);
  
        section.append(title, details, buttonRow);
        postsContainer.appendChild(section);
      });
    } catch {
      postCountEl.textContent = '0';
    }
  
    try {
      const commentRes = await fetch('/api/comments', { credentials: 'include' });
      const allComments = await commentRes.json();
      const userComments = allComments.filter((c: any) => c.author.id === user.id);
      commentCountEl.textContent = userComments.length.toString();
    } catch {
      commentCountEl.textContent = '0';
    }
  });
  