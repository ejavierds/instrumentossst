# Plataforma Web para la Recolección, Procesamiento y Validación de Instrumentos de Investigación en SST (HCUAMP 2026)

**Trabajo de Grado de Maestría en Gerencia de la Salud Pública**  
**Universidad Nacional Experimental de los Llanos Centrales «Rómulo Gallegos» (UNERG)**  
**Área de Postgrado • Sede Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)**  
**Investigadora Principal:** Lcda. María Pargas | **Año:** 2026  

---

## 📋 Descripción del Proyecto

Aplicación web progresiva orientada a la recolección estandarizada, validación metodológica y análisis cuantitativo en tiempo real de los instrumentos de investigación académica aplicados al personal administrativo y de supervisión del **Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)** en Barquisimeto, Estado Lara.

El estudio se titula:
> **«Estrategia de Formación en Seguridad y Salud Laboral para Gerentes y Supervisores del HCUAMP, Barquisimeto 2026»**  
> **Autora e Investigadora:** Lcda. María Pargas

Su objetivo central es diagnosticar el nivel de conocimiento técnico-legal y las necesidades de formación en seguridad y salud en el trabajo sobre la base de los cuatro elementos de gestión de la **LOPCYMAT**:
1. **Dimensión A:** Delegados de Prevención
2. **Dimensión B:** Comité de Seguridad y Salud Laboral (CSSL)
3. **Dimensión C:** Servicio de Seguridad y Salud en el Trabajo (SSST)
4. **Dimensión D:** Programa de Seguridad y Salud en el Trabajo (PSST)

---

## 🔒 Control de Acceso y Seguridad

- **Módulo 1 (Encuesta al Personal):** Acceso público abierto para los gerentes y supervisores del hospital, precedido por la aceptación obligatoria del Consentimiento Informado.
- **Módulo 2 (Juicio de Expertos):** Interfaz para especialistas metodológicos y médicos ocupacionales con emisión de dictamen y declaración jurada.
- **Módulo 3 (Dashboard Estadístico):** Acceso protegido mediante credencial de seguridad.  
  👉 **Contraseña de Acceso:** `Salud_2026`  
  *(Permite visualizar los indicadores analíticos consolidados en tiempo real).*

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5 semántico, CSS3 con estética *Glassmorphism* (efectos translúcidos `backdrop-blur`, gradientes suaves de salud pública, bordes sutiles y baja carga cognitiva), Tailwind CSS (vía CDN), Vanilla JavaScript ES6+.
- **Backend API:** Servicio REST configurado para procesar peticiones HTTP `doPost` y `doGet` con control de cabeceras CORS.
- **Base de Datos:** Repositorio en la nube con tablas normalizadas (`Respuestas_Encuesta`, `Validacion_Expertos`, `Detalle_Items_Expertos`). ID del documento oficial: `1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc`.
- **Motor de Analítica y Gráficos:** Chart.js para renderizado dinámico de diagramas de barras, radar, donuts y tarjetas de métricas.
- **Licencia:** Tecnologías Libres y de Acceso Abierto bajo **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

---

## 📂 Estructura del Proyecto

```text
├── index.html          # Interfaz SPA con navegación por pestañas (Encuesta, Expertos, Dashboard protegido, Servidor)
├── styles.css          # Estilos personalizados: Glassmorphism, paleta hospitalaria, animaciones y modo impresión
├── config.js          # Estructuras de datos: banco de reactivos (1-40), baremos y clave de acceso del dashboard
├── encuesta.js        # Módulo 1: Flujo en 5 pasos, validación en cliente, baremos en vivo y envío al servidor
├── expertos.js        # Módulo 2: Matriz interactiva de 40 ítems (Claridad, Pertinencia, Coherencia) y dictamen
├── dashboard.js       # Módulo 3: Gráficos interactivos en tiempo real, KPIs y alternador de simulación
├── Codigo.gs          # Código de la API REST para el backend, estructuración de tablas y agregaciones
├── vercel.json        # Configuración de despliegue optimizado para la plataforma web
├── api/
│   ├── config.js      # Endpoint de lectura de variable de entorno del servidor
│   └── proxy.js       # Proxy seguro para canalización de peticiones HTTP
├── .env.example       # Plantilla de variable de entorno
└── README.md          # Documentación técnica, metodológica y créditos de la investigadora
```

