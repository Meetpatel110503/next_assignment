"use client"
import Link from "next/link"

const LandingPage = () => {
  return (
    <div
      className='min-h-screen flex flex-col justify-center items-center'
      style={{
        backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Sky_over_Munich_02.jpg/1200px-Sky_over_Munich_02.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className='text-4xl font-bold text-white mb-8'>
        Welcome to Weather App
      </h1>
      <Link href='/home'>
        <button className='bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-300'>
          Go to Home
        </button>
      </Link>
    </div>
  )
}

export default LandingPage
