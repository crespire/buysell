import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      <h1 className="text-5xl">Sign Up</h1>
      <ul className="bg-info p-2 list-inside list-disc">
        <li>Fields with * are required.</li>
        <li>Password must be 8 characters long and contain at least one digit.</li>
      </ul>
      <form className="flex flex-col align-center justify-center gap-2" onSubmit={(e) => {handleSubmit(e, values['email'], values['pass'], values['name'])}}>
        { authErrors && <div className="alert alert-error">Something went wrong! { authErrors['error'] }.</div> }
        <div className="form-control">
          <label htmlFor="email" className="input-group">
            <span className="w-1/3">Email<sup>*</sup></span>
            <input className="input input-bordered w-full" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          </label>
          { errors.email && (
            <p className="alert alert-error">{errors.email}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="pass" className="input-group">
            <span className="w-1/3">Password<sup>*</sup></span>
            <input className="input input-bordered w-full" type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
          </label>
          { errors.pass && (
            <p className="alert alert-error">{errors.pass}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="passconf" className="input-group">
            <span className="w-1/3">Confirm<sup>*</sup></span>
            <input className="input input-bordered w-full" type="password" required name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['pass']}$`} data-error="Passwords must match." />
          </label>
          { errors.passconf && (
            <p className="alert alert-error">{errors.passconf}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="name" className="input-group">
            <span className="w-1/3">Username</span>
            <input className="input input-bordered w-full" type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values['name'] || ''} pattern="^\w{3,36}$|^$" data-error="Must be between 3 and 36 characters, and only contain word characters." />
          </label>
          { errors.name && (
            <p className="alert alert-error">{errors.name}</p>
          )}
        </div>
        <div className="form-control">
          <button className="btn" type="submit">Submit</button>
        </div>
      </form>
      <div>
        <Link className="link" to='/signin'>Already have an account?</Link>
      </div>
    </div>
  );
}

export default Signup;
