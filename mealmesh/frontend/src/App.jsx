import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import NGO from "./pages/NGO";
import Register from "./pages/Register";
import LiveMap from "./pages/LiveMap";

function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/donate" element={<Donate/>}/>
<Route path="/ngo" element={<NGO/>}/>
<Route path="/map" element={<LiveMap/>}/>
<Route path="/register" element={<Register/>}/>

</Routes>

</BrowserRouter>

)

}

export default App

