import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';

function Signup() {
  const { signUp } = useAuth();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(signUp);

  return (
    <div>
      <h1 className="text-2xl">Sign Up</h1>
      <form className="flex flex-col align-center justify-center space-x-2" onSubmit={(e) => {handleSubmit(e, values['email'], values['pass'])}}>
        <p>
          <ul className="list-inside list-disc">
            <li>All fields are required.</li>
            <li>Password must be 8 characters long and contain at least one digit.</li>
          </ul>        
        </p>
        <div className="p-2">
          <label htmlFor="email">Email:</label>
          <input className="border-b border-black border-solid" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          { errors.email && <p className="text-red-500">{errors.email}</p> }
        </div>
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
        <button className="p-2 border border-solid border-black" type="submit">Submit</button>
      </form>
      
    </div>
    
  );
}

export default Signup;