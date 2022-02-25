import {Routes, Route} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import AuthProvider from "./AuthContext";
import SearchPage from "./Pages/SearchPage/SearchPage";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/profile/:userID" element={<ProfilePage/>}/>
          <Route path="*" element={<ErrorPage/>}/>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
