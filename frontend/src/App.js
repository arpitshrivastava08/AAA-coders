import logo from './logo.svg';
import './App.css';
import { Loginsign } from './components/Loginsignup/Loginsign';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Dashboard/> 
      <Loginsign/>
    </div>
    
  );
}

export default App;
