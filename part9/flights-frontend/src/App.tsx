import { useState, useEffect } from "react";

import Notification from "./components/Notification";
import DiaryForm from "./components/DiaryForm";
import DiariesList from "./components/DiariesList";
import { DiaryEntry } from "./types/diary";
import { getDiaries } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getDiaries().then(setDiaries)
  }, [])

  const notify = (message: string) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div className="App">
      <h2>Add new entry</h2>
      <Notification message={message}/>
      <DiaryForm notify={notify}/>

      <h2>Diary entries</h2>
      <DiariesList diaries={diaries}/>
    </div>
  );
}

export default App