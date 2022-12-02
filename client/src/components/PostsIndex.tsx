import { useContext } from "react";
import { BaseUrlContext } from '../index';
import Post from "./Post";
import useFetchPosts from "../hooks/useFetchPosts";

function PostsIndex() {
  const baseUrl = useContext<string | null>(BaseUrlContext);
  const { posts } = useFetchPosts(`${baseUrl}/posts`);

  if (posts === null) return <p>Loading...</p>;
  if (posts?.length === 0) return <p>No posts found.</p>;

  return (
    <div>
      { posts?.map((post) => {
        return <Post key={post.id} post={post} />
      })}
    </div>
  );
}

export default PostsIndex;