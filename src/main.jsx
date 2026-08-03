import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import "./styles/receipt.css";
import App from './App.jsx'
import {
  SettingsProvider,
} from "./context/SettingsContext";

import "./styles/receipt-print.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <SettingsProvider>
          <App />
          
     </SettingsProvider>

  </StrictMode>,
)
