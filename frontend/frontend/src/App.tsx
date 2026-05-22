import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { SigninPage } from './pages/signinPage';
import { SignupPage } from './pages/signupPage';
import { TradePage } from './pages/Tradingpage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
       <Route path="/trade" element={<TradePage />} />
          <Route path="/" element={<SigninPage />} />
        </Routes>
      </Router>
    </div>
  );
}
  

export default App
