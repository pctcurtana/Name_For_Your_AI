import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Selfcode from './components/Selfcode'
import { ThemeProvider } from './context/ThemeContext'
import Welcome from './components/Welcome'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path ="" element = {<Welcome/>} />
          <Route path ="/home" element = {<Selfcode/>}/>
          {/* <Chatbox/> */}
        </Routes>
      </BrowserRouter>
      
    </ThemeProvider>
  )
}

export default App
