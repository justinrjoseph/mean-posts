import { User } from './user';

export interface Post {
  _id?: string;
  title: string;
  content: string;
  imagePath: string;
  user?: User;
}

export interface PostData {
  posts: Post[];
  count: number;
}
