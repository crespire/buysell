import { useParams } from 'react-router-dom';
import Post from "./Post";
import { getPost } from '../providers/PostsApi';
import { useQuery } from '@tanstack/react-query';

function SinglePost(): JSX.Element {
  const { id } = useParams();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPost(id)
  });

  console.log(data);

  if (isLoading) return <p>Loading...</p>;
  if (isError && error instanceof Error) return <p>Post not found: {error.message}</p>

  return <Post key={data?.id} post={data} />;
}

export default SinglePost;