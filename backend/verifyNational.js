const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function verify() {
    try {
        console.log('🔍 Verifying Destinations...');
        const destRes = await axios.get(`${API_URL}/destinations`);
        const destinations = destRes.data;
        console.log(`- Count: ${destinations.length} (Expected 16)`);

        const sortednames = [...destinations].sort((a, b) => a.name.localeCompare(b.name));
        const isSorted = JSON.stringify(destinations) === JSON.stringify(sortednames);
        // Note: The API should sort it. If backend doesn't sort, frontend does. 
        // My change was in frontend `api.js`, so backend API might not return sorted.
        // Wait, I updated `src/lib/api.js`. This script calls backend directly.
        // So backend returns unsorted, but frontend sorts it. I should verify backend returns 16.

        console.log('🔍 Verifying Attractions (State: Perak)...');
        // Backend controller accepts `state` param now.
        const attrRes = await axios.get(`${API_URL}/attractions`, { params: { state: 'Perak' } });
        const attractions = attrRes.data;
        console.log(`- Count: ${attractions.length}`);
        const hasConcubine = attractions.some(a => a.name === "Concubine Lane");
        console.log(`- Has Concubine Lane: ${hasConcubine}`);

        if (destinations.length === 16 && hasConcubine) {
            console.log('✅ Verification Passed!');
        } else {
            console.log('❌ Verification Failed');
        }

    } catch (error) {
        console.error('❌ Verification Error:', error.message);
    }
}

verify();
