import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../providers/PostsApi";
import { PostModel } from "../@types/post";

function PostsIndex() {
  //const { isLoading, isError, data, error } = useQuery({
  //  queryKey: ['posts'],
  //  queryFn: fetchPosts,
  //  staleTime: 60 * 1000,
  //});

  //if (isLoading) return <button className="btn loading" disabled>Loading posts...</button>;
  //if (isError && error instanceof Error) return <div className="alert alert-error">Error: {error.message} </div>;

  const data = [
  {
    "id": 1,
      "title": "Test 1 Title",
      "body": "Test Post 1 Body",
      "created_at": "Rails date string created_at",
      "updated_at": "Rails date string updated_at",
      "account_id": 2,
      "status": 2,
      "account": {
        "name": "user1",
        "id": 2
      },
      "images": {}
  },
  {
    "id": 2,
    "title": "Test 2 Title",
    "body": "Test Post 2 Body",
    "created_at": "Rails date string created_at",
    "updated_at": "Rails date string updated_at",
    "account_id": 2,
    "status": 2,
    "account": {
      "name": "user1",
      "id": 2
    },
    "images": {}
  },
  {
    "id": 3,
    "title": "Post To Edit Title",
    "body": "Post To Edit Body",
    "created_at": "creation_time",
    "updated_at": "Rails date string updated_at",
    "account_id": 1,
    "status": 2,
    "account": {
      "name": "testuser1",
      "id": 1
    },
    "images": {}
  },

  {
    "id": 4,
    "title": "Post From Another User",
    "body": "Post That We Can't Edit because it's not ours.",
    "created_at": "Rails date string created_at",
    "updated_at": "Rails date string updated_at",
    "account_id": 2,
    "status": 2,
    "account": {
      "name": "testuser2",
      "id": 2
    },
    "images": {}
  }];

  return (
    <div data-testid="post-index" className="container flex flex-col justify-center content-center gap-y-3 bg-base-100">
      { data?.map((post: PostModel) => {
        return <Post key={post.id} post={post} />
      })}
    </div>
  );
}

export default PostsIndex;
