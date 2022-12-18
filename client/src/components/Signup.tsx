import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Signup() {
  const { user, authErrors, signUp } = useAuth();
  const navigate = useNavigate();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(signUp);

  useEffect(() => {
    if(user) {
      navigate('/');
    }
  }, [user, navigate])

  return (
    <div>
      <h1 className="text-2xl">Sign Up</h1>
      { authErrors && <div className="text-red-800">Something went wrong! { authErrors['error'] }.</div> }
      <form className="flex flex-col align-center justify-center space-x-2" onSubmit={(e) => {handleSubmit(e, values['email'], values['pass'], values['name'])}}>
        <ul className="list-inside list-disc">
          <li>Fields with * are required.</li>
          <li>Password must be 8 characters long and contain at least one digit.</li>
        </ul>
        <div className="p-2">
          <label htmlFor="email">Email*:</label>
          <input className="border-b border-black border-solid" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          { errors.email && <p className="text-red-500">{errors.email}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="pass">Password*: </label>
          <input className="border-b border-black border-solid" type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
          { errors.pass && <p className="text-red-500">{errors.pass}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="passconf">Confirm*: </label>
          <input className="border-b border-black border-solid" type="password" required name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['pass']}$`} data-error="Passwords must match." />
          { errors.passconf && <p className="text-red-500">{errors.passconf}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="name">Username: </label>
          <input className="border-b border-black border-solid" type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values['name'] || ''} pattern="^\w{3,36}$|^$" data-error="Must be between 3 and 36 characters, and only contain word characters." />
          { errors.name && <p className="text-red-500">{errors.name}</p> }
        </div>
        <button className="p-2 border border-solid border-black" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Signup;