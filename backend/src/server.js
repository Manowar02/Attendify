import dotenv from 'dotenv';
import app from './app.js';
import dns from "dns"

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import connectDB from './config/db.js';

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Attendify API running on port ${port}`);
  });
}

export default app;
