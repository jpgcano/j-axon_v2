import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'jaxon-core-api' });
});

app.listen(port, () => {
  console.log(`J-axon Core API running on port ${port}`);
});
