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

  if (isLoading) return <p>Loading...</p>;
  if (isError && error instanceof Error) return <p>Error: {error.message} </p>;

  return (
    <div>
      { data?.map((post: PostModel) => {
        return <Post key={post.id} post={post} />
      })}
    </div>
  );
}

export default PostsIndex;