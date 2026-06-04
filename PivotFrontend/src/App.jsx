import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import RepoDetail from "./pages/RepoDetail";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repo/:repoId"element={<RepoDetail />}/>
      </Routes>
    </BrowserRouter>
  );
}