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
            await analyzeSpeech(labels.webEntities)

            // console.log(labels.webEntities);
            console.log("after speech");
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

    const analyzeSpeech = async (webEntities) => {
        const fileType = `.mp3`;
        const directory = `./src/server/uploads/speeches/`;

        for (let i = 0; i < webEntities.length; i++) {
            const filename = webEntities[i].description.replace(/ /g,"-") + fileType;
            const filenameWithPath = directory + filename;

            const request = {
                input: { text: webEntities[i].description },
                voice: { languageCode: 'en-SG', ssmlGender: 'MALE' },
                audioConfig: { audioEncoding: 'MP3' },
            };

            const [response] = await speechClient.synthesizeSpeech(request);

            await fs.writeFile(filenameWithPath, response.audioContent, 'binary', async () => {
                await storageClient.bucket(GOOGLE_STORAGE_BUCKET_NAME).upload(filenameWithPath, {
                    gzip: true,
                    metadata: {
                        cacheControl: 'public, max-age=31536000',
                    },
                });
                webEntities[i].speechUrl = GOOGLE_STORAGE_URL + GOOGLE_STORAGE_BUCKET_NAME + "/" + filename;
            });
        }
    }

    return {
        getAll
    };
};