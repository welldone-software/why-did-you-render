import React from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Hooks',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    const calculateFlooredEvenNumber = num => num % 2 === 0 ? num : num - 1

    // create a custom hook
    // it always sets a new object even if the number didn't change
    // so it would cause a re-render even if the number didn't change
    // (since `{num}` would change)

    const useFlooredEvenNumber = ({num}) => {
      // the best fix in this case is to use setCount(calculateFlooredEvenNumber(num))
      // or:

      // const [countObj, setCountObj] = React.useState({num: calculateFlooredEvenNumber(num)})
      // const newNum = calculateFlooredEvenNumber(num)
      // if(newNum !== countObj.num){
      //   setCountObj({num: newNum})
      // }

      const [countObj, setCountObj] = React.useState({num: calculateFlooredEvenNumber(num)})
      React.useEffect(() => {
        setCountObj({num: calculateFlooredEvenNumber(num)})
      }, [num])
      return countObj
    }

    function FlooredEvenNumber({num}){
      const {num: flooredEvenNumber} = useFlooredEvenNumber({num})

      return (
        <div>Closest floored even number: {flooredEvenNumber}</div>
      )
    }

    FlooredEvenNumber.whyDidYouRender = true

    function Main(){
      const [currentCount, setCount] = React.useState(0)

      return (
        <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
          <h1>Hooks</h1>
          <div>
            <button onClick={() => {setCount(currentCount + 1)}}>
              Generate A random number be!
            </button>
          </div>
          <div>
            <span>Count: {currentCount}</span>
          </div>
          <FlooredEvenNumber num={currentCount}/>
        </div>
      )
    }

    ReactDom.render(<Main/>, domElement)
  }
}
