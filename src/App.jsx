import { useState } from 'react'
import './App.css'
import Hero from './components/custom/Hero'
import Footer from './view-trip/components/Footer';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Hero */}
      <Hero/>
      <Footer/>
    </>
  )
}

export default App

