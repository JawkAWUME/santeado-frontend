const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = '2da7cd94-4f01-4457-abff-ace4f1443252_2bb040e6-ea3d-4125-a061-9db97c6bb58a';
const CLIENT_SECRET = 'eUT2Qeg2pVXAr8ekkHnhDLXVLRvg80BHE7yyBNbUI0s=';
const TOKEN_URL = 'https://icdaccessmanagement.who.int/connect/token';
const ICD_API_BASE = 'https://id.who.int/icd/entity/search';

let accessToken = null;
let tokenExpiry = null;

// ✅ Fonction pour obtenir ou rafraîchir le token
async function getAccessToken() {
    const now = Date.now();
    if (accessToken && tokenExpiry && now < tokenExpiry) {
        return accessToken;
    }

    try {
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'icdapi_access'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        console.log('✅ Nouveau token obtenu');
        return accessToken;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération du token:', error.message);
        throw new Error('Impossible d’obtenir le token ICD');
    }
}

// ✅ Endpoint pour interroger l’API ICD
app.get('/api/icd/search', async(req, res) => {
    try {
        const query = req.query.q || 'IV';
        const language = req.query.lang || 'fr';

        const token = await getAccessToken(); // ✅ Récupération dynamique du token

        const response = await axios.get(ICD_API_BASE, {
            params: {
                q: query,
                useFlexisearch: false,
                flatResults: true,
                highlightingEnabled: true
            },
            headers: {
                'accept': 'application/json',
                'API-Version': 'v2',
                'Accept-Language': language,
                'Authorization': `Bearer ${token}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('❌ Erreur ICD API:', error.response.data || error.message);
        res.status(error.response.status || 500).json({
            error: error.response.data || error.message
        });
    }
});

app.listen(3000, () => {
    console.log('✅ ICD API proxy server running on http://localhost:3000');
});