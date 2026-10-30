import React from 'react';
import { createRoot } from 'react-dom/client';

// fonts are self-hosted in public/fonts and declared in tokens.css
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import App from './App.jsx';
import { GameProvider } from './context/GameContext.jsx';
import { ModeProvider } from './context/ModeContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModeProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </ModeProvider>
  </React.StrictMode>,
);
