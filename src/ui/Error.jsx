import { useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function NotFound() {
  const error = useRouteError();

  return (
    <div className="px-4 py-6 text-center">
      <h1 className="text-red-700">Something went wrong 😢</h1>
      <p className="font-medium">
        {error.message || error.error?.message || error.statusText}
      </p>

      <LinkButton to={-1}>&larr; Go back</LinkButton>
    </div>
  );
}

export default NotFound;
