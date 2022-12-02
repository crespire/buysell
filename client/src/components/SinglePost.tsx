import { useParams } from 'react-router-dom';
import { BaseUrlContext } from "..";
import { useContext } from 'react';
import Post from "./Post";
import useFetchPosts from "../hooks/useFetchPosts";

function SinglePost(): JSX.Element {
  const baseUrl = useContext(BaseUrlContext);
  const { id } = useParams();
  const { posts } = useFetchPosts(`${baseUrl}/posts/${id}`);

  if (posts === null) return <p>Loading...</p>;
  if (posts.length === 0) return <p>Post not found.</p>

  return <Post key={posts[0].id} post={posts[0]} />;
}

export default SinglePost;