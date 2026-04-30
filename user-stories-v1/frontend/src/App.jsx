import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Notes from "./components/Notes";
import Users from "./components/Users";
import CreateUserForm from "./components/CreateUserForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<Welcome />} />
        <Route path="/dash/notes" element={<Notes />} />
        <Route path="/dash/users" element={<Users />} />
        <Route path="/dash/users/create" element={<CreateUserForm />} />
        {/* <Route path="/dash/users/:userId" element={<Users />} /> */}
      </Routes>
    </>
  )
}

export default App;
