import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { BaseUrlContext } from '..';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function PostForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = useContext(BaseUrlContext);
  const addPost = async () => {
    const requestData = new FormData();
    
    // Capture all form data except file uploads
    for (const [key, value] of Object.entries(values)) {
      if (key === 'images') { continue; }

      requestData.append(`post[${key}]`, value);
    }

    // Adds default status of 'draft'
    requestData.append("post[status]", 'draft');

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
      navigate('/');
    }
  }
  const { values, errors, handleBlur, handleChange, handleFiles, handleSubmit } = useForm(addPost);

  if (!user) { return <p>You must be authorized to use this page.</p>; }

  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl">New Post</h1>
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
          <label htmlFor="status">Post Status</label>
          <select id="status" name="status" value={values['status'] || 'draft'} onBlur={handleBlur} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label htmlFor="images">Pictures: </label>
          <input type="file" name="images" accept="image/jpeg, image/gif, image/png, image/webp, image/apng" multiple={true} onBlur={handleBlur} onChange={handleFiles} />
        </div>
        <button type="submit">Post!</button>
      </form>
    </div>
    
  );
}

export default PostForm;