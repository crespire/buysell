import { PostModel } from "../@types/post";
import { useParams } from 'react-router-dom';
import { BaseUrlContext } from "..";
import { useEffect, useContext, useState } from 'react';
import Post from "./Post";

console.log('Single post!');

function SinglePost(): JSX.Element {
  const [post, setPost] = useState<PostModel[] | null>(null);
  const { id } = useParams();
  const baseUrl = useContext(BaseUrlContext);

  async function getPost() {
    const data = await fetch(`${baseUrl}/posts/${id}`,
      {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
    .then((response) => response.json())
    .catch((err) => {
      setPost([]);
      console.log('Error:', err);
    });

    if (data && !data.error) {
      setPost([data]);
    } else if (data && data.error) {
      setPost([]);
      console.log('Error:', data.error);
    }
  }

  useEffect(() => {
    getPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (post === null) return <p>Loading...</p>;
  if (post.length === 0) return <p>Post not found.</p>

  return <Post key={post[0].id} post={post[0]} />;
}

export default SinglePost;