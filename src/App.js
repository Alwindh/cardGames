import './App.css';
import Game from "./Game.js";
import {
  BrowserRouter,
  Routes,
  Route} from "react-router-dom";
  import { createTheme, ThemeProvider } from '@mui/material/styles';


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',primary:{main:'#fff'},
      background: {
        default: '#35654d',
      },
    },
  });

function App() {
  return (
    <ThemeProvider theme={darkTheme}>  

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
