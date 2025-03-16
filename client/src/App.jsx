import './App.css';
import ProtectedRoutes from './pages/ProtectedRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <ProtectedRoutes />
    <Toaster/>
    </>
  );
}

export default App;
