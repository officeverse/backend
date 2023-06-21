import { readFile } from 'fs/promises';
import { writeFileSync } from 'fs';

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
  const users = JSON.parse(
    await readFile(new URL('data.json', import.meta.url))
  );

  return Promise.all(
    users.map(async (user) => {
      const result = await postData(`${process.env.API_BASE_URL}/users`, user);
      const { _id: id, firstName, lastName, signUpCode } = result.data || {};
      return { id, firstName, lastName, signUpCode };
    })
  )
    .then((createdUsers) => {
      writeFileSync(
        'scripts/users/createdUsers.json',
        JSON.stringify(createdUsers)
      );
    })
    .catch((err) => {
      console.error(err);
    });
})();
