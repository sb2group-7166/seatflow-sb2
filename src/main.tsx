import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element. Did you forget to add it to your index.html?");
}

const root = createRoot(rootElement);

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
