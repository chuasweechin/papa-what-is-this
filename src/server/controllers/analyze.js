const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const textToSpeech = require('@google-cloud/text-to-speech');

const fs = require('fs');
const util = require('util');

module.exports = () => {
    const storageClient = new Storage();
    const visionClient = new vision.ImageAnnotatorClient();
    const speechClient = new textToSpeech.TextToSpeechClient();

    const GOOGLE_STORAGE_URL = process.env.GOOGLE_STORAGE_URL;
    const GOOGLE_STORAGE_BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME;
    const GOOGLE_KNOWLEDGE_GRAPH_API_KEY = process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY;

    const getAll = async (request, response) => {
        try {
            const labels = await analyzeImage(request);
            await analyzeSpeech();
            // await uploadBinary("/src/server/uploads/speeches/output.mp3");

            response.status(200);
            response.send(labels);

        } catch (err){
            console.log(err);
            response.status(404);
            response.send("Not found");
        }
    };

    const analyzeImage = async (request) => {
        try {
            const [result] = await visionClient.webDetection(request.file.path);
            return result.webDetection;

        } catch (err) {
            return err;
        }
    }

    const analyzeSpeech = async () => {
        try {
            const text = 'Apple!';

            const request = {
                input: { text: text },
                voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
                audioConfig: { audioEncoding: 'MP3' },
            };

            const [response] = await speechClient.synthesizeSpeech(request);

            await fs.writeFile('./src/server/uploads/speeches/output.mp3', response.audioContent, 'binary', () => {
                 console.log('Audio content written to file');
            });

        } catch (err) {
            console.log(err);
        }
    }

    const uploadBinary = async (filename) => {
        try {
            // Uploads a local file to the bucket
            await storageClient.bucket(GOOGLE_STORAGE_BUCKET_NAME).upload(filename, {
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            });

            console.log(`${ filename } uploaded to ${ GOOGLE_STORAGE_BUCKET_NAME }.`);
        } catch (e) {
            console.log(e);
        }
    }

    return {
        getAll
    };
};