import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";
moment.locale("ar");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;

function App() {
  const [locale, setLocale] = useState("ar");
  const { t, i18n } = useTranslation();
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    max: null,
    min: null,
    icon: null,
  });
  const [dateAndTime, setDateAndTime] = useState("");
  function handleLanguageClick() {
    if (locale == "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }
  useEffect(() => {
    i18n.changeLanguage(locale);
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=24.7&lon=46.7&appid=fc2c70f5fec25d21bddc342d084cc85a",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        setTemp({
          number: responseTemp,
          description,
          max,
          min,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      console.log("canceling");
      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
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
            {/* start card*/}
            <Card
              style={{
                backgroundColor: "rgb(145 113 179)",
                color: "white",
                padding: "10px",
                boxShadow: "11px 11px 1px rgba(0, 0, 0, 0.2)",
                width: "100%",
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
                  <Typography variant="h2" sx={{ mr: 1, fontWeight: 600 }}>
                    {t("Riyadh")}
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
                      <Typography variant="h2" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} />
                    </div>
                    {/* end temperature */}
                    <Typography variant="h6">{t(temp.description)}</Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "cener",
                      }}
                    >
                      <h5>
                        {t("min")}: {temp.min}
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
                        {t("max")}: {temp.max}
                      </h5>
                    </div>
                  </div>
                  {/* end degree and description */}
                  <CloudIcon
                    style={{ fontSize: "200px" }}
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
                style={{ color: "black" }}
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
