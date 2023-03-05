import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';

function RequestPasswordReset() {
  const { authErrors, requestResetPassword } = useAuth();
  const { values, errors, handleBlur, handleSubmit, handleChange } = useForm(requestResetPassword);

  return (
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      { authErrors && <div className="alert alert-error">Error: { authErrors['field-error'][1] }</div> }
      <form className="flex flex-col p-2 align-center justify-center gap-2" onSubmit={(e) => handleSubmit(e, values['email'])}>
        <div className="form-control w-full">
          <label htmlFor="email" className="input-group">
            <span>Email</span>
            <input className="input input-bordered grow" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          </label>
          { errors.email && <p className="alert alert-error">{errors.email}</p> }
        </div>
        <div className="form-control w-full">
          <button className="btn" type="submit">Request password reset</button>
        </div>
      </form>
    </div>
  );
}

export default RequestPasswordReset;
