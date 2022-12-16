import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';

function RequestPasswordReset() {
  const { authErrors, requestResetPassword } = useAuth();
  const { values, errors, handleBlur, handleSubmit, handleChange } = useForm(requestResetPassword);

  return (
    <div>
      { authErrors && <div>Error: { authErrors['field-error'][1] }</div> }
      <form onSubmit={(e) => handleSubmit(e, values['email'])}>
        <div className="p-2">
          <label htmlFor="email">Email:</label>
          <input className="border-b border-black border-solid" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          { errors.email && <p className="text-red-500">{errors.email}</p> }
          <button className="p-2 border border-solid border-black" type="submit">Request password reset</button>
        </div>
      </form>
    </div>
  );
}

export default RequestPasswordReset;
