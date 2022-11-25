interface AccountIncludesModel {
  name: string;
}

export interface PostProps {
  post?: PostModel;
}

export interface PostModel {
  id:	number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  account: AccountIncludesModel;
}
