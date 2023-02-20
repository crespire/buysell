import { PostProps } from "../@types/post";
import { useAuth } from "../providers/AuthProvider";
import { BaseUrlContext } from "..";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../providers/PostsApi";
import { useNavigate } from "react-router";
import DropdownMenu from "./Dropdown";
import ImageCarousel from "./ImageCarousel";

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
  const imageData: Array<{ 'mainUrl': string, 'description'?: string }> = [];
  if (post?.images) {
    Object.entries(post.images).forEach((entry) => {
      imageData.push({'mainUrl': `${baseUrl}${entry[1]}`, 'description': entry[0]})
    });
  }

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
        <>
          <p>{ post?.body }</p>
          { imageData.length > 0 && (
            <ImageCarousel images={imageData} />
          )}
       </>
      </section>
    </article>
  );
}

export default Post;
