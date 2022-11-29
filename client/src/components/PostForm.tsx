import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { BaseUrlContext } from '..';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function PostForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = useContext(BaseUrlContext);
  const submitForm = async () => {
    const requestData = new FormData();
    
    for (const [key, value] of Object.entries(values)) {
      requestData.append(`post[${key}]`, value);
    }

    requestData.append("post[status]", 'draft');

    await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: requestData
    }).then(response => response.json()).then(data => {
      console.log('Response:', data);
      navigate('/');
    }).catch(err => console.log('Error:', err));
  }
  const { values, errors, handleBlur, handleChange, handleFiles, handleSubmit } = useForm(submitForm);

  if (!user) { return <p>You must be authorized to use this page.</p>; }

  return (
    <div className="flex flex-col p-2">
      <h1>New Post</h1>
      <form className="flex flex-col p-2 align-center justify-center" onSubmit={handleSubmit}>
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
          <label htmlFor="images">Pictures: </label>
          <input type="file" name="images" accept="image/*" multiple={true} onBlur={handleBlur} onChange={handleFiles} />
        </div>
        <button type="submit">Post!</button>
      </form>
    </div>
    
  );
}

export default PostForm;