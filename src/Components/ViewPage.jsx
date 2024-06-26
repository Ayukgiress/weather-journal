// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// import { useState } from "react";

// function ViewPage() {
//     const [entries, setEntries] = useState([])
//     const [date, setDate] = useState('');
//     const [description, setDescription] = useState('')
//     const [latitude, setLatitude] = useState(null);
//     const [longitude, setLongitude] = useState(null);


//     const addEntry = async () => {
//         if (latitude && longitude) {
//             const response = await axios.post('http://localhost:5000/', {
//                 date: new Date().toISOString(),
//                 description: 'Sample description',
//                 latitude,
//                 longitude
//             });
//             setEntries([...entries, response.data]);
//         }
//     };  

  

//   return (
//     <>
//    <div className="main-container">
//    <input placeholder='Enter date'  onChange={(e) => setDate(e.target.value)} className="dat"/>
//     <input placeholder='Description'  onChange={(e) => setDescription(e.target.value)} className="desc"/>
//     <button onClick={addEntry}>Add Entry</button>
//    </div>
       
//     </>
//   );
// }

// export default ViewPage;