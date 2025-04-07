// // public/index.ts

// document.addEventListener('DOMContentLoaded', async () => {
//     const container = document.getElementById('posts-container');
//     if (!container) return;
  
//     try {
//       const res = await fetch('/api/posts');
//       const posts = await res.json();
  
//       posts.forEach((post: any) => {
//         const postEl = document.createElement('div');
//         postEl.className = 'post-preview';
//         postEl.innerHTML = `
//           <h2>${post.title}</h2>
//           <p>Posted: ${new Date(post.createdAt).toLocaleString()}</p>
//           <p>By: ${post.author?.username || 'Unknown'} | Comments: ${post.comments?.length || 0}</p>
//           <a href="/post.html?id=${post.id}" class="view-post">View Post</a>
//         `;
  
//         if (post.author?.id === getCurrentUserId() || isAdmin()) {
//           const editBtn = document.createElement('button');
//           editBtn.textContent = 'Edit';
//           editBtn.onclick = () => {
//             window.location.href = `/edit-post.html?id=${post.id}`;
//           };
//           postEl.appendChild(editBtn);
//         }
  
//         container.appendChild(postEl);
//       });
//     } catch (err) {
//       container.innerHTML = '<p>Error loading posts</p>';
//     }
//   });
  
//   function getCurrentUserId(): string | null {
//     // placeholder – replace with cookie/localStorage/token logic
//     return localStorage.getItem('userId');
//   }
  
//   function isAdmin(): boolean {
//     return localStorage.getItem('isAdmin') === 'true';
//   }
type PostPreview = {
    id: string;
    title: string;
    createdAt: number;
    commentCount: number;
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
  
    try {
      const userRes = await fetch('/api/users/me', { credentials: 'include' });
      if (userRes.ok) {
        const user: User = await userRes.json();
  
        leftButton.textContent = 'Create Post';
        leftButton.onclick = () => window.location.href = '/createPost.html';
  
        rightButton.textContent = 'Logout';
        rightButton.onclick = async () => {
          document.cookie = 'token=; Max-Age=0';
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
          const postDiv = document.createElement('div');
          postDiv.className = 'post-preview';
  
          const title = document.createElement('h2');
          title.textContent = post.title;
          title.style.textAlign = 'center';
  
          const details = document.createElement('p');
          details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${post.commentCount} comments | by ${post.author.username}`;
  
          const link = document.createElement('a');
          link.href = `/post/${post.id}.html`;
          link.textContent = 'View Full Post';
  
          postDiv.append(title, details, link);
          container.appendChild(postDiv);
        });
    } catch (err) {
      container.textContent = 'Failed to load posts.';
    }
  });