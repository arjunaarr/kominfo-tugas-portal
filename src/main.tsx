
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log application start
console.log('React application starting...');

// Mount React app
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  console.error('Root element not found!');
}
