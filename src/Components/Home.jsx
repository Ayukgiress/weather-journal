import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaList, FaTrash, FaEdit, FaCloud, FaThermometerHalf, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

function Home() {
    const [entries, setEntries] = useState([]);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingEntries, setViewingEntries] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);

    const addEntry = async () => {
        if (date && location && description) {
            setLoading(true);
            setError(null);
            try {
                const { latitude, longitude } = await fetchCoordinates(location);
                const { weather, temperature } = await fetchWeatherData(latitude, longitude);

                const response = await fetch('http://localhost:5000/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date,
                        description,
                        weather,
                        temperature,
                        latitude,
                        longitude
                    })
                });
                const data = await response.json();
                const entryWithLocation = { ...data, location };
                setEntries([...entries, entryWithLocation]);

                // Store location in localStorage for persistence
                localStorage.setItem(`entry_location_${data.id}`, location);

                setDate('');
                setLocation('');
                setDescription('');
                setViewingEntries(true);
            } catch (error) {
                console.error('Error adding entry:', error);
                setError('Failed to add entry. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Date, location, and description are required.');
        }
    };

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const fetchCoordinates = async (cityName) => {
        const apiKey = '44a1147ed2527a0c66967dd206194156';
        const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;

        try {
            const response = await axios.get(apiUrl);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { latitude: lat, longitude: lon };
            } else {
                throw new Error('City not found');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            throw error;
        }
    };

    const fetchWeatherData = async (latitude, longitude) => {
        const apiKey = '44a1147ed2527a0c66967dd206194156';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        try {
            const response = await axios.get(apiUrl);
            const weather = response.data.weather[0].description;
            const temperature = response.data.main.temp;
            return { weather, temperature };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return { weather: 'N/A', temperature: 'N/A' };
        }
    };

    const updateEntry = async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`http://localhost:5000/${id}`, updatedData);
            setEntries(entries.map(entry => (entry.id === id ? response.data : entry)));
            setEditingEntry(null);
        } catch (error) {
            console.error('Error updating entry:', error);
            setError('Failed to update entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (entry) => {
        setEditingEntry(entry);
        setSelectedEntry(null);
    };

    const cancelEditing = () => {
        setEditingEntry(null);
    };

    const deleteEntry = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            setLoading(true);
            setError(null);
            try {
                await axios.delete(`http://localhost:5000/${id}`);
                setEntries(entries.filter(entry => entry.id !== id));
                if (selectedEntry && selectedEntry.id === id) {
                    setSelectedEntry(null);
                }
            } catch (error) {
                console.error('Error deleting entry:', error);
                setError('Failed to delete entry. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const viewEntryDetails = (entry) => {
        setSelectedEntry(entry);
        setEditingEntry(null);
    };

    const closeEntryDetails = () => {
        setSelectedEntry(null);
    };

    const fetchAllEntries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/');
            const entriesWithLocations = response.data.map(entry => ({
                ...entry,
                location: entry.location || localStorage.getItem(`entry_location_${entry.id}`)
            }));
            setEntries(entriesWithLocations);
            setViewingEntries(true);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError('Failed to fetch entries. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='app'>
            <div className='main-container'>
                <h1>Weather Journal</h1>

                <div className='form-group'>
                    <label htmlFor="date">
                        <FaCalendarAlt /> Date
                    </label>
                    <input
                        id='date'
                        name='date'
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="location">
                        <FaMapMarkerAlt /> Location
                    </label>
                    <input
                        id='location'
                        name='location'
                        type="text"
                        placeholder="Enter city name (e.g., London, New York)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="description">
                        <FaMapMarkerAlt /> Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        placeholder="How was the weather today?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                    />
                </div>

                <div className='btn-group'>
                    <button
                        className='btn btn-primary'
                        onClick={addEntry}
                        disabled={loading}
                    >
                        {loading ? <span className="loading"></span> : <FaPlus />}
                        Add Entry
                    </button>
                    <button
                        className='btn btn-secondary'
                        onClick={fetchAllEntries}
                        disabled={loading}
                    >
                        {loading ? <span className="loading"></span> : <FaList />}
                        View Entries
                    </button>
                </div>

                {error && <div className='error-message'>{error}</div>}
            </div>

            {selectedEntry && (
                <div className='main-container' style={{ marginTop: '2rem' }}>
                    <h2>Entry Details</h2>
                    <div className='result-card' style={{ cursor: 'default' }}>
                        <h3><FaCalendarAlt /> {new Date(selectedEntry.date).toLocaleDateString()}</h3>
                        <p><FaMapMarkerAlt /> Location: {selectedEntry.location || `${selectedEntry.latitude?.toFixed(2)}, ${selectedEntry.longitude?.toFixed(2)}`}</p>
                        <p>{selectedEntry.description}</p>
                        <p className='weather-info'>
                            <FaCloud /> Weather: {selectedEntry.weather}
                        </p>
                        <p className='temperature'>
                            <FaThermometerHalf /> {selectedEntry.temperature} °C
                        </p>
                        <div className='card-actions'>
                            <button
                                className='btn btn-small btn-update'
                                onClick={() => startEditing(selectedEntry)}
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                className='btn btn-small btn-delete'
                                onClick={() => deleteEntry(selectedEntry.id)}
                            >
                                <FaTrash /> Delete
                            </button>
                            <button
                                className='btn btn-secondary'
                                onClick={closeEntryDetails}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingEntry && (
                <div className='main-container' style={{ marginTop: '2rem' }}>
                    <h2>Edit Entry</h2>
                    <div className='form-group'>
                        <label>Date</label>
                        <input
                            type="date"
                            value={editingEntry.date}
                            onChange={(e) => setEditingEntry({...editingEntry, date: e.target.value})}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Location</label>
                        <input
                            type="text"
                            value={editingEntry.location || `${editingEntry.latitude?.toFixed(2)}, ${editingEntry.longitude?.toFixed(2)}`}
                            onChange={(e) => setEditingEntry({...editingEntry, location: e.target.value})}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Description</label>
                        <textarea
                            value={editingEntry.description}
                            onChange={(e) => setEditingEntry({...editingEntry, description: e.target.value})}
                            rows="3"
                        />
                    </div>
                    <div className='btn-group'>
                        <button
                            className='btn btn-primary'
                            onClick={() => updateEntry(editingEntry.id, editingEntry)}
                            disabled={loading}
                        >
                            {loading ? <span className="loading"></span> : 'Save Changes'}
                        </button>
                        <button
                            className='btn btn-secondary'
                            onClick={cancelEditing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {viewingEntries && entries.length > 0 && !selectedEntry && !editingEntry && (
                <div className='results'>
                    {entries.map(entry => (
                        <div key={entry.id || Math.random()} className='result-card' onClick={() => viewEntryDetails(entry)}>
                            <h3><FaCalendarAlt /> {new Date(entry.date).toLocaleDateString()}</h3>
                            <p><FaMapMarkerAlt /> {entry.location || `${entry.latitude?.toFixed(2)}, ${entry.longitude?.toFixed(2)}`}</p>
                            <p className='weather-info'>
                                <FaCloud /> {entry.weather}
                            </p>
                            <p className='temperature'>
                                <FaThermometerHalf /> {entry.temperature} °C
                            </p>
                            <div className='card-actions'>
                                <button
                                    className='btn btn-small btn-update'
                                    onClick={(e) => { e.stopPropagation(); startEditing(entry); }}
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    className='btn btn-small btn-delete'
                                    onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
