const fs = require('fs');
const util = require('util');
const {resolve} = require('path');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const textToSpeech = require('@google-cloud/text-to-speech');

module.exports = () => {
    const credentials = {
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: {
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL
        }
    };

    const GOOGLE_STORAGE_URL = process.env.GOOGLE_STORAGE_URL;
    const GOOGLE_STORAGE_BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME;

    const storageClient = new Storage(credentials);
    const visionClient = new vision.ImageAnnotatorClient(credentials);
    const speechClient = new textToSpeech.TextToSpeechClient(credentials);

    const getImageDescription = async (request, response) => {
        try {
            console.log("Get image description request received...");
            const labels = await analyzeImage(request);
            response.status(200).send(labels);

        } catch (err) {
            console.log(err);
            response.status(500).send('Something went wrong with the server...');
        }
    };

    const getTextAudio = async (request, response) => {
        try {
            console.log("Get text audio request received...");
            const audioUrl = await analyzeText(request.body.content);
            response.status(200).send({ audioUrl: audioUrl });

        } catch (err) {
            console.log(err);
            response.status(500).send('Something went wrong with the server...');
        }
    };

    const analyzeImage = async (request) => {
        try {
            const [result] = await visionClient.webDetection(request.file.path);
            fileCleanUp(request.file.path);

            return result.webDetection;

        } catch(err) {
            console.log("[ERROR] An error occurred in analyzing image");
            throw err;
        }
    }

    const analyzeText = async (content) => {
        try {
            const directory = resolve(__dirname, '..', 'uploads/speeches');

            const filename = content.replace(/ /g,"-") + `.mp3`;
            const filenameWithPath = directory + filename;

            const request = {
                input: { text: content },
                voice: { languageCode: 'en-SG', ssmlGender: 'MALE' },
                audioConfig: { audioEncoding: 'MP3' },
            };

            const [response] = await speechClient.synthesizeSpeech(request);

            await fs.writeFile(filenameWithPath, response.audioContent, 'binary', () => {});

            await storageClient.bucket(GOOGLE_STORAGE_BUCKET_NAME).upload(filenameWithPath, {
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            });

            // crashes the server if the same file is remove while other concurrent trend are running
            // fileCleanUp(filenameWithPath);

            return GOOGLE_STORAGE_URL + GOOGLE_STORAGE_BUCKET_NAME + "/" + filename;

        } catch(err) {
            console.log("[ERROR] An error occurred in analyzing text");
            throw err;
        }
    }

    const fileCleanUp = (fileWithPath) => {
        console.log(fileWithPath + " deleted after processing");

        fs.unlink(fileWithPath, err => {
            if (err) throw err;
        });
    };

    return {
        getImageDescription,
        getTextAudio
    };
};