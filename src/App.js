import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeather } from "./weatherApiSlice";
import CircularProgress from "@mui/material/CircularProgress";
moment.locale("ar");

const theme = createTheme({
    typography: {
        fontFamily: ["IBM"],
    },
    palette: {
        secondary: {
            main: "rgb(28 52 91 / 36%)",
        },
        text: {
            main: "#FFFFFF",
        },
    },
});

function App() {
    //Redux code
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => {
        return state.weather.isLoading;
    });
    const weather = useSelector((state) => {
        return state.weather.weatherData;
    });

    const [city, setCity] = useState(localStorage.getItem("lastCity") || "Riyadh");
    const [error, setError] = useState(""); // State to handle errors

    const [locale, setLocale] = useState(
        localStorage.getItem("locale") || "ar"
    ); // Default language is from localStorage or "ar"

    const { t, i18n } = useTranslation();
    const [dateAndTime, setDateAndTime] = useState("");

    function handleLanguageClick() {
        const newLocale = locale === "en" ? "ar" : "en";
        setLocale(newLocale);
        i18n.changeLanguage(newLocale);
        moment.locale(newLocale);
        localStorage.setItem("locale", newLocale); // Save the new language to localStorage
    }

    useEffect(() => {
        dispatch(fetchWeather(city));
        setDateAndTime(moment().format("dddd, MMMM / Do / YYYY"));
        setCity("");
    }, []);

    useEffect(() => {
        moment.locale(locale); // Ensure moment uses the correct locale whenever it changes
        setDateAndTime(moment().format("dddd, MMMM / Do / YYYY"));
    }, [locale]); // Now it depends on locale only

    function handleSearchClick() {
        if (city.trim() === "") {
            setError(t("City name cannot be empty"));
        } else {
            setError("");
            // Dispatch fetchWeather with the input city
            dispatch(fetchWeather(city)).then((response) => {
                if (response.error) {
                    setError(t("Invalid city name"));
                } else {
                    // Save the searched city in localStorage
                    localStorage.setItem("lastCity", city);
                    setCity("");
                }
            });
        }
    };

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    {/* start card container */}
                    <div
                        style={{
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        {/* Start Search Part */}
                        <Box
                            sx={{
                                mb: 4,
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "400px",
                            }}
                            dir="rtl"
                        >
                            <div>
                                <TextField
                                    id="outlined-basic"
                                    label={t("Enter Your City")}
                                    variant="outlined"
                                    sx={{ borderRadius: "4px" }}
                                    color="secondary"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    error={Boolean(error)}
                                    helperText={error}
                                />
                            </div>
                            <div
                                style={{
                                    background: "rgb(28 52 91 / 36%)",
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={handleSearchClick}
                            >
                                <SearchIcon
                                    sx={{ color: theme.palette.text.main }}
                                />
                            </div>
                        </Box>
                        {/* End Search Part */}
                        {/* start card*/}
                        <Card
                            sx={{
                                color: theme.palette.text.main,
                                padding: "10px",
                                boxShadow: "11px 11px 1px rgba(0, 0, 0, 0.2)",
                                width: "100%",
                                background:
                                    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(133,179,158,1) 48%)",
                            }}
                            dir={locale == "en" ? "ltr" : "rtl"}
                        >
                            {/* start content */}
                            <div>
                                {/* start city and time */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "end",
                                        justifyContent: "start",
                                    }}
                                    dir={locale == "en" ? "ltr" : "rtl"}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{ mr: 1, fontWeight: 600 }}
                                    >
                                        {weather.cityName}
                                    </Typography>
                                    <Typography variant="h5" sx={{ mr: 1 }}>
                                        {dateAndTime}
                                    </Typography>
                                </div>
                                {/* end city and time */}
                                <hr />
                                {/* start container of degree + CloudIcon */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                    }}
                                >
                                    {/* start degree and description */}
                                    <div>
                                        {/* start temperature */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {isLoading ? (
                                                <CircularProgress
                                                    style={{ color: "white" }}
                                                />
                                            ) : (
                                                ""
                                            )}
                                            <Typography
                                                variant="h2"
                                                style={{ textAlign: "right" }}
                                            >
                                                {weather.number}
                                            </Typography>
                                            <img src={weather.icon} />
                                        </div>
                                        {/* end temperature */}
                                        <Typography variant="h6">
                                            {t(weather.description)}
                                        </Typography>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <h5>
                                                {t("min")}: {weather.min}
                                            </h5>
                                            <h5
                                                style={{
                                                    marginRight: "5px",
                                                    marginLeft: "5px",
                                                }}
                                            >
                                                |
                                            </h5>
                                            <h5>
                                                {t("max")}: {weather.max}
                                            </h5>
                                        </div>
                                    </div>
                                    {/* end degree and description */}
                                    <CloudIcon
                                        sx={{
                                            fontSize: {
                                                xs: "150px",
                                                sm: "200px",
                                            },
                                            color: theme.palette.text.main,
                                        }}
                                        className="cloud-icon"
                                    />
                                </div>
                                {/* end container of degree + CloudIcon */}
                            </div>
                            {/* end content */}
                        </Card>
                        {/* end card*/}
                        {/* start translation container */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "end",
                                width: "100%",
                                marginTop: "20px",
                            }}
                            dir={locale == "en" ? "ltr" : "rtl"}
                        >
                            <Button
                                variant="text"
                                style={{
                                    color: "black",
                                    background: theme.palette.secondary.main,
                                }}
                                onClick={handleLanguageClick}
                            >
                                {locale == "en" ? "AR" : "EN"}
                            </Button>
                        </div>
                        {/* end translation container */}
                    </div>
                    {/* end card container */}
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;
