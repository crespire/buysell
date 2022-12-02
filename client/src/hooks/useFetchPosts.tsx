import { useState, useEffect } from 'react';
import { PostModel } from '../@types/post';

interface PostFetchHookInterface {
  posts: PostModel[] | null;
  refetch: Function;
  deletePost: (id: number) => void;
}

const useFetchPosts = (url:string): PostFetchHookInterface => {
  const [posts, setPosts] = useState<PostModel[] | null>(null);

  useEffect(() => {
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refetch = async () => {
    const data = await fetch(url, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',

      })
    .then((response) => response.json())
    .catch((err) => {
      setPosts([]);
      console.log(err);
    });

    if (data && !data.error) {
      setPosts(data);
    } else if ( data && data.error) {
      setPosts([]);
      console.log(data.error);
    }
  }

  const deletePost = (id: number): void => {
    // Delete Post on Backend.
    setPosts((prev) => {
      if (!prev) { return null }

      return prev.filter((post) => post.id === id)
    });
  }

  return {
    posts,
    refetch,
    deletePost
  };
};

export default useFetchPosts;