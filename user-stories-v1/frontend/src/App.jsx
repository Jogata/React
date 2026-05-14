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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dash" element={<WelcomeDashLayout />}>
          <Route index element={<Welcome />} />
        </Route>

        <Route path="/dash" element={<DashLayout />}>
          {/* <Route index element={<Welcome />} /> */}

          <Route path="users" element={<Users />} />
          <Route path="users/create" element={<CreateUserForm />} />
          <Route path="users/:userId" element={<EditUser />} />

          <Route path="notes" element={<Notes />} />
          <Route path="notes/create" element={<NewNote />} />
          <Route path="notes/edit/:id" element={<EditNote />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;