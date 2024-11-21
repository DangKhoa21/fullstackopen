import { DiaryEntry } from "../types/diary"

const DiariesList = ({ diaries }: { diaries: DiaryEntry[] }) => {
  return (
    <div>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>{diary.comment}</p>
          <p>visibility: {diary.weather}</p>
          <p>weather: {diary.visibility}</p>
        </div>
      ))}
    </div>
  )
}

export default DiariesList