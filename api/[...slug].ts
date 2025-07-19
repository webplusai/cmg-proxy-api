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
  
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        host: undefined,
      },
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? req.body
          : undefined,
    });
  
    const data = await response.text();

    // Set CORS headers on the actual response
    res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict this to your frontend domain
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(response.status).send(data);
}
