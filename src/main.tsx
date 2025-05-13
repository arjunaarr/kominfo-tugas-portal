
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log application start with timestamp
console.log(`React application starting... ${new Date().toISOString()}`);

try {
  // Mount React app
  const root = document.getElementById("root");
  if (root) {
    console.log('Root element found, mounting React app');
    createRoot(root).render(<App />);
    console.log('React app mounted successfully');
  } else {
    console.error('Root element not found! DOM might not be ready or element ID is incorrect');
  }
} catch (error) {
  console.error('Error during React application initialization:', error);
}
