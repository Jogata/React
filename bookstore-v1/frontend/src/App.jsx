import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateBook from "./pages/CreateBook";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    // <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/create" element={<CreateBook />} />
        <Route path="/books/details/:id" element={<BookDetails />} />
      </Routes>
    // </>
  )
}

export default App;
