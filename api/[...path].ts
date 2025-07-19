export default async function handler(req, res) {
    const path = req.url.split('?')[0].replace('/api/', '');
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
          ? JSON.stringify(req.body)
          : undefined,
    });
  
    const data = await response.text();
    res.status(response.status).send(data);
}
