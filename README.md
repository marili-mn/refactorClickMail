<div align="center">

# 📧 ClickMail AI: The Marketing Tutor
### *Crafting high-converting emails, powered by Intelligence*

<p align="center">
  <img src="./public/logo1.svg" alt="ClickMail Logo" width="180" />
</p>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Groq](https://img.shields.io/badge/AI-Groq_(Llama_3)-f55036?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**🌐 Live Platform**](https://tutormarketing.vercel.app/) • [**🤖 Interactive AI Demo**](https://refactorclickmail.onrender.com/demo)

---

### 🚀 ¿Qué es ClickMail AI?
**ClickMail** no es solo una herramienta de email marketing; es un **Mentor de Negocios**. 
Utilizamos IA de vanguardia para que dejes de "adivinar" y empieces a "vender". 

*Describe tu producto → Recibe estrategia + Código HTML listo para usar.*

</div>

---

## 🧠 El Concepto "Profesor Mode"
A diferencia de otros generadores, nuestra IA funciona en **Modo Tutor**. 
Cuando le pides una campaña, el sistema:
1.  **Analiza** tu solicitud.
2.  **Explica** la psicología de marketing detrás de la propuesta.
3.  **Genera** el código HTML optimizado para dispositivos móviles.

---

## 🏗️ Arquitectura de Producción
Diseñado con una arquitectura de **microservicios desacoplados** para garantizar velocidad y seguridad total.

*   **Frontend (Vercel):** Una experiencia SPA ultra-fluida construida con **React 18** y **TypeScript**.
*   **Backend (Render):** El "cerebro" en **Node.js** que protege las API Keys y orquesta las llamadas a Groq Cloud.
*   **IA Engine:** Integración con **Groq (Llama 3.3)** con latencia casi nula.

```mermaid
graph TD
    A[User Interface] -->|Requests| B[React SPA]
    B -->|API Calls| C[Express Backend]
    C -->|Secure Prompting| D[Groq Llama 3.3]
    D -->|AI Response| C
    C -->|Structured Data| B
```

---

## 🔮 Roadmap: Visión de Arquitectura Híbrida & Escalabilidad

Este MVP está diseñado para evolucionar hacia un ecosistema empresarial robusto, permitiendo la integración con stacks tradicionales y tecnologías emergentes.

### 1. Integración con Ecosistemas PHP / Laravel
Para empresas con infraestructura existente en PHP (e.g. Plataformas EdTech, CRMs):
*   **Estrategia "Bridge":** Mantener el núcleo de negocio (Usuarios, Pagos, Lógica Legacy) en **Laravel/PHP** por su robustez.
*   **Microservicio de IA:** Utilizar **Node.js** exclusivamente como un microservicio satélite para la orquestación de IA, aprovechando su manejo nativo de streaming y JSON.
*   **Comunicación:** Interconexión mediante API REST interna o colas de mensajes (Redis), modernizando la plataforma sin reescribir el monolito.

### 2. Capa de Datos Persistente
Evolución del almacenamiento "In-Memory" actual hacia bases de datos de producción:
*   **Relacional (MySQL/PostgreSQL):** Ideal para integrarse con Eloquent ORM de Laravel para datos transaccionales.
*   **NoSQL (MongoDB):** Para almacenar el historial conversacional y contextos de IA no estructurados.
*   **Vectorial (Pinecone):** Implementación de RAG (Retrieval-Augmented Generation) para que el "Tutor" tenga memoria a largo plazo de los documentos de la empresa.

### 3. Agentes Autónomos (LangChain.js)
Para reducir alucinaciones y mejorar la precisión en tareas complejas (como educación o finanzas):
*   **Sistema Multi-Agente:** Implementación de flujos de trabajo con **LangChain.js**.
*   **Lógica de Validación:** Un agente "Generador" crea la respuesta y un agente "Supervisor" la valida contra reglas estrictas antes de enviarla al usuario.
*   **Automatización:** Similar a flujos visuales en n8n, pero ejecutados programáticamente dentro de la infraestructura segura de la empresa.

---

## ✨ Lo que hace a este proyecto especial

*   **⚡ Velocidad Absurda:** Gracias a Groq, las respuestas de la IA son instantáneas.
*   **🛡️ Seguridad Senior:** API Keys manejadas en el lado del servidor mediante variables de entorno. Nunca se exponen al cliente.
*   **📱 Agente Mobile-First:** Una demo interactiva optimizada para ser probada desde cualquier lugar.
*   **🎨 Diseño Moderno:** Interfaz pulida con **Tailwind CSS** y animaciones suaves con **Framer Motion**.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript |
| **Styles** | Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, JWT |
| **Intelligence** | Groq AI, OpenAI SDK |
| **Infrastructure** | Vercel (Front) + Render (Back) |

---

## 🚀 ¡Pruébalo en tu local!

Hemos orquestado todo para que arranque con **un solo comando**.

### 1️⃣ Clonar y Preparar
```bash
git clone https://github.com/marili-mn/refactorClickMail.git
cd refactorClickMail
npm install
cd backend-ai && npm install && cd ..
```

### 2️⃣ Configurar (The Secret Sauce)
Crea un archivo `.env` dentro de la carpeta `backend-ai/`:
```ini
OPENAI_API_KEY=gsk_tua_api_key_aqui
OPENAI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```

### 3️⃣ ¡Fuego!
```bash
npm run start-all
```
*Visita: `http://localhost:5173` para el negocio o `http://localhost:3000/demo` para el tutor.*

---

<div align="center">

### 🤝 ¿Quieres hablar del proyecto?
Este MVP fue desarrollado para demostrar la potencia de los LLMs aplicados a productos reales.

**[GitHub Project](https://github.com/joseorteha/ClickMail)** • **[Issues](https://github.com/joseorteha/ClickMail/issues)**

*Hecho con ❤️ por Nahuel y la IA*

</div>