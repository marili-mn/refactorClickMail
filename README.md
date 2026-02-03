<div align="center">
  <img src="./public/logo1.svg" alt="ClickMail Logo" width="200" />
  
  # ClickMail 📧
  
  ### *El Futuro del Email Marketing con Inteligencia Artificial*

  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Groq AI](https://img.shields.io/badge/Powered_by-Groq_AI-f55036?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  [🚀 **Demo Interactiva**](http://localhost:3000/demo) • [📖 **Documentación**](#-tabla-de-contenidos) • [🐛 **Reportar Bug**](https://github.com/joseorteha/ClickMail/issues)

  ---

  **ClickMail** es una plataforma SaaS híbrida que democratiza el email marketing profesional. Gracias a su potente integración con **Groq AI (Llama 3)**, permite generar campañas persuasivas, segmentar audiencias y optimizar el copy en segundos.

  *Diseñado para desarrolladores, marketers y emprendedores que buscan velocidad y calidad.*

</div>

## 📑 Tabla de Contenidos

- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura Híbrida](#️-arquitectura-híbrida)
- [🚀 Inicio Rápido (Local)](#-inicio-rápido-local)
- [🔧 Configuración de Entorno](#-configuración-de-entorno)
- [🌐 Guía de Despliegue](#-guía-de-despliegue)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

## ✨ Características Principales

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <h3>🤖 IA Ultra-Rápida</h3>
        <p>Integración con <strong>Groq Cloud</strong> para generación de contenido en tiempo real (Llama 3.3). Sin esperas.</p>
      </td>
      <td align="center" width="33%">
        <h3>⚡ Arquitectura Moderna</h3>
        <p>Frontend SPA en React desacoplado del Backend API en Node.js para máxima escalabilidad.</p>
      </td>
      <td align="center" width="33%">
        <h3>🎨 UX Profesional</h3>
        <p>Interfaz limpia con Tailwind CSS, modo oscuro y diseño responsivo "Mobile First".</p>
      </td>
    </tr>
  </table>
</div>

### 🎯 Funcionalidades Clave

- **Generador de Campañas IA**: Describe tu producto y recibe un email HTML listo para enviar.
- **Asistente Virtual ("Profesor")**: Chat interactivo que te enseña estrategias de marketing mientras trabaja.
- **Editor Visual**: Personaliza las plantillas generadas al instante.
- **Gestión de Audiencias**: Segmentación inteligente sugerida por IA.
- **Seguridad**: Manejo de credenciales mediante variables de entorno (API Keys protegidas).

## 🏗️ Arquitectura Híbrida

ClickMail utiliza un enfoque desacoplado para garantizar rendimiento y mantenibilidad:

1.  **Frontend (Puerto 5173):** Aplicación React + Vite + TypeScript. Maneja la UI, el estado del usuario y la navegación.
2.  **Backend AI (Puerto 3000):** Servidor Node.js + Express. Actúa como orquestador seguro entre el cliente y la API de Groq, protegiendo las credenciales y procesando la lógica de negocio.

```mermaid
graph LR
A[Cliente React] -- HTTP/JSON --> B[Node.js Backend]
B -- Secure API Call --> C[Groq Cloud (Llama 3)]
C -- Generated Content --> B
B -- JSON Response --> A
```

## 🚀 Inicio Rápido (Local)

Hemos simplificado el arranque con un solo comando.

### Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** o **yarn**
- Una **API Key de Groq** (Gratuita en [console.groq.com](https://console.groq.com))

### Pasos

1.  **Clona el repositorio**
    ```bash
    git clone https://github.com/joseorteha/ClickMail.git
    cd ClickMail/refactorClickMail
    ```

2.  **Instala las dependencias**
    ```bash
    npm install
    # Asegura también las del backend
    cd backend-ai && npm install && cd ..
    ```

3.  **Configura tus variables**
    Crea un archivo `.env` en `backend-ai/` basado en el ejemplo:
    ```bash
    cp backend-ai/.env.example backend-ai/.env
    ```
    *Edita `backend-ai/.env` y pega tu `OPENAI_API_KEY` de Groq.*

4.  **¡Arranca la orquesta!** 🎻
    ```bash
    npm run start-all
    ```
    Esto iniciará tanto el Frontend como el Backend en paralelo.
    - Frontend: `http://localhost:5173`
    - Backend/Demo: `http://localhost:3000`

## 🔧 Configuración de Entorno

### Backend (`backend-ai/.env`)

| Variable | Descripción | Valor Recomendado |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `OPENAI_API_KEY` | Tu clave de Groq | `gsk_...` |
| `OPENAI_BASE_URL` | Endpoint de Groq | `https://api.groq.com/openai/v1` |
| `AI_MODEL` | Modelo de IA | `llama-3.3-70b-versatile` |

### Frontend (`.env`)

| Variable | Descripción | Valor |
|----------|-------------|-------|
| `VITE_API_URL` | URL del Backend | `http://localhost:3000` (Local) o URL de Render (Prod) |

## 🌐 Guía de Despliegue

Para un entorno de producción profesional ("The Senior Way"), recomendamos:

1.  **Frontend en Vercel/Netlify:**
    - Conecta tu repositorio.
    - Configura el `Root Directory` en `refactorClickMail`.
    - Variable de entorno: `VITE_API_URL` -> URL de tu backend.

2.  **Backend en Render/Railway:**
    - Crea un Web Service.
    - `Root Directory`: `refactorClickMail/backend-ai`.
    - Comando Build: `npm install`.
    - Comando Start: `node server.js`.
    - **Variables de Entorno:** Aquí es donde pegas tu `OPENAI_API_KEY` de forma segura.

## 🛠️ Stack Tecnológico

- **Core:** React 18, TypeScript, Node.js
- **Estilos:** Tailwind CSS
- **Build:** Vite
- **IA:** Groq SDK (Compatible con OpenAI)
- **Seguridad:** JWT, Helmet, CORS

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, abre un issue primero para discutir lo que te gustaría cambiar.

1.  Fork el proyecto
2.  Crea tu rama (`git checkout -b feature/AmazingFeature`)
3.  Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4.  Push a la rama (`git push origin feature/AmazingFeature`)
5.  Abre un Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

<div align="center">

**¿Te gusta ClickMail?** ⭐ ¡Dale una estrella en GitHub!

*Hecho con ❤️ e IA por el equipo de ClickMail*

</div>