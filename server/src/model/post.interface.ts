/**
 * Define the Post model and its fields.
 */

export interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  creator: number;
}