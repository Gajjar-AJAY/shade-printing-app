import { useState } from 'react'
import HomeMenu from './components/Homemenu.jsx'
import ShadeScreen from './components/Shadescreen.jsx'
import GembaScreen from './components/Gembascreen.jsx';
import './App.css'

// 'home' | 'shade' | 'gemba'
export default function App() {
  const [view, setView] = useState('gemba')

  // if (view === 'shade') {
  //   return <ShadeScreen onBack={() => setView('home')} />
  // }

  if (view === 'gemba') {
    return <GembaScreen onBack={() => setView('gemba')} />
  }

  return <HomeMenu onSelect={setView} />
}

