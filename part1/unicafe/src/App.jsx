import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all == 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  const StatisticLine = ({ text, value }) => {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={`${positive}%`} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAvg] = useState(0)
  const [positive, setPos] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    updateStat(good + 1, neutral, bad)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    updateStat(good, neutral + 1, bad)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
    updateStat(good, neutral, bad + 1)
  }
  const updateStat = (good, neutral, bad) => {
    const all = good + neutral + bad
    const average = all == 0 ? 0 : (good - bad) / all
    const positive = all == 0 ? 0 : (good) / all
    setAll(all)
    setAvg(average)
    setPos(positive)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App