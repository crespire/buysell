import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { BaseUrlContext } from '..';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

function PostForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = useContext(BaseUrlContext);
  const queryClient = useQueryClient();
  const addPost = async () => {
    const requestData = new FormData();
    
    // Capture all form data except file uploads
    for (const [key, value] of Object.entries(values)) {
      if (key === 'images') { continue; }

      requestData.append(`post[${key}]`, value);
    }

    if (values['images']) {
      // Adds file blobs to form data
      for (let i = 0; i < values['images'].length; i++) {
        requestData.append('post[images][]', values['images'][i], values['images'][i].name);
      }
    } else {
      requestData.append('post[images][]', '');
    }

    const response = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: requestData
    });
    
    if (!response.ok) {
      throw new Error(`${response.status} Response: ${await response.text()}`);
    } else {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    }
  }
  const { values, errors, handleBlur, handleChange, handleFiles, handleSubmit } = useForm(addPost);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, []);

  return (
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      <h1 className="text-5xl">New Post</h1>
      <form className="flex flex-col p-2 align-center justify-center gap-2" onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className="form-control w-full">
          <label htmlFor="title" className="label">
            <span className="label-text text-lg font-bold">Post Title</span>
          </label>
          <input className="input input-bordered w-full" id="title" name="title" type="text" placeholder="Post Title" value={values['title'] || ''} onBlur={handleBlur} onChange={handleChange} pattern=".{3,}" minLength={3} required={true} data-error="Title must be at least 3 characters long." />
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
          <input className="input input-bordered w-full" id="location" name="location" type="text" placeholder="Location" value={values['location'] || ''} onBlur={handleBlur} onChange={handleChange} maxLength={100} data-error="Must be less than 100 characters." />
          { errors.title && (
            <p className="alert alert-error">{ errors.title }</p>
          )}
        </div>
        <div className="form-control w-full">
          <label htmlFor="body" className="label">
            <span className="label-text text-lg font-bold">Post Body</span>
          </label>
          <textarea className="textarea textarea-bordered h-24 w-full" id="body" name="body" placeholder="Post content..." value={values['body'] || ''} onBlur={handleBlur} onChange={handleChange} minLength={5} required={true} data-error="Body must be at least 5 characters long." />
          { errors.body && (
            <p className="alert alert-error">{ errors.body }</p>
          )}
        </div>
        <div className="form-control w-full">
          <label htmlFor="images" className="label">
            <span className="label-text text-lg font-bold">Pictures</span>
          </label>
          <input className="file-input file-input-bordered w-full" type="file" name="images" accept="image/jpeg, image/gif, image/png, image/webp, image/apng" multiple={true} onBlur={handleBlur} onChange={handleFiles} />
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
          <button className="btn" type="submit">Create Post</button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
