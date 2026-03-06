import { motion } from "framer-motion";

function Home() {

  return (

    <div className="text-center mt-24">

      <motion.h1
        initial={{opacity:0,y:-50}}
        animate={{opacity:1,y:0}}
        transition={{duration:1}}
        className="text-5xl font-bold text-green-600"
      >
        MealMesh
      </motion.h1>

      <p className="mt-6 text-gray-600 text-lg">
        Routing surplus food to people who need it
      </p>

      <motion.button
        whileHover={{scale:1.1}}
        className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Start Donating
      </motion.button>

    </div>

  )
}

export default Home
