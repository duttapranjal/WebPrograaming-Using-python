function NGO(){

  return(

    <div className="p-10">

      <h2 className="text-3xl font-bold mb-8">
        NGO Food Requests
      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="shadow-lg p-6 rounded-lg">
          <h3 className="font-bold">Shelter Home</h3>
          <p>Need 50 Meals</p>
        </div>

        <div className="shadow-lg p-6 rounded-lg">
          <h3 className="font-bold">Orphanage</h3>
          <p>Need 30 Meals</p>
        </div>

      </div>

    </div>

  )
}

export default NGO
