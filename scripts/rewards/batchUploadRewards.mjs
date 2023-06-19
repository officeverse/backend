import { readFile } from 'fs/promises';

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

(async () => {
  const rewards = JSON.parse(
    await readFile(new URL('data.json', import.meta.url))
  );
  rewards.map(async (reward) => {
    const { name, description, cost, category, imageFilePath } = reward;
    const image = await readFile(new URL(imageFilePath, import.meta.url));
    const fileExtension = imageFilePath.split('.').slice(-1)[0];
    const mime = `image/${fileExtension}`;
    const data = image.toString('base64');
    const uri = 'data:' + mime + ';base64,' + data;
    console.log(
      await postData(`${process.env.API_BASE_URL}/rewards`, {
        name,
        description,
        cost,
        category,
        imageDataUrl: uri,
      })
    );
  });
})();
