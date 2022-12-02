import { useState, useEffect } from 'react';
import { PostModel } from '../@types/post';

interface PostFetchHookInterface {
  posts: PostModel[] | null;
  refetch: Function;
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

  return {
    posts,
    refetch,
  };
};

export default useFetchPosts;