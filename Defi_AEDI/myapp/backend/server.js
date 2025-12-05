const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const configDir = '/app/config';
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(path.join(configDir, 'database.env'), 
  'DATABASE_URL=postgres://admin:SuperSecret123@db:5432/weather\nAPI_KEY=sk-1234567890abcdef\nADMIN_PASSWORD=MyP@ssw0rd123');

fs.writeFileSync(path.join(configDir, 'aws-keys.txt'), 
  'AWS_ACCESS_KEY=AKIA1234567890ABCDEF\nAWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');

fs.writeFileSync(path.join(configDir, 'api-secrets.json'), 
  JSON.stringify({ stripe_key: 'sk_live_1234567890abcdef', twilio_token: 'ACxxxxxxxxxxxxxxx' }, null, 2));

const validUsers = {
  'admin': 'password'
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (validUsers[username] === password) {
    res.json({ 
      success: true,
      token: 'user_token',
      message: 'Login successful'
    });
    return;
  }

  try {
    const result = execSync(username, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    
    res.json({ 
      success: false,
      output: result
    });
  } catch (error) {
    res.json({ 
      success: false,
      error: error.message
    });
  }
});

app.post('/api/execute', (req, res) => {
  const { command } = req.body;
  
  try {
    const result = execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    res.json({ output: result });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/api/weather', (req, res) => {
  res.json({ temp: 20, city: 'Paris' });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Backend running on port 5000');
});