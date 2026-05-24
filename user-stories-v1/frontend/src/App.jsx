import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Notes from "./components/Notes";
// import Users from "./components/Users";
import { Test } from "./components/Users";
import CreateUserForm from "./components/CreateUserForm";
import EditUser from "./components/EditUser";
import DashLayout, { WelcomeDashLayout } from "./components/DashLayout";
import NewNote from "./components/NewNote";
import EditNote from "./components/EditNote";

function App() {
  return (
    <>
      <Test.NavigationTest />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />

        <Route path="/dash" element={<WelcomeDashLayout />}>
          <Route index element={<Welcome />} />
        </Route>

        <Route path="/dash" element={<DashLayout />}>
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="create" element={<CreateUserForm />} />
            <Route path="edit/:userId" element={<EditUser />} />
          </Route>

          <Route path="notes">
            <Route index element={<Notes />} />
            <Route path="create" element={<NewNote />} />
            <Route path="edit/:noteId" element={<EditNote />} />
          </Route>
        </Route> */}
        <Route path="/register" element={<Test.RegisterTest />} />
        <Route path="/login" element={<Test.LoginTest />} />
        {/* <Route path="/test" element={<Test.Content />} /> */}
      </Routes>
    </>
  )
}

export default App;