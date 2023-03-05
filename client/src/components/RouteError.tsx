import { useNavigate } from 'react-router-dom';

function RouteError(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Oops! (404)</h1>
          <p className="py-6">Looks like this page doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => { navigate('/') }}>Go home!</button>
        </div>
      </div>
    </div>
  );
}

export default RouteError;
