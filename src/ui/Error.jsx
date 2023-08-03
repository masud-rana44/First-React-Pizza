import { useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function NotFound() {
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.message || error.error?.message || error.statusText}</p>

      <LinkButton to={-1}>&larr; Go back</LinkButton>
    </div>
  );
}

export default NotFound;
