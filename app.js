const express = require('express');
const connectDB = require('./db/connect');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/users', require('./routes/users'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api', require('./routes/chat'));


app.get('/', (req, res) => res.send('✅ Conversation backend is live'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
