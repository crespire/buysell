import { PostProps } from "../@types/post";
import { useAuth } from "../providers/AuthProvider";
import { BaseUrlContext } from "..";
import { useContext } from "react";

function Post(props: PostProps) {
  const { post } = props;
  const { user } = useAuth();
  const baseUrl = useContext(BaseUrlContext);

  return (
    <article>
      <header>{ post?.title }</header>
      <span>By { post?.account?.name }, posted on { post?.created_at }</span>
      { user && user?.id === post?.account?.id && <span>Delete</span> }
      <p>{ post?.body }</p>
      { Object.keys(post?.images).length > 0 && (
        <ul>
          { Object.entries(post?.images).map(([name, path]) => <li key={name}><img src={`${baseUrl}${path}`} alt={name} /></li> ) }
        </ul>
      )}
    </article>
  );
}

export default Post;