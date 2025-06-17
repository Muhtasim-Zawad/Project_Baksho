import express from 'express';

const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Baksho is running!!');
});

app.listen(port, () => {
  console.log(`Baksho is running at http://localhost:${port}`);
});
