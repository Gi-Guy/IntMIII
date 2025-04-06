export interface CommentAuthor {
    id: string;
    username: string;
  }
  
  export interface Comment {
    id: string;             
    postId: string;         
    content: string;
    createdAt: number;
    author: CommentAuthor;
  }
  