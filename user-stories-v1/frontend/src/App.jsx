import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Notes from "./components/Notes";
import Users from "./components/Users";
import CreateUserForm from "./components/CreateUserForm";
import EditUser from "./components/EditUser";
import DashLayout, { WelcomeDashLayout } from "./components/DashLayout";
import NewNote from "./components/NewNote";
import EditNote from "./components/EditNote";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  return (
    <>
      <button 
        className="submit-button"
        onClick={() => console.log(token)}
      >
        show token
      </button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />

        <Route path="/dash" element={<WelcomeDashLayout />}>
          <Route index element={<Welcome />} />
        </Route>

        <Route path="/dash" element={<DashLayout />}>
          <Route path="users">
            <Route index element={<Users token={token} />} />
            <Route path="create" element={<CreateUserForm />} />
            <Route path="edit/:userId" element={<EditUser />} />
          </Route>

          <Route path="notes">
            <Route index element={<Notes token={token} />} />
            <Route path="create" element={<NewNote token={token} />} />
            <Route path="edit/:noteId" element={<EditNote token={token} />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;