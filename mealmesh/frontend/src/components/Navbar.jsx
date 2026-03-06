import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex justify-between items-center p-5 shadow-md bg-white">

      <h1 className="text-2xl font-bold text-green-600">
        MealMesh
      </h1>

      <div className="flex gap-6">

        <Link to="/">Home</Link>
        <Link to="/donate">Donate Food</Link>
        <Link to="/ngo">NGO Board</Link>
        <Link to="/register">Register</Link>

      </div>
    </div>
  );
}

export default Navbar;
