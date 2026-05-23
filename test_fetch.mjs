import fs from 'fs';

const projectStr = fs.readFileSync('.insforge/project.json', 'utf8');
const project = JSON.parse(projectStr);

const url = `${project.oss_host}/rest/v1/products`;
const headers = {
  'apikey': project.api_key,
  'Authorization': `Bearer ${project.api_key}`,
  'Content-Type': 'application/json'
};

async function testFetch() {
  const res = await fetch(url, { headers });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
}

testFetch();
