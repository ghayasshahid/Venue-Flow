import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Venue Flow — Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
