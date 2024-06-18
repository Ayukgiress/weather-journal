import React from 'react'

function Home() {
    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/api/data');
    //             const result = await response.json();
    //             setData(result);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);


  return (
    <>
    <h1>Weather Journal</h1>
    <div className='main-container'>
        
        <div className="hero">
            
        </div>
        <div className="inputsFields">
            <label for='data'>Date</label>
            <input  placeholder='DD/MM/YY' className='dat'/>


            <label for='text'>Description</label>
            <input type="text" placeholder='Description of Day' className='desc'/>


            <label for='weather'>Weather</label>
            <input  placeholder='weather' className='weth'/>

            <label for='temperature'>Temperature</label>
            <input  placeholder='temperature' className='temp'/>
        </div>
        {/* <div className="data">
            {data.map((mydb, index) => {
                
            })}
        </div> */}
    </div>
    </>
  )
}

export default Home