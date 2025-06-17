import express from 'express'

const app = express();
const PORT = 8000;


app.get('/', (req, res) => {
  res.send('Baksho is Running!!!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});