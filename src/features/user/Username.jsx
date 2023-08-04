import { useSelector } from 'react-redux';
import { getUsername } from './userSlice';

function Username() {
  const username = useSelector(getUsername);

  if (!username) return null;

  return <p className="hidden text-sm font-semibold md:block">{username}</p>;
}

export default Username;
