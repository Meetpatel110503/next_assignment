import Link from "next/link"

const LandingPage = () => {
  return (
    <div
      className='min-h-screen flex flex-col justify-center items-center bg-cover bg-center'
      style={{
        backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Sky_over_Munich_02.jpg/1200px-Sky_over_Munich_02.jpg)`,
      }}
    >
      <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-center px-4'>
        Welcome to Weather App
      </h1>
      <Link href='/pages/home'>
        <button className='bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-300 text-lg md:text-xl'>
          Go to Home
        </button>
      </Link>
    </div>
  )
}

export default LandingPage
