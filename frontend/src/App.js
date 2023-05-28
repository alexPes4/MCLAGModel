import './App.css';
import Object from "./components/Objects/Object";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ResourceInventory from "./components/ResourceInventory";

function App() {
  return (
      <div className="App">
          <Router>
              <Routes>
                  <Route path="/"element={<ResourceInventory/>}/>
                  <Route path="/:objectId" element={<Object/>}/>
              </Routes>
          </Router>
      </div>
  );
}

export default App;
