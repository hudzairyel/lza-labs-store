const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function findMessage(html) {
  const i = html.indexOf('"message"');
  if (i === -1) return null;
  return html.slice(i, i + 400);
}

async function main() {
  const home = await get('http://localhost:3003/');
  if (home.status === 200 && !findMessage(home.data)) {
    console.log('HOME: OK');
  } else {
    console.log('HOME: FAIL', findMessage(home.data));
  }

  const api = await get('http://localhost:3003/api/products');
  if (api.status === 200 && !findMessage(api.data)) {
    console.log('API: OK', api.data.slice(0, 200));
  } else {
    console.log('API: FAIL', findMessage(api.data) || api.data.slice(0, 200));
  }
}

main().catch((e) => console.error('ERR', e.message));
