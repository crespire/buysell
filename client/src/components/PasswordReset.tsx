import { useAuth } from '../providers/AuthProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useForm from '../hooks/useForm';

function PasswordReset() {
  const { user, authErrors, doResetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const { values, errors, handleBlur, handleSubmit, handleChange } = useForm(doResetPassword);

  useEffect(() => {
    if (user === null) { return }

    navigate('/');
  }, [user, navigate])

  if (!token) { return <p className="alert alert-error">No token provided.</p> }

  return (
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      { authErrors && <div className="alert alert-error">Error: { authErrors['field-error'][1] }</div> }
      <form className="flex flex-col align-center justify-center gap-2" onSubmit={(e) => handleSubmit(e, token, values['pass'])}>
      <div className="form-control">
          <label htmlFor="pass" className="input-group">
            <span className="w-1/4">Password</span>
            <input className="input input-bordered w-full" type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
          </label>
          { errors.pass && <p className="alert alert-error">{errors.pass}</p> }
        </div>
        <div className="form-control">
          <label htmlFor="passconf" className="input-group">
            <span className="w-1/4">Confirm</span>
            <input className="input input-bordered w-full" type="password" required name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['pass']}$`} data-error="Passwords must match." />
          </label>
          { errors.passconf && <p className="alert alert-error">{errors.passconf}</p> }
        </div>
        <div className="form-control">
          <button className="btn" type="submit">Reset Password</button>
        </div>
      </form>
    </div>
    
  );
}

export default PasswordReset;
