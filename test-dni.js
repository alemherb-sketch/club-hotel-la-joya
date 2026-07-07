const docNumber = "42523545";
const endpoints = [
  { url: `https://api.apis.net.pe/v1/dni?numero=${docNumber}`, name: 'apis v1' },
  { url: `https://corsproxy.io/?https://api.apis.net.pe/v1/dni?numero=${docNumber}`, name: 'apis v1 cors' },
  { url: `https://dniruc.apisperu.com/api/v1/dni/${docNumber}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRlbW9AZGVtby5jb20ifQ.demo`, name: 'dniruc.com' }
];

async function test() {
  for (const ep of endpoints) {
    try {
      console.log(`Testing ${ep.name}: ${ep.url}`);
      const res = await fetch(ep.url);
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 100)}\n`);
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
    }
  }
}
test();
