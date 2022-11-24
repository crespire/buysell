import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from 'react-router-dom';

interface PostInterface {
    id:	number;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
    account_id: number;
}

function PostsIndex() {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  /** Removing this just to test what my session cookie does.
  useEffect(() => {
    if (user === null || [1, 3].includes(user?.status)) { 
      console.log('User not authorized or wrong status.');
      navigate('/');
    }
  }, [user, navigate])
  */

  async function getPosts() {
    const data = await fetch('http://localhost:3000/posts',
      {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        
      }).then((response) => response.json())
      .catch((err) => console.log('Error:', err));

      if (!data.error) {
        setPosts(data);
      }
  }

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <div>
      Page is not auth'd by front end. Making request to backend on a protected endpoint.
      { posts.map((post) => {
        return (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        )
      })}
    </div>
  );
}

export default PostsIndex;