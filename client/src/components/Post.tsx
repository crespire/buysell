import { PostProps } from "../@types/post";
import { useAuth } from "../providers/AuthProvider";
import { BaseUrlContext } from "..";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../providers/PostsApi";
import { useNavigate } from "react-router";
import DropdownMenu from "./Dropdown";
import ImageViewer from "awesome-image-viewer";

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
  const jsDate = new Date(Date.parse(post?.created_at));

  return (
    <article>
      <header>{ post?.title }</header>
      <section className='post-info flex'>
        By { post?.account?.name } { jsDate && `posted on ${jsDate.toLocaleDateString()}.` }
        { user && (user.id === post?.account?.id || user.admin) && 
          <DropdownMenu
            className='post-tools px-1'
            links={[
            { name: 'Edit', url: `/posts/${post?.id}/edit` },
            { name: 'Delete', action: () => deletePostMutation.mutate(post?.id) }
            ]}
          >
            &#10247;
          </DropdownMenu>
        }
      </section>
      <section className='post-body'>
      <p>{ post?.body }</p>
      { Object.keys(post?.images).length > 0 && (
        <ul>
          { Object.entries(post?.images).map(([name, path]) => <li key={name}><img src={`${baseUrl}${path}`} alt={name} /></li> ) }
        </ul>
      )}
      </section>
    </article>
  );
}

export default Post;
