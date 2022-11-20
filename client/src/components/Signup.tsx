import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';

function Signup() {
  const { signUp } = useAuth();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(signUp);

  return (
    <div>
      <form onSubmit={(e) => {handleSubmit(e, values['email'], values['pass'])}}>
        <label htmlFor="email">Email: </label>
        <input type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
        { errors.email 
          ? <p>{errors.email}</p>
          : <br /> }
        <label htmlFor="pass">Password: </label>
        <input type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
        { errors.pass
          ? <p>{errors.pass}</p>
          : <br /> }
        <label htmlFor="passconf">Confirm: </label>
        <input type="password" required name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['pass']}$`} data-error="Passwords must match." />
        { errors.passconf
          ? <p>{errors.passconf}</p>
          : <br />
        }
        <button type="submit">Submit</button>
      </form>
      
    </div>
    
  );
}

export default Signup;