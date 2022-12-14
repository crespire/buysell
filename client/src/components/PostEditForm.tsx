import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import { editPost, getPost } from '../providers/PostsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function PostEditForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id)
  });
  const editPostMutation = useMutation({
    mutationFn: editPost,
    onSuccess: data => {
      queryClient.setQueryData(['post', id], data);
    },
    onSettled: () => {
      navigate(`/posts/${id}`);
    }
  });

  const { values, errors, handleBlur, handleChange, handleFiles, updateFiles, handleSubmit } = useForm(editPostMutation, data);

  /**
   * grab post ID from params
   * populate form
   * How should we handle the files?
   */

  if (!user) { return <p>You must be authorized to use this page.</p>; }
  if (isLoading) return <p>Loading...</p>;
  if (isError && error instanceof Error) return <p>Error: {error.message}</p>

  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl">Edit Post</h1>
      <form className="flex flex-col p-2 align-center justify-center" onSubmit={handleSubmit} encType='multipart/form-data'>
        <div>
          <label htmlFor="title">Title: </label>
          <input id="title" name="title" type="text" value={values['title'] || ''} onBlur={handleBlur} onChange={handleChange} pattern=".{3,}" minLength={3} required={true} data-error="Title must be at least 3 characters long." />
          { errors.title && <p>{ errors.title }</p> }
        </div>
        <div>
          <label htmlFor="body">Body: </label>
          <textarea id="body" name="body" value={values['body'] || ''} onBlur={handleBlur} onChange={handleChange} minLength={5} required={true} data-error="Body must be at least 5 characters long." />
          { errors.body && <p>{ errors.body }</p> }`
        </div>
        <div>
          <label htmlFor="images">Add New Pictures: </label>
          <input type="file" name="images_to_add" accept="image/jpeg, image/gif, image/png, image/webp, image/apng" multiple={true} onBlur={handleBlur} onChange={handleFiles} />
          { values['images'] && Object.keys(values['images']).length > 0 && (
              <div>Current Images to Delete:
                <ul>
                  {
                    Object.entries<string[]>(values['images']).map(([name, _], index) => {
                      return (
                        <li key={`${index}${values[`images_to_purge`] ? values['images_to_purge'].includes(name) : false}`}>
                          <input type="checkbox" checked={values[`images_to_purge`] ? values['images_to_purge'].includes(name) : false} name={name} onBlur={handleBlur} onChange={updateFiles} />
                          <label htmlFor={name}>&nbsp;{name}</label>
                        </li>
                      );
                    })
                  }
                  
                </ul>
              </div>
            )
          }
          </div>
        <div>
          <label htmlFor="status">Post Status</label>
          <select id="status" name="status" value={values['status'] || 'draft'} onBlur={handleBlur} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit">Update!</button>
      </form>
    </div>
    
  );
}

export default PostEditForm;