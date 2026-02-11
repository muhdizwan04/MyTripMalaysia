const { db } = require('../config/firebase');

// Helper to format time in HH:mm
const formatTime = (date) => {
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kuala_Lumpur'
    });
};

exports.calculateTransport = async (req, res) => {
    try {
        const { line, start, end } = req.body;

        if (!line || !start || !end) {
            return res.status(400).json({ error: 'Missing required fields: line, start, end' });
        }

        const snapshot = await db.collection('transport_lines')
            .where('line_name', '>=', line)
            .where('line_name', '<=', line + '\uf8ff')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: `Transport line "${line}" not found.` });
        }

        const lineData = snapshot.docs[0].data();
        const stations = lineData.stations;

        const startIndex = stations.findIndex(s => s.name.toLowerCase() === start.toLowerCase());
        const endIndex = stations.findIndex(s => s.name.toLowerCase() === end.toLowerCase());

        if (startIndex === -1) return res.status(404).json({ error: `Start station "${start}" not found.` });
        if (endIndex === -1) return res.status(404).json({ error: `End station "${end}" not found.` });

        const stops = Math.abs(endIndex - startIndex);
        const fare = lineData.type === 'KTM' ? 1.50 + (0.50 * stops) : 1.20 + (0.40 * stops);
        const duration = (3 * stops) + (lineData.type === 'KTM' ? 8 : 5);

        // --- Departure & Arrival Logic ---
        const now = new Date();
        // Convert to Malaysia Time
        const klTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));

        // Determine frequency based on peak hours (simplified: 7-9, 17-19)
        const hour = klTime.getHours();
        const isPeak = (hour >= 7 && hour < 9) || (hour >= 17 && hour < 19);
        const freqText = isPeak ? lineData.frequency.peak : lineData.frequency.off_peak;
        const freqMins = parseInt(freqText);

        // Calculate Next Departure
        // We assume trains run from start of operating hours at regular intervals
        const [opHour, opMin] = lineData.operating_hours.start.split(':').map(Number);
        const [clHour, clMin] = lineData.operating_hours.end.split(':').map(Number);

        const opStartTime = new Date(klTime);
        opStartTime.setHours(opHour, opMin, 0, 0);

        const opEndTime = new Date(klTime);
        opEndTime.setHours(clHour, clMin, 0, 0);

        let departureTime = new Date(klTime);

        if (klTime < opStartTime) {
            // Not started yet
            departureTime = opStartTime;
        } else if (klTime > opEndTime) {
            // Closed for today
            departureTime = null; // Indicate closed
        } else {
            // Running: next train is current time + random small wait or calculated interval
            // Simple logic: round up to next frequency interval from start time
            const diffMs = klTime - opStartTime;
            const diffMins = Math.floor(diffMs / 60000);
            const intervalsPassed = Math.floor(diffMins / freqMins);
            const minsToNextTrain = freqMins - (diffMins % freqMins);

            departureTime.setMinutes(klTime.getMinutes() + minsToNextTrain);
        }

        let arrivalTime = null;
        if (departureTime) {
            arrivalTime = new Date(departureTime);
            arrivalTime.setMinutes(departureTime.getMinutes() + duration);
        }

        res.json({
            line: lineData.line_name,
            type: lineData.type,
            start: stations[startIndex].name,
            end: stations[endIndex].name,
            fare: parseFloat(fare.toFixed(2)),
            duration_min: duration,
            stops: stops,
            color_code: lineData.color_code,
            departure_time: departureTime ? formatTime(departureTime) : "Closed",
            arrival_time: arrivalTime ? formatTime(arrivalTime) : "N/A",
            frequency: freqText
        });

    } catch (error) {
        console.error('Transport Calculation Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.getLines = async (req, res) => {
    try {
        const snapshot = await db.collection('transport_lines').get();
        const lines = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(lines);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};
