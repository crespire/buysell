import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { BaseUrlContext } from '..';
import { useContext } from 'react';

function PostForm() {
  const { user } = useAuth();
  const baseUrl = useContext(BaseUrlContext);
  const submitForm = () => {
    // fetch to submit post content
  }
  const { values, errors, handleBlur, handleChange, handleSubmit } = useForm(submitForm);

  return (
    <div>
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title: </label>
        <input id="title" name="title" type="text" value={values['title'] || ''} onBlur={handleBlur} onChange={handleChange} pattern=".{3,}" minLength={3} required={true} data-error="Title must be at least 3 characters long." />
        { errors.title && <p>{ errors.title }</p> }
        <label htmlFor="body">Body: </label>
        <textarea id="body" name="body" value={values['body'] || ''} onBlur={handleBlur} onChange={handleChange} minLength={5} required={true} data-error="Body must be at least 5 characters long." />
        { errors.body && <p>{ errors.body }</p> }
      </form>
    </div>
    
  );
}

export default PostForm;