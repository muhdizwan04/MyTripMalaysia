import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
    const [itinerary, setItinerary] = useState([]);
    const [tripName, setTripName] = useState('My Malaysian Adventure');
    const [location, setLocation] = useState('Kuala Lumpur');

    const [isSaved, setIsSaved] = useState(false);
    const [busyDays, setBusyDays] = useState([]);

    useEffect(() => {
        const counts = {};
        itinerary.forEach(a => {
            if (a.type !== 'transport' && a.type !== 'logistics') {
                counts[a.day] = (counts[a.day] || 0) + 1;
            }
        });
        const busy = Object.keys(counts).filter(d => counts[d] >= 5).map(Number);
        setBusyDays(busy);
    }, [itinerary]);

    const toggleSave = () => setIsSaved(prev => !prev);

    const addActivity = (activity) => {
        setItinerary(prev => {
            const newItinerary = [...prev, activity];
            // Sort by day then time
            return newItinerary.sort((a, b) => {
                if (a.day !== b.day) return a.day - b.day;
                const ta = parseInt(a.time.replace(':', ''));
                const tb = parseInt(b.time.replace(':', ''));
                return ta - tb;
            });
        });
    };

    const removeActivity = (id) => {
        setItinerary(prev => prev.filter(a => a.id !== id));
    };

    const updateActivityDuration = (id, newDuration) => {
        setItinerary(prev => prev.map(a =>
            a.id === id ? { ...a, duration: newDuration } : a
        ));
    };

    const reorderActivities = (day, newOrder) => {
        setItinerary(prev => {
            const others = prev.filter(a => a.day !== day);
            return [...others, ...newOrder].sort((a, b) => {
                if (a.day !== b.day) return a.day - b.day;
                const ta = parseInt(a.time.replace(':', ''));
                const tb = parseInt(b.time.replace(':', ''));
                return ta - tb;
            });
        });
    };

    return (
        <TripContext.Provider value={{
            itinerary,
            setItinerary,
            tripName,
            setTripName,
            location,
            setLocation,
            isSaved,
            toggleSave,
            busyDays,
            addActivity,
            removeActivity,
            updateActivityDuration,
            reorderActivities
        }}>
            {children}
        </TripContext.Provider>
    );
};
