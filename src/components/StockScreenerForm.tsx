import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";

interface ScreenerOptions {
  marketCapLowerThan?: number;
  priceLowerThan?: number;
  averageVolumeMoreThan?: number;
  exchange?: string;
  isActivelyTrading?: boolean;
  isEtf?: boolean;
  isFund?: boolean;
  limit?: number;
}

interface ScoredStock {
  symbol: string;
  score: number;
  explanation: string;
}

export default function StockScreenerForm() {
  const [form, setForm] = useState<ScreenerOptions>({
    isActivelyTrading: true,
    marketCapLowerThan: 500000000,
    averageVolumeMoreThan: 300000,
    priceLowerThan: 15,
    exchange: "NASDAQ",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScoredStock[] | null>(null);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleChange = (
    field: keyof ScreenerOptions,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      form.marketCapLowerThan === undefined ||
      form.priceLowerThan === undefined ||
      form.averageVolumeMoreThan === undefined ||
      !form.exchange
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const query = Object.entries(form)
      .filter(
        ([, value]) => value !== undefined && value !== "" && value !== null
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");

    fetch(`http://localhost:3002/run?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        console.error("Failed to fetch stocks:", err);
        setError("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Stock Screener
        </Typography>

        <TextField
          fullWidth
          label="Market Cap Lower Than ($)"
          type="number"
          required
          margin="normal"
          value={form.marketCapLowerThan ?? ""}
          onChange={(e) =>
            handleChange("marketCapLowerThan", Number(e.target.value))
          }
        />

        <TextField
          fullWidth
          label="Price Lower Than ($)"
          type="number"
          required
          margin="normal"
          value={form.priceLowerThan ?? ""}
          onChange={(e) =>
            handleChange("priceLowerThan", Number(e.target.value))
          }
        />

        <TextField
          fullWidth
          label="Average Volume More Than"
          type="number"
          required
          margin="normal"
          value={form.averageVolumeMoreThan ?? ""}
          onChange={(e) =>
            handleChange("averageVolumeMoreThan", Number(e.target.value))
          }
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Exchange</InputLabel>
          <Select
            value={form.exchange || ""}
            label="Exchange"
            onChange={(e) => handleChange("exchange", e.target.value)}
          >
            <MenuItem value="NASDAQ">NASDAQ</MenuItem>
            <MenuItem value="NYSE">NYSE</MenuItem>
            <MenuItem value="AMEX">AMEX</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isActivelyTrading ?? false}
              onChange={(e) =>
                handleChange("isActivelyTrading", e.target.checked)
              }
            />
          }
          label="Actively Trading"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isEtf ?? false}
              onChange={(e) => handleChange("isEtf", e.target.checked)}
            />
          }
          label="Include ETFs"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isFund ?? false}
              onChange={(e) => handleChange("isFund", e.target.checked)}
            />
          }
          label="Include Funds"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {results && (
        <Alert
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: isDarkMode
              ? theme.palette.success.dark
              : "#e6f4ea",
            color: isDarkMode ? theme.palette.success.contrastText : "inherit",
          }}
        >
          <List sx={{ mt: -3 }}>
            {results.map((stock, index) => (
              <ListItem key={stock.symbol} alignItems="flex-start">
                <ListItemText
                  primary={`${index + 1}. Ticker: ${stock.symbol}`}
                  secondary={stock.explanation}
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Box>
  );
}
