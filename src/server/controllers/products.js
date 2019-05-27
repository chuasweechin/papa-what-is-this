const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');

module.exports = (db) => {
    const client = new vision.ImageAnnotatorClient();
    const GOOGLE_KNOWLEDGE_GRAPH_API_KEY = process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY;

    const getAll = async (request, response) => {
        try {
            const [result] = await client.webDetection(request.file.path);
            const labels = result.webDetection;

            response.status(200);
            response.send(labels);

        } catch (err){
            console.log(err);
            response.status(404);
            response.send("Not found");
        }
    };

    return {
        getAll
    };
};