import { PostProps } from "../@types/post";
import { useAuth } from "../providers/AuthProvider";
import { BaseUrlContext } from "..";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../providers/PostsApi";
import { useNavigate } from "react-router";

function Post(props: PostProps) {
  const { post } = props;
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const baseUrl = useContext(BaseUrlContext);
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSettled: () => { 
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/')
    }
  });

  return (
    <article>
      <header>{ post?.title }</header>
      <span>By { post?.account?.name }, posted on { post?.created_at }</span>
      { user && user?.id === post?.account?.id && <button onClick={() => deletePostMutation.mutate(post?.id)}>Delete</button> }
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