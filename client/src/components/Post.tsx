import { PostProps } from "../@types/post";
import { useAuth } from "../providers/AuthProvider";

function Post(props: PostProps) {
  const { post } = props;
  const { user } = useAuth();

  return (
    <article>
      <header>{ post?.title }</header>
      <span>By { post?.account?.name }, posted on { post?.created_at }</span>
      { user?.id === post?.account?.id && <span>Delete</span> }
      <p>{ post?.body }</p>
    </article>
  );
}

export default Post;