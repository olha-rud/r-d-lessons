import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Task Manager</h1>
        </div>
      </header>
      <main className="main-content">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;