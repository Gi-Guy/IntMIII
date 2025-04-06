export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;               
  username: string;
  password: string;       
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: Gender;
  isAdmin: boolean;
  registeredAt: number;  
}