import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Teachers from './pages/Teachers';
import Students from './pages/Students';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
