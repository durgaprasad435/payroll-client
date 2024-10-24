import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RoutesContainer } from "./components/routes/Routes";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoutesContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
