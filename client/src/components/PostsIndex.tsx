import { useEffect, useState, useContext } from "react";
import { useAuth } from "../providers/AuthProvider";
import { BaseUrlContext } from '../index';
import { PostModel } from "../@types/post";
import Post from "./Post";

function PostsIndex() {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const { user } = useAuth();
  const baseUrl = useContext<string | null>(BaseUrlContext);

  async function getPosts() {
    const data = await fetch(`${baseUrl}/posts`,
      {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        
      }).then((response) => response.json())
      .catch((err) => console.log('Error:', err));

      if (data && !data.error) {
        setPosts(data);
      }
  }

  useEffect(() => {
    getPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div>
      { posts.map((post) => {
        return <Post key={post.id} post={post} />
      })}
    </div>
  );
}

export default PostsIndex;