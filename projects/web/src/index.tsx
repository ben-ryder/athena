import React from 'react'
import ReactDOM from 'react-dom/client'
import {Application} from "./app";
import "./styles/tailwind.css";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
)
