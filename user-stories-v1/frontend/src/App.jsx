import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
// import Login from "./components/Login";
import CheckUserStatus from "./components/Login";
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
        <SynchronizeUserStatus setToken={setToken} setIsLoading={setIsLoading} />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      {/* ====================================== */}
      {/* todelete */}
      <button 
        className="submit-button"
        onClick={() => console.log(token)}
      >
        show token
      </button>
      {/* ====================================== */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login setToken={setToken} />} /> */}
        <Route path="/login" element={<CheckUserStatus setToken={setToken} />} />

        <Route path="/dash" element={<WelcomeDashLayout token={token} setToken={setToken} />}>
          <Route index element={<Welcome />} />
        </Route>

        <Route path="/dash" element={<DashLayout token={token} setToken={setToken} />}>
          <Route path="users">
            <Route index element={<Users token={token} />} />
            <Route path="create" element={<CreateUserForm token={token} />} />
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

function SynchronizeUserStatus({ setToken, setIsLoading }) {
  useEffect(() => {
    const synchronize = async () => {
      try {
        const userInLocalStorage = localStorage.getItem("user");
        console.log(userInLocalStorage);

        if (!userInLocalStorage) {
          deleteRefreshToken(setToken, setIsLoading);
        } else {
          restoreAccessToken(setToken, setIsLoading);
        }
      } catch (error) {
        console.log(error);
      }
    }

    synchronize();

    async function deleteRefreshToken(setToken) {
      try {
        const response = await fetch("http://localhost:5000/auth/logout", {
          method: "POST",
          credentials: "include"
        });

        console.log("logout - no user in localStorage: ");
        console.log(response);

        setToken(null);
        localStorage.removeItem("user");

        if (response.ok) {
          console.log("logout response: ok");
          // const data = await response.json();
          // console.log(data);
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        console.log("finally from deleteRefreshToken");
        setIsLoading(false);
      }
    };

    async function restoreAccessToken() {
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
        console.log("finally from restoreAccessToken");
        setIsLoading(false);
      }
    }
  }, []);

  return null; 
}

export async function customFetch(token, setToken, url, options = {}) {
  // options.headers = options.headers || {};
  
  options.credentials = "include";

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, options);

  if (response.status === 401 && !options._retry) {
    options._retry = true; 

    try {
      const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
        method: "POST",
        credentials: "include"
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        
        setToken(data.accessToken);

        options.headers["Authorization"] = `Bearer ${data.accessToken}`;

        response = await fetch(url, options);
      } else {
        handleGlobalLogout();
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      handleGlobalLogout();
    }
  }

  return response;
}

export default App;