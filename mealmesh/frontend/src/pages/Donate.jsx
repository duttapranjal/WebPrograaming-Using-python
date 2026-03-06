import { useState } from "react";

function Donate(){

  const [food,setFood] = useState("")
  const [quantity,setQuantity] = useState("")

  return(

    <div className="flex justify-center mt-20">

      <div className="shadow-lg p-10 rounded-xl w-96">

        <h2 className="text-2xl font-bold mb-6">
          Donate Surplus Food
        </h2>

        <input
        className="border p-2 w-full mb-4"
        placeholder="Food Name"
        onChange={(e)=>setFood(e.target.value)}
        />

        <input
        className="border p-2 w-full mb-4"
        placeholder="Quantity"
        onChange={(e)=>setQuantity(e.target.value)}
        />

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Submit Donation
        </button>

      </div>

    </div>

  )
}

export default Donate
