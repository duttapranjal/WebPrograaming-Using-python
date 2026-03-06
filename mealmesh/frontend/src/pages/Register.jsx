import { useState } from "react"
import axios from "axios"

function Register(){

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const registerUser = async () => {

await axios.post("http://localhost:5000/api/users/register",{
name,
email,
password
})

alert("Registered")

}

return(

<div className="flex justify-center mt-20">

<div className="shadow-xl p-10 rounded-lg w-96">

<h2 className="text-2xl font-bold mb-6">Register</h2>

<input
className="border p-2 w-full mb-4"
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
className="border p-2 w-full mb-4"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="border p-2 w-full mb-4"
placeholder="Password"
type="password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={registerUser}
className="bg-green-600 text-white w-full py-2 rounded"
>
Register
</button>

</div>

</div>

)

}

export default Register
