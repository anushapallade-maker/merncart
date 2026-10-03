import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/my-orders">My Orders</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;