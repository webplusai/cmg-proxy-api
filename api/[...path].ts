import getRawBody from 'raw-body';

export const config = {
    api: {
      bodyParser: false, // Enable default body parsing
    },
};

export default async function handler(req, res) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict to your frontend domain
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).end();
        return;
    }

    // const path = req.url.split('?')[0].replace('/api/', '');

    const pathSegments = req.query.path;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments || '';
    const url = `http://185.92.220.208:5000/${path}`;

    const rawBody =
      req.method !== 'GET' && req.method !== 'HEAD'
        ? await getRawBody(req)
        : undefined;

    console.log(rawBody);
    console.log(rawBody.toString('utf-8'));
  
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        'Content-Type': 'application/json',
      },
      body: rawBody?.toString('utf-8')
        // req.method !== 'GET' && req.method !== 'HEAD'
        //   ? rawBody
        //   : undefined,
    });
  
    const data = await response.text();

    // Set CORS headers on the actual response
    res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict this to your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(response.status).send(data);
}
