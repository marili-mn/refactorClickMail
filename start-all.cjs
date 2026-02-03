const { spawn } = require('child_process');
const path = require('path');

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  fgCyan: "\x1b[36m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgRed: "\x1b[31m",
};

console.log(`${colors.bright}${colors.fgCyan}=== Iniciando ClickMail System (Hybrid Mode) ===${colors.reset}\n`);

// 1. Iniciar Backend (Puerto 3000)
const backend = spawn('npm', ['run', 'dev'], { 
  cwd: path.join(__dirname, 'backend-ai'),
  shell: true,
  stdio: 'pipe' 
});

console.log(`${colors.fgGreen}[System] Iniciando Backend AI (Puerto 3000)...${colors.reset}`);

backend.stdout.on('data', (data) => {
  const output = data.toString().trim();
  // Filtrar logs de nodemon para no ensuciar
  if (output && !output.includes('[nodemon]')) {
    // Resaltar logs importantes de DeepSeek/Chat
    if (output.includes('Chat prompt') || output.includes('Generando')) {
      console.log(`${colors.fgYellow}[Backend-AI] ${output}${colors.reset}`);
    } else {
      console.log(`${colors.fgGreen}[Backend] ${output}${colors.reset}`);
    }
  }
});

backend.stderr.on('data', (data) => {
  console.error(`${colors.fgRed}[Backend Error] ${data.toString().trim()}${colors.reset}`);
});

// 2. Iniciar Frontend (Puerto 5173)
const frontend = spawn('npm', ['run', 'dev'], { 
  cwd: __dirname,
  shell: true,
  stdio: 'pipe' 
});

console.log(`${colors.fgCyan}[System] Iniciando Frontend React (Puerto 5173)...${colors.reset}`);

frontend.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    console.log(`${colors.fgCyan}[Frontend] ${output}${colors.reset}`);
  }
});

frontend.stderr.on('data', (data) => {
  // Vite tira info en stderr a veces, no siempre es error crítico
  const output = data.toString().trim();
  if (output && !output.includes('Forced re-optimization')) {
    console.log(`${colors.fgCyan}[Frontend Info] ${output}${colors.reset}`);
  }
});

// Manejo de cierre
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.fgRed}=== Deteniendo servicios ===${colors.reset}`);
  backend.kill();
  frontend.kill();
  process.exit();
});
