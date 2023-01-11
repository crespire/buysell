import { useAuth } from "../providers/AuthProvider";
import useForm from "../hooks/useForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function UserUpdate() {
  const navigate = useNavigate();
  const { user, authErrors, authSuccess, updateUser } = useAuth();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(updateUser);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Update Profile</h1>
      { authErrors && <div className="authinfo text-red-800">Something went wrong, check the requirements and try again.</div> }
      { authSuccess && <div className="authinfo text-green-800">Changes were successful!</div> }
      <form className="flex flex-col align-center justify-center space-x-2" onSubmit={(e) => {handleSubmit(e, values['password'], values['new-password'], values['name'])}}>
        <ul className="list-inside list-disc">
          <li>Current password must be provided to update information.</li>
          <li>Password must be 8 characters long and contain at least one digit.</li>
        </ul>
        <div className="p-2">
          <label htmlFor="email">Password*:</label>
          <input className="border-b border-black border-solid" required type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values['password'] || ''} pattern="^(?=.*\d).{8,}$|^$" data-error="Minimum length is 8, and must contain a digit." />
          { errors.password && <p className="error text-red-500">{errors.password}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="pass">New Password: </label>
          <input className="border-b border-black border-solid" type="password" name="new-password" onChange={handleChange} onBlur={handleBlur} value={values['new-password'] || ''} pattern="^(?=.*\d).{8,}$|^$" data-error="Minimum length is 8, and must contain a digit." />
          { errors['new-password'] && <p className="error text-red-500">{errors['new-password']}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="passconf">Confirm: </label>
          <input className="border-b border-black border-solid" type="password" name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['new-password']}$`} data-error="Passwords must match." />
          { errors.passconf && <p className="error text-red-500">{errors.passconf}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="name">Username: </label>
          <input className="border-b border-black border-solid" type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values['name'] || ''} pattern="^\w{3,36}$|^$" data-error="Must be between 3 and 36 characters, and only contain word characters." />
          { errors.name && <p className="error text-red-500">{errors.name}</p> }
        </div>
        <button className="p-2 border border-solid border-black" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserUpdate;
