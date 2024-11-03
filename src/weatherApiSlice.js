import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWeather = createAsyncThunk(
  "weatherApi/fetchWeather",
  async () => {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?lat=24.7&lon=46.7&appid=fc2c70f5fec25d21bddc342d084cc85a"
    );
    // handle success
    const responseTemp = Math.round(response.data.main.temp - 272.15);
    const min = Math.round(response.data.main.temp_min - 272.15);
    const max = Math.round(response.data.main.temp_max - 272.15);
    const description = response.data.weather[0].description;
    const responseIcon = response.data.weather[0].icon;

    return {
      number: responseTemp,
      min,
      max,
      description,
      icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
    };
  }
);
export const weatherApiSlice = createSlice({
  name: "weatherApi",
  initialState: {
    result: "empty",
    weatherData: {},
    isLoading: false,
  },
  reducers: {
    changeResult: (state, action) => {
      state.result = "changed";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWeather.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weatherData = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { changeResult } = weatherApiSlice.actions;
export default weatherApiSlice.reducer;
