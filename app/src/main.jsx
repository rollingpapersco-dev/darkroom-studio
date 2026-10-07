import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import Root from './Root.jsx';
import { installFonts } from './exporter.js';

installFonts();

createRoot(document.getElementById('root')).render(<StrictMode><Root /></StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {}));
}
