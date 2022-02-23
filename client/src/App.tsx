import {Routes, Route} from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import AuthProvider from "./AuthContext";

function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="*" element={<ErrorPage/>}/>
          <Route path="/profile/:userID" element={<ProfilePage/>}/>
        </Routes>
      </AuthProvider>
  );
}

export default App;
