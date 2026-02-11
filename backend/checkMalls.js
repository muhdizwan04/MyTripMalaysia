const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkMalls() {
    console.log('Checking for malls in database...');

    // Check with boolean true
    console.log('Querying isMall == true (boolean)...');
    const snapshot1 = await db.collection('attractions').where('isMall', '==', true).get();
    console.log(`Found ${snapshot1.size} malls with boolean true`);
    snapshot1.docs.forEach(doc => console.log(doc.id, doc.data().name));

    // Check with string "true"
    console.log('\nQuerying isMall == "true" (string)...');
    const snapshot2 = await db.collection('attractions').where('isMall', '==', 'true').get();
    console.log(`Found ${snapshot2.size} malls with string "true"`);

    // Check with is_mall (snake_case)
    console.log('\nQuerying is_mall == true (boolean)...');
    const snapshot3 = await db.collection('attractions').where('is_mall', '==', true).get();
    console.log(`Found ${snapshot3.size} malls with is_mall=true`);

    process.exit(0);
}

checkMalls();
