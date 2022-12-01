import { PostProps } from "../@types/post";

function Post(props: PostProps) {
  const { post } = props;

  return (
    <article>
      <header>{ post?.title }</header>
      <span>By { post?.account?.name }, posted on { post?.created_at }</span>
      <p>{ post?.body }</p>
    </article>
  );
}

export default Post;