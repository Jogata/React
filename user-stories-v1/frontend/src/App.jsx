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
import { ScrollToTop } from "./components/ScrollToTop";

import { useEffect, useState } from "react";
import Loader from "./components/Loader";

function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <Loader />
        <RefreshToken setToken={setToken} setIsLoading={setIsLoading} />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <button 
        className="submit-button"
        onClick={() => console.log(token)}
      >
        show token
      </button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />

        <Route path="/dash" element={<WelcomeDashLayout token={token} setToken={setToken} />}>
          <Route index element={<Welcome />} />
        </Route>

        <Route path="/dash" element={<DashLayout token={token} setToken={setToken} />}>
          <Route path="users">
            <Route index element={<Users token={token} />} />
            <Route path="create" element={<CreateUserForm />} />
            <Route path="edit/:userId" element={<EditUser token={token} />} />
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

function RefreshToken({ setToken, setIsLoading }) {
  useEffect(() => {
    const restoreSessionOnMount = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/refresh", {
          method: "POST", 
          credentials: "include"
        });
        console.log(response);
        
        if (response.ok) {
          const data = await response.json();
          setToken(data.accessToken);
          setIsLoading(false);
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch (err) {
        console.error("Session restoration failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSessionOnMount();
  }, []);

  return null; 
}

export default App;