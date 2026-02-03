const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-dev';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos

// --- Redirecciones para facilitar acceso a la demo ---
app.get('/', (req, res) => {
  res.redirect('/demo.html');
});

app.get('/demo', (req, res) => {
  res.redirect('/demo.html');
});

// --- Base de Datos en Memoria ---
const db = {
  users: [],
  campaigns: []
};

// --- Configuración DeepSeek (Compatible con OpenAI SDK) ---
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const config = { 
    apiKey: process.env.OPENAI_API_KEY,
  };
  
  // Si es DeepSeek u otro proveedor compatible
  if (process.env.OPENAI_BASE_URL) {
    config.baseURL = process.env.OPENAI_BASE_URL;
    console.log(`Configurando proveedor AI personalizado: ${config.baseURL}`);
  }

  openai = new OpenAI(config);
  console.log('Cliente AI inicializado correctamente.');
} else {
  console.log('API Key NO configurada. Se usará modo simulación.');
}

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Middleware de Autenticación ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Para facilitar pruebas en desarrollo, si no hay header, pasamos (o podríamos rechazar)
    // return res.status(401).json({ message: 'No autorizado' });
    
    // En este modo "dev sin base de datos", vamos a ser permisivos si queremos probar rápido,
    // pero el frontend envía el token, así que intentemos validarlo.
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// --- Rutas de Autenticación ---

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const newUser = {
    id: generateId(),
    _id: generateId(), // Compatibilidad con MongoDB
    name,
    email,
    password // En producción, hashear password!
  };
  
  db.users.push(newUser);

  // Crear token
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
});

// --- Rutas de Campañas ---

// Obtener todas las campañas
app.get('/api/campaigns', authMiddleware, (req, res) => {
  // Filtrar por usuario (si tuviéramos persistencia real)
  // Aquí devolvemos todas para simplificar la demo o filtramos por si el token traía ID
  res.json(db.campaigns.reverse());
});

