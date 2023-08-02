import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <header>
      <Link to="/">First React Pizza Co.</Link>
      <SearchOrder />
      <p>Masud</p>
    </header>
  );
}

export default Header;
