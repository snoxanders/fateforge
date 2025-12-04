import express from 'express';
import cors from 'cors';
import characterRoutes from './routes/characterRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', characterRoutes);

app.get('/', (req, res) => {
  res.send('RandomPC API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

