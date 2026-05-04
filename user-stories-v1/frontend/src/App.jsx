import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Notes from "./components/Notes";
import Users from "./components/Users";
import CreateUserForm from "./components/CreateUserForm";
import EditUser from "./components/EditUser";
import DashLayout from "./components/DashLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes" element={<Notes />} />
          <Route path="users" element={<Users />} />
          <Route path="users/create" element={<CreateUserForm />} />
          <Route path="users/:userId" element={<EditUser />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
