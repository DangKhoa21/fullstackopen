const Course = ({course}) => {
    console.log("Receiving course: ", course)
  
    const Header = ({ name }) => <h2>{name}</h2>
  
    const Content = ({parts}) => {
      console.log("Receiving parts: ", parts)
      return (
        <div>
        {parts.map(part => <Part key={part.id} name={part.name} exercise={part.exercises} />)}
        </div>
      )
    }
  
    const Part = (props) => {
      return (
        <p>{props.name} {props.exercise}</p>
      )
    }
  
    const Total = ({parts}) => {
      return (
        <h4>Number of exercises {parts.reduce((s, p) => s + p.exercises, 0)}</h4>
      )
    }
  
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }
  
  export default Course