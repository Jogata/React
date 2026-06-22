import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
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

// ==================================================================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader";

function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  function logout() {
    console.log("logout with broadcastAuthEvent");
    broadcastAuthEvent("LOGOUT");
    setToken(null);
    localStorage.removeItem("user");
  }

  useEffect(() => {
    const handleStorageChange = (event) => {
      // The storage event only fires if the change came from a DIFFERENT tab
      if (event.key === "user") {
        console.log(event.key);
        const newUser = event.newValue;

        if (!newUser) {
          // 1. If user was deleted in another tab, log out instantly!
          console.log("Logout detected in another tab. Cleaning up...");
          setToken(null);
          // localStorage.setItem("user", {});
          // localStorage.removeItem("user");
          navigate("/login", { replace: true });
        } else {
          // 2. If a username was added/changed in another tab, run silent refresh
          console.log("Login detected in another tab. Fetching access token...");
          restoreAccessToken();

          async function restoreAccessToken() {
            try {
              const response = await fetch("http://localhost:5000/auth/refresh", {
                method: "POST", 
                credentials: "include"
              });
              
              if (response.ok) {
                const data = await response.json();
                setToken(data.accessToken);
              } else {
                const data = await response.json();
                localStorage.removeItem("user");  
              }
            } catch (err) {
              console.error("Session restoration failed:", err);
            } finally {
              console.log("finally from restoreAccessToken");
              setIsLoading(false);
            }
          }
        }
      }
    };

    // Add the global window listener
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, setToken]);

  // useEffect(() => {
  //   subscribeToAuthEvents((data) => {
  //     if (data.type === "LOGOUT") {
  //       logout();
  //     }
      
  //     if (data.type === "LOGIN") {
  //       restoreAccessToken();
  //       async function restoreAccessToken() {
  //         try {
  //           const response = await fetch("http://localhost:5000/auth/refresh", {
  //             method: "POST", 
  //             credentials: "include"
  //           });
            
  //           if (response.ok) {
  //             const data = await response.json();
  //             setToken(data.accessToken);
  //           } else {
  //             const data = await response.json();
  //             localStorage.removeItem("user");  
  //           }
  //         } catch (err) {
  //           console.error("Session restoration failed:", err);
  //         } finally {
  //           console.log("finally from restoreAccessToken");
  //           setIsLoading(false);
  //         }
  //       }    
  //     }
  //   });
  // }, []);

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

        <Route path="/dash" element={<WelcomeDashLayout token={token} setToken={setToken} logout={logout} />}>
          <Route index element={<Welcome />} />
        </Route>

        <Route path="/dash" element={<DashLayout token={token} setToken={setToken} logout={logout} />}>
          <Route path="users">
            <Route index element={<Users token={token} />} />
            <Route path="create" element={<CreateUserForm token={token} setToken={setToken} />} />
            <Route path="edit/:userId" element={<EditUser token={token} />} />
          </Route>

          <Route path="notes">
            <Route index element={<Notes token={token} />} />
            <Route path="create" element={<NewNote token={token} setToken={setToken} />} />
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
          if (response.status != 204) {
            const data = await response.json();
            console.log(data);
          }
          console.log("logout response: ok with status 204");
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
          // console.log(data.accessToken);
          setToken(data.accessToken);
          // setIsLoading(false);
        } else {
          const data = await response.json();
          console.log(data);
          // setToken(null);
          localStorage.removeItem("user");  
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

async function customFetch(url, options) {
  try {
    let response = await fetch(url, options);

    const contentType = response.headers.get("content-type");
    let data = null;
 
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }
 
    // Case 1: Server succeeded
    if (response.ok && data) {
      return { ok: true, data, error: null };
    }
 
    // Case 2: Server responded with an explicit JSON error (e.g., 400 or 401)
    if (!response.ok && data) {
      return { ok: false, data: null, error: data };
    }
 
    // Case 3: Server crashed (HTML/Text response instead of JSON)
    return { 
      ok: false, 
      data: null, 
      error: `Server error (${response.status}). Please try again later.` 
    };
  } catch (networkError) {
    // Case 4: Catastrophic failure (No internet connection)
    return { 
      ok: false, 
      data: null, 
      error: "Network connection failed. Please check your internet." 
    };
  } 
} 

async function autorizedFetch(token, setToken, navigate, url, options = {}) {
  options.headers = options.headers || {};
  
  options.credentials = "include";

  if (!token) {
    console.log("You can't make autorized requests");
    // window.location.href = "/login";
    navigate("/login");
    // return;
  }

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

// import { useNavigate } from "react-router-dom";

function useCustomFetch(token, setToken) {
  const navigate = useNavigate();

  const customFetch = async (url, options = {}) => {
    // Defensive check: ensure options is an object
    // if (typeof options !== "object" || options === null) {
    //   options = {};
    // }

    options.headers = options.headers || {};
    // Ensure HttpOnly cookies travel cross-domain
    options.credentials = "include";

    // Inject the live token state into the outgoing header
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    // Execute original request
    let response = await fetch(url, options);

    // Catch 401 Unauthorized errors
    if (response.status === 401 && !options._retry) {
      options._retry = true;

      try {
        // Hit the refresh endpoint (sends secure HttpOnly cookie)
        const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
          method: "POST",
          credentials: "include"
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();

          // Directly update the real React State!
          setToken(data.accessToken);
          // if (setUsername) {
            // setUsername(data.username);
            // localStorage.setItem("username", data.username);
          // }

          // Overwrite the backup header and retry
          options.headers["Authorization"] = `Bearer ${data.accessToken}`;
          response = await fetch(url, options);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Refresh crashed:", err);
        handleLogout();
      }
    }

    return response;
  };
  
  // Automated cleanup and redirect wrapper
  const handleLogout = () => {
    localStorage.removeItem("user");
    setToken(null);
    // if (setUsername) setUsername(null);
    
    navigate("/login", { replace: true }); 
  };

  return customFetch;
}

const authChannel = new BroadcastChannel("auth_channel");

export const broadcastAuthEvent = (type) => {
  authChannel.postMessage({ type });
};

export function subscribeToAuthEvents (onMessage) {
  authChannel.onmessage = (event) => onMessage(event.data);
};

export default App;