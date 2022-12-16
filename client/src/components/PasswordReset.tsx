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

  if (!token) { return <p>No token provided.</p> }

  return (
    <div>
      { authErrors && <div>Error: { authErrors['field-error'][1] }</div> }
      <form onSubmit={(e) => handleSubmit(e, token, values['pass'])}>
      <div className="p-2">
          <label htmlFor="pass">Password: </label>
          <input className="border-b border-black border-solid" type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
          { errors.pass && <p className="text-red-500">{errors.pass}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="passconf">Confirm: </label>
          <input className="border-b border-black border-solid" type="password" required name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['pass']}$`} data-error="Passwords must match." />
          { errors.passconf && <p className="text-red-500">{errors.passconf}</p> }
        </div>
        <button className="p-2 border border-solid border-black" type="submit">Change my password</button>
      </form>
    </div>
    
  );
}

export default PasswordReset;