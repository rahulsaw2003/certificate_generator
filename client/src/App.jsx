import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './Home';



function App() {
  return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />}></Route>
				</Routes>
			</Router>
      <ToastContainer />
		</>
	);
}

export default App;
