import { useAuth } from '../providers/AuthProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AccountVerify() {
  const { user, verifyUser } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) { return }
    if ([1].includes(user.status)) { return } // unverified, needs to verify.

    navigate('/');
  }, [user, navigate])

  return (
    <div>
      { token
        ? <button onClick={() => verifyUser(token)}className="p-2 border border-solid border-black" type="submit">Verify My Account!</button>
        : <p>No token provided.</p>
      }
    </div>
    
  );
}

export default AccountVerify;