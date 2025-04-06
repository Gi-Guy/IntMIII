export interface PostAuthor {
    id: string;
    username: string;
  }
  
  export interface Post {
    id: string;         
    title: string;
    content: string;
    createdAt: number;     
    author: PostAuthor;
  }
  