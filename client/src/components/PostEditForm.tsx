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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

  if (!user) { return <p className="alert alert-warning">You must be authorized to use this page.</p>; }
  if (isLoading) return <button className="btn loading">Loading...</button>;
  if (isError && error instanceof Error) return <p className="alert alert-error">Error: {error.message}</p>

  return (
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      <h1 className="text-5xl">Edit Post</h1>
      <form className="flex flex-col p-2 align-center justify-center gap-2" onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className="form-control w-full">
          <label htmlFor="title" className="label">
            <span className="label-text text-lg font-bold">Post Title</span>
          </label>
          <input className="input input-bordered w-full" id="title" name="title" type="text" value={values['title'] || ''} onBlur={handleBlur} onChange={handleChange} pattern=".{3,}" minLength={3} required={true} data-error="Title must be at least 3 characters long." />
          { errors.title && (
            <p className="alert alert-error">{ errors.title }</p>
          )}
        </div>
        <div className="form-control w-full">
          <label htmlFor="title" className="label">
            <span className="label-text text-lg font-bold">Price</span>
          </label>
          <input className="input input-bordered w-full" id="price" name="price" type="text" placeholder="12.34" value={values['price'] || ''} onBlur={handleBlur} onChange={handleChange} pattern="^\d{1,4}(\.\d{1,2})?$" data-error="Price must be blank, or a number greater than 0 and less than 10,000." />
          { errors.price && (
            <p className="alert alert-error">{ errors.price }</p>
          )}
        </div>
        <div className="form-control w-full">
          <label htmlFor="title" className="label">
            <span className="label-text text-lg font-bold">Location</span>
          </label>
          <input className="input input-bordered w-full" id="location" name="location" type="text" placeholder="Location" value={values['location'] || ''} onBlur={handleBlur} onChange={handleChange} pattern="\s*" maxLength={100} data-error="Must be less than 100 characters." />
          { errors.title && (
            <p className="alert alert-error">{ errors.title }</p>
          )}
        </div>
        <div className="form-control w-full">
          <label htmlFor="body" className="label">
            <span className="label-text text-lg font-bold">Post Body</span>
          </label>
          <textarea className="textarea textarea-bordered h-24 w-full" id="body" name="body" value={values['body'] || ''} onBlur={handleBlur} onChange={handleChange} minLength={5} required={true} data-error="Body must be at least 5 characters long." />
          { errors.body && (
            <p className="alert alert-error">{ errors.body }</p>
          )}
        </div>
        <div className="form-control w-full">
          <label htmlFor="images" className="label">
            <span className="label-text text-lg font-bold">Add New Pictures</span>
          </label>
          <input className="file-input file-input bordered w-full" type="file" name="images_to_add" accept="image/jpeg, image/gif, image/png, image/webp, image/apng" multiple={true} onBlur={handleBlur} onChange={handleFiles} />
          { values['images'] && Object.keys(values['images']).length > 0 && (
              <div className="form-control">
                <span className="text-lg font-bold">Current Images to Delete</span>
                <ul>
                  {
                    Object.entries<string[]>(values['images']).map(([name, _], index) => {
                      return (
                        <li key={`${index}${values[`images_to_purge`] ? values['images_to_purge'].includes(name) : false}`}>
                          <label className="label cursor-pointer flex gap-x-2">
                            <input className="checkbox " type="checkbox" checked={values[`images_to_purge`] ? values['images_to_purge'].includes(name) : false} name={name} onBlur={handleBlur} onChange={updateFiles} />
                            <span className="label-text text-start grow">{name}</span>
                          </label>
                        </li>
                      );
                    })
                  }
                  
                </ul>
              </div>
            )
          }
          </div>
        <div className="form-control w-full">
          <label htmlFor="status" className="input-group">
            <span>Post Status</span>
            <select className="select select-bordered grow" id="status" name="status" value={values['status'] || 'draft'} onBlur={handleBlur} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>
        <div className="form-control w-full">
          <button className="btn" type="submit">Update Post</button>
        </div>
      </form>
    </div>
    
  );
}

export default PostEditForm;
