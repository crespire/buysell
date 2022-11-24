import { useAuth } from '../providers/AuthProvider';
import useForm from '../hooks/useForm';

function Signin() {
  const { logIn } = useAuth();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(logIn);

  return (
    <div>
      <h1 className="text-2xl">Sign In</h1>
      <form className="flex flex-col align-center justify-center space-x-2" onSubmit={(e) => {handleSubmit(e, values['email'], values['pass'])}}>
        <ul className="list-inside list-disc">
          <li>All fields are required.</li>
        </ul>
        <div className="p-2">
          <label htmlFor="email">Email:</label>
          <input className="border-b border-black border-solid" type="text" required name="email" onChange={handleChange} onBlur={handleBlur} value={values['email'] || ''} pattern="^[\w.]+@([\w-]+\.)+[\w-]{2,4}$" data-error="Email format incorrect." />
          { errors.email && <p className="text-red-500">{errors.email}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="pass">Password: </label>
          <input className="border-b border-black border-solid" type="password" required name="pass" onChange={handleChange} onBlur={handleBlur} value={values['pass'] || ''} pattern="^.{8,}$" data-error="Must be filled in." />
          { errors.pass && <p className="text-red-500">{errors.pass}</p> }
        </div>
        <button className="p-2 border border-solid border-black" type="submit">Login</button>
      </form>
      
    </div>
    
  );
}

export default Signin;