import { useMemo, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import StockScreenerForm from "./components/StockScreenerForm";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#90caf9" : "#1976d2",
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Logo above the form */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
          mb: 4,
        }}
      >
        <ShowChartIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", userSelect: "none" }}
        >
          Value Hunter
        </Typography>
      </Box>

      <StockScreenerForm />
    </ThemeProvider>
  );
}

export default App;
