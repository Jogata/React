import { Link, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  )
}

function Home() {
  return (
    <>
      <h1>home</h1>
      <Link to="/test">test</Link>
    </>
  )
}

function Test() {
  return (
    <>
      <h1>test</h1>
      <Link to="/">home</Link>
    </>
  )
}

export default App;
