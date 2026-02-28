import './App.css';
import NavBar from './components/NavBar';
import {Routes, Route} from "react-router-dom";
import AddTask from './components/AddTask';
import List from './components/List';
import SignupPage from './components/Signup';
import LoginPage from './components/Login';
import Protected from './components/Protected';

function App() {
  return (
    <>
      <NavBar/>

      <Routes>
        <Route path='' element={<Protected><List /></Protected>} />
        <Route path='/add-task' element={<Protected><AddTask /></Protected>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
