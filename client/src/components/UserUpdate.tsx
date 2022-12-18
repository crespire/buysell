import { useAuth } from "../providers/AuthProvider";
import useForm from "../hooks/useForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function UserUpdate() {
  const navigate = useNavigate();
  const { user, authErrors, updatePassword } = useAuth();
  const { values, errors, handleChange, handleSubmit, handleBlur } = useForm(updatePassword);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [])

  return (
    <div>
      <h1 className="text-2xl">Change Password</h1>
      
      <form className="flex flex-col align-center justify-center space-x-2" onSubmit={(e) => {handleSubmit(e, values['password'], values['new-password'])}}>
        <ul className="list-inside list-disc">
          <li>All fields are required.</li>
          <li>Password must be 8 characters long and contain at least one digit.</li>
        </ul>
        <div className="p-2">
          <label htmlFor="email">Password:</label>
          <input className="border-b border-black border-solid" type="password" required name="password" onChange={handleChange} onBlur={handleBlur} value={values['password'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
          { errors.password && <p className="text-red-500">{errors.password}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="pass">New Password: </label>
          <input className="border-b border-black border-solid" type="password" required name="new-password" onChange={handleChange} onBlur={handleBlur} value={values['new-password'] || ''} pattern="^(?=.*\d).{8,}$" data-error="Minimum length is 8, and must contain a digit." />
          { errors['new-password'] && <p className="text-red-500">{errors['new-password']}</p> }
        </div>
        <div className="p-2">
          <label htmlFor="passconf">Confirm: </label>
          <input className="border-b border-black border-solid" type="password" required name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['new-password']}$`} data-error="Passwords must match." />
          { errors.passconf && <p className="text-red-500">{errors.passconf}</p> }
        </div>
        { authErrors && <div className="text-red-800">There was an error trying to change your password.<br />The field { authErrors['field-error'][0] } has error: { authErrors['field-error'][1] }.</div> }
        <button className="p-2 border border-solid border-black" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserUpdate;
