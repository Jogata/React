import { Route, Routes } from "react-router";
// import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import NotesLoader from "./components/NotesLoader";
import HomePage from "./components/pages/HomePage";
import CreatePage from "./components/pages/CreatePage";
import NoteDetailPage from "./components/pages/NotePage";
import { useEffect } from "react";
import { useState } from "react";
import { useNotify } from "./context/NotificationProvider";
import { Notifications } from "./components/Notifications/Notifications";

const App = () => {
  return (
    <div className="page">
      <GlobalNotificationsWrapper />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<NotesLoader />}>
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

// const Spinner = () => {
//   return (
//       <span
//           className="loader"
//           role="status"
//           aria-live="polite"
//       >
//           <div className="logo-ring"></div>
//           <div className="logo-ring"></div>
//           <div className="logo-ring"></div>
//           <div className="logo-ring"></div>
//           <span className="sr-only">Loading content, please wait.</span>
//       </span>
//   )
// }

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