// Obtener campaña por ID
app.get('/api/campaigns/:id', authMiddleware, (req, res) => {
  const campaign = db.campaigns.find(c => c.id === req.params.id || c._id === req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaña no encontrada' });
  res.json(campaign);
});

// Crear campaña
app.post('/api/campaigns', authMiddleware, (req, res) => {
  const { name, description, targetAudience, tone } = req.body;
  
  const newCampaign = {
    id: generateId(),
    _id: generateId(),
    name,
    description,
    targetAudience,
    tone,
    status: 'borrador',
    emailContent: '',
    generatedEmail: '',
    userId: req.user.id,
    createdAt: new Date().toISOString(),
    stats: {
      totalSent: 0,
      opens: 0,
      clicks: 0,
      bounces: 0,
      openRate: '0%',
      clickRate: '0%'
    }
  };

  db.campaigns.push(newCampaign);
  res.status(201).json({
    message: 'Campaña creada',
    campaign: newCampaign
  });
});

// Actualizar campaña
app.put('/api/campaigns/:id', authMiddleware, (req, res) => {
  const index = db.campaigns.findIndex(c => c.id === req.params.id || c._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Campaña no encontrada' });

  db.campaigns[index] = { ...db.campaigns[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(db.campaigns[index]);
});

// Eliminar campaña
app.delete('/api/campaigns/:id', authMiddleware, (req, res) => {
  const index = db.campaigns.findIndex(c => c.id === req.params.id || c._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Campaña no encontrada' });

  db.campaigns.splice(index, 1);
  res.json({ message: 'Campaña eliminada' });
});

// --- Lógica de IA (Integración con DeepSeek) ---

async function generateEmailContent(name, description, targetAudience, tone) {
  // Lógica extraída de campaignController.js del proyecto original
  if (!openai) {
    // Simulación si no hay API Key
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #e11d48;">Modo Simulación (Sin API Key)</h2>
        <p>Este es un contenido generado automáticamente porque no se detectó una API Key válida.</p>
        <p><strong>Producto:</strong> ${name}</p>
        <p><strong>Audiencia:</strong> ${targetAudience}</p>
      </div>
    `;
  }

  const prompt = `Actúa como un experto redactor de marketing por correo electrónico (copywriter).
Tu tarea es escribir el código HTML de un correo electrónico promocional completo y profesional.

Detalles de la campaña:
- Producto/Servicio: "${name}"
- Descripción: "${description}"
- Público Objetivo: "${targetAudience}"
- Tono del mensaje: "${tone || 'Profesional y Persuasivo'}"

Requisitos:
1. Escribe SOLO el código HTML dentro de un <div> contenedor (sin <html> ni <body>).
2. Usa estilos en línea (CSS inline) para que se vea bien en cualquier cliente de correo.
3. El diseño debe ser limpio, moderno y responsivo.
4. Incluye un asunto sugerido en un comentario HTML al principio <!-- Asunto: ... -->.
5. NO incluyas explicaciones previas ni posteriores, solo el código HTML.`;

  try {
    console.log(`Enviando prompt a IA (${process.env.AI_MODEL || 'deepseek-chat'}) para: ${name}`);
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "deepseek-chat", 
      messages: [
        { role: "system", content: "Eres un asistente experto en generación de contenido HTML para email marketing." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 1.1 
    });

    const content = response.choices[0].message.content.trim();
    
    // Limpieza básica por si el modelo devuelve markdown
    const cleanContent = content.replace(/^```html/, '').replace(/```$/, '');
    
    return cleanContent;
  } catch (error) {
    console.error('Error Generación AI:', error);
    // Fallback elegante
    return `
      <div style="padding: 20px; color: #7f1d1d; background-color: #fef2f2; border: 1px solid #fecaca; rounded: 8px;">
        <h3>Error al generar contenido real</h3>
        <p>Hubo un problema comunicándose con la IA. Detalles: ${error.message}</p>
        <p>Por favor verifica tu API Key y saldo disponible.</p>
      </div>
    `;
  }
}

async function generateChatResponse(userMessage) {
  if (!openai) {
    // Modo simulación
    return {
      text: "Modo Simulación: Como no tengo API Key, te explico que en una situación real yo analizaría tu solicitud para darte consejos de marketing. Además, generaría el siguiente código:",
      html: `<div style="padding:20px;border:1px solid #ccc;"><h3>Ejemplo Simulado</h3><p>Esto es una prueba para: "${userMessage}"</p></div>`
    };
  }

  const systemPrompt = `Eres "ClickMail Copilot", un experto consultor y profesor de Email Marketing.
Tu objetivo es ayudar al usuario a crear campañas exitosas y EDUCARLO sobre por qué ciertas estrategias funcionan.

Instrucciones:
1. Responde de manera conversacional, amable y profesional (como un profesor experto).
2. Si el usuario pide un correo/campaña, explica brevemente la estrategia que usarás (el "por qué") y luego genera el código HTML.
3. Si el usuario solo hace una pregunta (ej: "¿Qué es el A/B testing?"), responde solo con la explicación.

IMPORTANTE - FORMATO DE RESPUESTA:
- Tu explicación/consejo va en texto plano.
- Si generas un email, pon el código HTML DENTRO de estos separadores exactos:
:::HTML_START:::
(aquí va solo el código HTML del email, con estilos inline)
:::HTML_END:::
`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const fullContent = response.choices[0].message.content.trim();
    
    // Parsear respuesta para separar Texto de HTML
    let textResponse = fullContent;
    let htmlContent = null;

    const htmlMatch = fullContent.match(/:::HTML_START:::([\s\S]*?):::HTML_END:::/);
    
    if (htmlMatch) {
      // Si hay HTML, lo extraemos y limpiamos el texto
      htmlContent = htmlMatch[1].trim();
      // Quitamos el bloque HTML del texto principal para que no se duplique visualmente
      textResponse = fullContent.replace(/:::HTML_START:::[\s\S]*?:::HTML_END:::/, '').trim();
    }

    return { text: textResponse, html: htmlContent };

  } catch (error) {
    console.error('Error AI:', error);
    // Retornar el error real al usuario para depuración
    return { 
      text: `❌ **Error de API:** ${error.message}\n\n*Por favor, verifica la configuración en el archivo .env*`,
      html: null 
    };
  }
}

// Endpoint para generar email (Asociado a una campaña existente)
app.post('/api/campaigns/:id/generate-email', authMiddleware, async (req, res) => {
  const campaign = db.campaigns.find(c => c.id === req.params.id || c._id === req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaña no encontrada' });

  try {
    const content = await generateEmailContent(
      campaign.name,
      campaign.description,
      campaign.targetAudience,
      campaign.tone
    );

    campaign.generatedEmail = content;
    campaign.emailContent = content; // Compatibilidad
    res.json({ message: 'Correo generado', email: content });
  } catch (error) {
    res.status(500).json({ message: 'Error generando email', error: error.message });
  }
});

// Endpoint para generar email de prueba (Sin ID de campaña, usado en "Método Directo" del frontend)
// Nota: El frontend refactorClickMail llama a /api/campaigns/generate-test-email
app.get('/api/campaigns/generate-test-email', async (req, res) => {
  const { name, description, targetAudience, tone } = req.query;
  
  console.log('Generando email directo para:', name);

  try {
    const content = await generateEmailContent(
      name || 'Producto Demo',
      description || 'Descripción de prueba',
      targetAudience || 'General',
      tone || 'Profesional'
    );
    
    // El frontend espera { success: true, email: ... }
    res.json({ success: true, email: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Nuevo Endpoint de Chat (Mobile First / Demo) ---
app.post('/api/chat/generate', async (req, res) => {
  const { message } = req.body;
  console.log(`\n[CHAT] Usuario: "${message}"`);

  try {
    const aiResult = await generateChatResponse(message);
    
    console.log(`[CHAT] ClickMail Copilot responde:`);
    console.log(`--- EXPLICACIÓN ---\n${aiResult.text}\n-------------------`);
    if (aiResult.html) {
      console.log(`[CHAT] HTML generado (${aiResult.html.length} caracteres)`);
    }

    res.json({ 
      response: aiResult.text, // La explicación del "profesor"
      email: aiResult.html,    // El código (si lo hubo)
      data: {
        originalPrompt: message
      }
    });
  } catch (error) {
    console.error('[CHAT ERROR]', error);
    res.status(500).json({ message: "Error al procesar tu solicitud." });
  }
});

// Endpoint de estadísticas
app.get('/api/stats', (req, res) => {
  // Mock stats
  res.json({
    totalCampaigns: db.campaigns.length,
    sentEmails: db.campaigns.reduce((acc, c) => acc + (c.stats?.totalSent || 0), 0),
    openRate: 25.4,
    clickRate: 12.1
  });
});

app.listen(PORT, () => {
  console.log(`ClickMail AI Backend corriendo en http://localhost:${PORT}`);
  console.log('Modo: In-Memory (No requiere MongoDB)');
});