---

## 📐 Metodología y Baremos de Calificación

### 1. Test de Conocimiento sobre Gestión en SST (Parte II - 20 Ítems)
- **Modalidad:** 20 preguntas dicotómicas/opción múltiple sobre legislación venezolana (LOPCYMAT, Reglamentos y Normas Técnicas del INPSASEL).
- **Puntuación:** 1 punto por cada respuesta correcta (0 puntos por error). Rango: 0 a 20 puntos.
- **Baremo de Interpretación:**
  - `0 - 10 puntos:` **Nivel Bajo de Conocimiento** (Demanda prioritaria de inducción legal).
  - `11 - 15 puntos:` **Nivel Medio de Conocimiento** (Conocimiento básico con brechas operativas).
  - `16 - 20 puntos:` **Nivel Alto de Conocimiento** (Dominio técnico y normativo adecuado).

### 2. Escala Likert de Necesidades de Formación en SST (Parte III - 20 Ítems)
- **Modalidad:** Escala Likert de 5 puntos:  
  *1 = Nada necesaria | 2 = Poco necesaria | 3 = Moderadamente necesaria | 4 = Bastante necesaria | 5 = Totalmente necesaria*
- **Cálculo:** Medias aritméticas por dimensión ($ \bar{X} $) y media general global.
- **Baremo de Interpretación:**
  - `1.00 - 2.50:` **Baja necesidad de formación**
  - `2.51 - 3.50:` **Moderada necesidad de formación**
  - `3.51 - 5.00:` **Alta necesidad de formación**

### 3. Matriz de Validación por Juicio de Expertos
- **Criterios Evaluados (40 ítems):**
  1. **Claridad:** Redacción comprensible, precisa y sin ambigüedad.
  2. **Pertinencia:** Relevancia para medir la variable y alcanzar los objetivos.
  3. **Coherencia:** Relación lógica y directa con la dimensión teórica.
- **Dictámenes Posibles:**
  - *Aprobado sin modificaciones*
  - *Aprobado con observaciones*
  - *No Aprobado*

---

## 🌐 Configuración del Repositorio y Despliegue

### 1. Repositorio de Código
El repositorio oficial del proyecto está vinculado a:
```bash
https://github.com/ejavierds/instrumentossst
```

Para sincronizar los cambios locales con la rama principal:
```bash
git add .
git commit -m "feat: actualizacion de seguridad y creditos institucionales"
git push -u origin main
```

### 2. Variables de Entorno en la Plataforma Web
En el panel de configuración de su servicio de alojamiento web, configure las siguientes variables de entorno:
1. **URL del Endpoint del Servicio Central:**
   - **Nombre de la Variable (Key):** `GAS_URL`
   - **Valor (Value):** `https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec`
2. **Contraseña de Seguridad (Dashboard y Configuración):**
   - **Nombre de la Variable (Key):** `DASHBOARD_PASSWORD`
   - **Valor (Value):** `Salud_2026` (o la contraseña personalizada de su preferencia)

Gracias a los endpoints serverless `/api/config` y `/api/auth`, el frontend detecta, sincroniza y valida automáticamente estos parámetros en tiempo de ejecución.

---

## 👩‍⚕️ Créditos de la Investigación

- **Investigadora Principal y Autora:** Lcda. María Pargas
- **Programa Académico:** Maestría en Gerencia de la Salud Pública
- **Institución Patrocinante:** Universidad Nacional Experimental de los Llanos Centrales «Rómulo Gallegos» (UNERG)
- **Sede de Aplicación:** Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP), Barquisimeto, Estado Lara, Venezuela (2026).

---

## 📜 Licencia de Tecnologías Libres

Este proyecto ha sido desarrollado bajo la licencia:  
**Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**

Usted es libre de compartir y adaptar el material para fines académicos y científicos, citando debidamente la autoría de la **Lcda. María Pargas** y manteniendo la misma licencia libre.
