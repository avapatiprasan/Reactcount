
import React, { useMemo, useState } from "react";
// import "/App.css" 

function App(){
    var[number,setNumber]= useState(0)
    var[count,setCount] = useState(0)

        function cubeNum(num){
            console.log("calculation done")
            return Math.pow(num,3)
        }
           var result = useMemo(()=>{return cubeNum(number)},[number])
        return (
            <div  className="container">
                        <div className="card">

                <h1>cube</h1>
                <label htmlFor=""></label>
                <input value={number} onChange={(e)=>setNumber(e.target.value)} type="text" />
                <h1>{result}</h1>
              <h1>{count}</h1>
              <button onClick={()=>setCount(count+1)} >+1</button>
            </div>
            </div>
        )

}

export default App;


