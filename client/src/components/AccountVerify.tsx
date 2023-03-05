import { useAuth } from '../providers/AuthProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AccountVerify() {
  const { user, verifyUser } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) { return }
    if (user.status === 1) { return } // unverified, needs to verify.

    navigate('/');
  }, [user, navigate])

  return (
    <div>
      { token
        ? <button onClick={() => verifyUser(token)}className="btn btn-primary" type="submit">Verify My Account!</button>
        : <p className="alert alert-error">No token provided.</p>
      }
    </div>
    
  );
}

export default AccountVerify;
