import './App.css';
import TenderHead from "./Components/TenderPurchase/TenderHead";
import TenderUtility from "./Components/TenderPurchase/TenderUtility";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<TenderUtility />} />
        <Route path="/tender_head" element={<TenderHead />} />
      </Routes>
    </Router>
  );
}

export default App;
