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
    <form>
      Post submission form
    </form>
  );
}

export default PostForm;