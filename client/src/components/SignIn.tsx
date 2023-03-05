import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Signin() {
  const { user, authErrors, logIn } = useAuth();
  const navigate = useNavigate();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(logIn);

  useEffect(() => {
    if(user) {
      navigate('/');
    }
  }, [user, navigate])

  return (
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      <h1 className="text-5xl">Sign In</h1>
      <div className="bg-info p-2">All fields are required.</div>
      <form className="flex flex-col align-center justify-center gap-2" onSubmit={(e) => {handleSubmit(e, values['email'], values['pass'])}}>
        { authErrors && <div className="alert alert-error">Something went wrong, check the requirements and try again.</div> }
        <div className="form-control">
          <label htmlFor="email" className="input-group">
            <span className="w-1/3">Email</span>
            <input className="input input-bordered" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          </label>
          { errors.email && (
            <p className="alert alert-error">{errors.email}</p> 
          )}
        </div>
        <div className="form-control">
          <label htmlFor="pass" className="input-group">
            <span className="w-1/3">Password</span>
            <input className="input input-bordered" type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^.{8,}$" data-error="Must be filled in." />
          </label>
          { errors.pass && <p className="alert alert-error">{errors.pass}</p> }
        </div>
        <div className="form-control">
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
      <div>
        <Link className="link" to='/signup'>Need an account?</Link><br />
        <Link className="link" to="/reset-password">Help, I forgot my password</Link>
      </div>
    </div>
    
  );
}

export default Signin;
