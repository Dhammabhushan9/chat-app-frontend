 import Mainpage from "./mainpage";
 import SetUp from "./setup";
 import{BrowserRouter ,Routes,Route} from 'react-router-dom'

function App() {
 

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetUp/>}/>
        <Route path="/chat" element={<Mainpage/>}/>
      </Routes>
    </BrowserRouter>
 

    </>
  );
}

export default App;
