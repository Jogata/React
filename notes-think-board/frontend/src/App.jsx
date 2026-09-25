import { Route, Routes } from "react-router";
import { Link, Outlet } from "react-router";
import HomePage from "./components/pages/HomePage";
import CreatePage from "./components/pages/CreatePage";
import NoteDetailPage from "./components/pages/NotePage";
import { useEffect } from "react";
import { useState } from "react";
import { useNotes } from "./context/NotesProvider";
import { notesApi } from "./services/notes";
import { useNotify } from "./context/NotificationProvider";
import { Notifications } from "./components/Notifications/Notifications";

const App = () => {
  return (
    <div className="page">
      <GlobalNotificationsWrapper />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<DataLoader />}>
            <Route index element={<HomePage />} />
            <Route path="/test" element={<Test />} />
          </Route>
          <Route path="/create" element={<CreatePage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
        </Routes>
      </main>
    </div>
  );
};

function DataLoader() {
  const [loading, setLoading] = useState(false);

  const { notes, initializeNotes } = useNotes();

  useEffect(() => {
    let controller = new AbortController();

    if (notes == null) {
      console.log(notes);
      loadNotes();
    }

    async function loadNotes() {
      setLoading(true);
      try {
        const notes = await notesApi.getAllNotes(controller);
        initializeNotes(notes);
        // setError(null);
        controller = null;
      } catch (error) {
        // setError(err.message);
        if (error.name === "AbortError") {
          console.log("Fetch safely aborted by layout unmount");
          return;
        }

        controller = null;
        console.log("Error fetching notes");
        console.log(error.message);
        console.log("Failed to load notes");
      } finally {
        if (controller === null) {
          setLoading(false);
        }
      }
    }

    return () => {
      if (controller) {
        controller.abort();
      }
    }
  }, []);

  if (loading) {
    // return <h1>Loading...</h1>
    return <Spinner />;
  }

  return <Outlet />;
}

function Test() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, [])

  if (loading) {
    return <Spinner />
  }

  return <h1>Test</h1>
}

const GlobalNotificationsWrapper = () => {
  const { notifications, removeNotification } = useNotify();
  return <Notifications notifications={notifications} removeNotification={removeNotification} />;
};

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link to="/" className="logo"><span>Think</span>Board</Link>
        <div>
          <Link to={"/test"} className="link-btn">
            <i className="fa fa-bars" aria-hidden="true"></i>
            <span>Test Link</span>
          </Link>
          <Link to={"/create"} className="link-btn">
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span>New Note</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

const Spinner = () => {
  return (
      <span
          className="loader"
          role="status"
          aria-live="polite"
      >
          <div className="logo-ring"></div>
          <div className="logo-ring"></div>
          <div className="logo-ring"></div>
          <div className="logo-ring"></div>
          <span className="sr-only">Loading content, please wait.</span>
      </span>
  )
}

export default App;


// import { NotificationProvider, useNotify } from './NotificationContext';
// import { HomePage } from './HomePage';

// const GlobalNotificationsWrapper = () => {
//     const { notifications, removeNotification } = useNotify();
//     return <Notifications notifications={notifications} removeNotification={removeNotification} />;
// };

// function App() {
//     return (
//         <NotificationProvider>
//             <NotesProvider>
//                 <HomePage />
//                 <GlobalNotificationsWrapper />
//             </NotesProvider>
//         </NotificationProvider>
//     );
// }