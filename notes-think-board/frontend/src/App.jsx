// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App;

import { Route, Routes } from "react-router";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/create" element={<TestCreate />} />
      </Routes>
    </>
  );
};

import { Link } from "react-router";

const Navbar = () => {
  return (
    <header>
      <div>
        <nav>
          <Link to="/" className="logo"><span>Think</span>Board</Link>
          <div>
            <Link to={"/create"} className="link-btn">
              <i className="fa fa-plus" aria-hidden="true"></i>
              <span>New Note</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

function Test() {
  return <h1 className="test">Test Home</h1>
}

function TestCreate() {
  return <h1 className="test">Test Create page</h1>
}

const Spinner = () => {
  return (
      <span className="loader">
          <div className="logo-ring"></div>
          <div className="logo-ring"></div>
          <div className="logo-ring"></div>
          <div className="logo-ring"></div>
      </span>
  )
}

export default App;