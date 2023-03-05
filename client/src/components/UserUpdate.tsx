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
    <div className="flex flex-col p-4 gap-4 w-full max-w-screen-sm">
      <h1 className="text-5xl">Update Profile</h1>
      { authErrors && <div className="authinfo alert alert-error">Something went wrong, check the requirements and try again.</div> }
      { authSuccess && <div className="authinfo alert alert-success">Changes were successful!</div> }
      <form className="flex flex-col align-center justify-center gap-2" onSubmit={(e) => {handleSubmit(e, values['password'], values['new-password'], values['name'])}}>
        <ul className="bg-info p-2 list-inside list-disc">
          <li>Current password must be provided to update information.</li>
          <li>Password must be 8 characters long and contain at least one digit.</li>
        </ul>
        <div className="form-control">
          <label htmlFor="email" className="input-group">
            <span className="w-1/3">Password<sup>*</sup></span>
            <input className="input input-bordered w-full" required type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values['password'] || ''} pattern="^(?=.*\d).{8,}$|^$" data-error="Minimum length is 8, and must contain a digit." />
          </label>
          { errors.password && <p className="error alert alert-error">{errors.password}</p> }
        </div>
        <div className="form-control">
          <label htmlFor="pass" className="input-group">
            <span className="w-1/3">New Password</span>
            <input className="input input-bordered w-full" type="password" name="new-password" onChange={handleChange} onBlur={handleBlur} value={values['new-password'] || ''} pattern="^(?=.*\d).{8,}$|^$" data-error="Minimum length is 8, and must contain a digit." />
          </label>
          { errors['new-password'] && <p className="error alert alert-error">{errors['new-password']}</p> }
        </div>
        <div className="form-control">
          <label htmlFor="passconf" className="input-group">
            <span className="w-1/3">Confirm</span>
            <input className="input input-bordered w-full" type="password" name="passconf" onChange={handleChange} onBlur={handleBlur} value={values['passconf'] || ''} pattern={`^${values['new-password']}$`} data-error="Passwords must match." />
          </label>
          { errors.passconf && <p className="error alert alert-error">{errors.passconf}</p> }
        </div>
        <div className="form-control">
          <label htmlFor="name" className="input-group">
            <span className="w-1/3">Username</span>
            <input className="input input-bordered w-full" type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values['name'] || ''} pattern="^\w{3,36}$|^$" data-error="Must be between 3 and 36 characters, and only contain word characters." />
          </label>
          { errors.name && <p className="error alert alert-error">{errors.name}</p> }
        </div>
        <div className="form-control">
          <button className="btn" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default UserUpdate;
