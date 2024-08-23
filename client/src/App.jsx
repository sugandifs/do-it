import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Tasks from "./tasks/Task";
import Journals from "./journals/Journals";
import ReadEntry from "./journals/ReadEntry";
import NewEntry from "./journals/NewEntry";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/tasks" element={<Tasks />}></Route>
          <Route path="/journals" element={<Journals />}></Route>
          <Route path="/entry/:journal_id" element={<ReadEntry />}></Route>
          <Route path="/write" element={<NewEntry />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
