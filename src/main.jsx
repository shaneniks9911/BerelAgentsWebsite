import React from 'react'
import ReactDOM from 'react-dom/client'
import Website from './Website.jsx' // We changed App to Website here
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Website />
  </React.StrictMode>,
)
