const url = 'https://7tn4s338.us-east.insforge.app/';
const options = { headers: { apikey: 'ik_a04db2813a01e7cbf1f453a1cabd1f11' } };

fetch(url, options)
  .then(res => res.text())
  .then(data => console.log(data))
  .catch(console.error);
