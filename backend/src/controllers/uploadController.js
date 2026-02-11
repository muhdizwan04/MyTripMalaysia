const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });

        blobStream.on('finish', async () => {
            // Make the file public (optional, depending on your bucket rules)
            // or use getSignedUrl. For simplicity in a prototype/dev app, 
            // we can construct the public URL if the bucket allows public read.
            // A more secure way is getSignedUrl with a long expiry.

            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

            res.status(200).json({
                url: publicUrl,
                fileName: fileName
            });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadImage };
