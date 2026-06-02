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


import { Test } from "./components/User";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Test.Navigation setUser={setUser} />
      <Routes>
      <Route path="/" element={<Test.Home setUser={setUser} />} />
      <Route path="/register" element={<Test.Register />} />
      <Route path="/login" element={<Test.Login setUser={setUser} />} />
      {/* <Route element={<Test.Protected user={user} setUser={setUser} />}>
        <Route path="/dash" element={<Test.Dashboard />} />
        <Route path="/dash2" element={<Test.Dashboard2 />} />
      </Route> */}
      
      <Route element={<Test.Protected user={user} setUser={setUser} key="p1" clean="p1" />}>
        <Route path="/dash" element={<Test.Dashboard />} />
        {/* <Route path="/dash2" element={<Test.Dashboard2 />} /> */}
      </Route>
      
      <Route element={<Test.Protected user={user} setUser={setUser} key="p2" clean="p2" />}>
        {/* <Route path="/dash" element={<Test.Dashboard />} /> */}
        <Route path="/dash2" element={<Test.Dashboard2 />} />
      </Route>
      
        {/* <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

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
      </Routes>
    </>
  )
}

export default App;