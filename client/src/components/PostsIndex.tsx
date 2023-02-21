import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../providers/PostsApi";
import { PostModel } from "../@types/post";

function PostsIndex() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
  });

  if (isLoading) return <button className="btn loading" disabled>Loading posts...</button>;
  if (isError && error instanceof Error) return <div className="alert alert-error">Error: {error.message} </div>;

  return (
    <div data-testid="post-index">
      { data?.map((post: PostModel) => {
        return <Post key={post.id} post={post} />
      })}
    </div>
  );
}

export default PostsIndex;
