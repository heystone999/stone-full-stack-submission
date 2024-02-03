const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => {
    const total = parts.reduce((s, p) => {
        return s + p.exercises
    }, 0)
    return (<>
        {parts.map((part) => (
            <Part key={part.id} part={part} />
        ))}
        <Total sum={total} />
    </>)
}
const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
        </div>
    )
}
export default Course