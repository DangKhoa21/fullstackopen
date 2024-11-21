import React, { useState } from "react";
import axios from "axios";
import { Weather, Visibility } from "../types/diary";
import { createDiary } from "../services/diaryService";

const DiaryForm = ({ notify }: { notify: (message: string) => void }) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");

  const addDiary = ((e: React.SyntheticEvent) => {
    e.preventDefault();

    createDiary({
      date,
      visibility,
      weather,
      comment
    }).then(() => {
      notify(`Added ${date}`);
      setDate("");
      setVisibility(Visibility.Great);
      setWeather(Weather.Sunny);
      setComment("");
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        notify(error.response?.data.error[0].message);
      } else {
        notify("An error occurred");
      }
    })
  })

  return (
    <form>
      <div>
        date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <VisibilityRadios visibility={visibility} setVisibility={setVisibility} />
      <WeatherRadios weather={weather} setWeather={setWeather} />
      <div>
        comment
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button
        onClick={addDiary}
      >
        add
      </button>
    </form>
  )
}

const VisibilityRadios = (
  { visibility, setVisibility }:
  { visibility: Visibility, setVisibility: (value: Visibility) => void }) => {

  return (
    <div>
      visibility &nbsp;
      great
      <input
        type="radio"
        name="visibility"
        value="great"
        checked={visibility === Visibility.Great}
        onChange={() => setVisibility(Visibility.Great)}
      />
      good
      <input
        type="radio"
        name="visibility"
        value="good"
        checked={visibility === Visibility.Good}
        onChange={() => setVisibility(Visibility.Good)}
      />
      ok
      <input
        type="radio"
        name="visibility"
        value="ok"
        checked={visibility === Visibility.Ok}
        onChange={() => setVisibility(Visibility.Ok)}
      />
      poor
      <input
        type="radio"
        name="visibility"
        value="poor"
        checked={visibility === Visibility.Poor}
        onChange={() => setVisibility(Visibility.Poor)}
      />
    </div>
  )
}

const WeatherRadios = (
  { weather, setWeather }:
  { weather: Weather, setWeather: (value: Weather) => void }) => {

  return (
    <div>
      weather &nbsp;
      sunny
      <input
        type="radio"
        name="weather"
        value="sunny"
        checked={weather === Weather.Sunny}
        onChange={() => setWeather(Weather.Sunny)}
      />
      rainy
      <input
        type="radio"
        name="weather"
        value="rainy"
        checked={weather === Weather.Rainy}
        onChange={() => setWeather(Weather.Rainy)}
      />
      cloudy
      <input
        type="radio"
        name="weather"
        value="cloudy"
        checked={weather === Weather.Cloudy}
        onChange={() => setWeather(Weather.Cloudy)}
      />
      stormy
      <input
        type="radio"
        name="weather"
        value="stormy"
        checked={weather === Weather.Stormy}
        onChange={() => setWeather(Weather.Stormy)}
      />
    </div>
  )
}

export default DiaryForm