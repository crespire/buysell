// Stripped down user model for post index end point
interface UserIncludesModel {
  name: string;
  id: number;
}

export interface PostProps {
  post?: PostModel | Record<string, any>;
}

export interface PostModel {
  id:	number | null;
  title: string | null;
  body: string | null;
  price: string | null;
  location: string | null;
  created_at: string | null;
  updated_at: string | null;
  status: 1 | 2 | 3 | null; // draft, published, closed
  account: UserIncludesModel | null;
  images: Record<string, string> | null;
}
