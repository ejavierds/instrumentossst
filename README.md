# Plataforma Web para la Recolección, Procesamiento y Validación de Instrumentos de Investigación en SST (HCUAMP 2026)

**Trabajo de Grado de Maestría en Gerencia de la Salud Pública**  
**Universidad Nacional Experimental de los Llanos Centrales «Rómulo Gallegos» (UNERG)**  
**Área de Postgrado • Sede Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)**  
**Autora:** Lcda. María Pargas | **Año:** 2026  

---

## 📋 Descripción del Proyecto

Aplicación web progresiva orientada a la recolección estandarizada, validación metodológica y análisis cuantitativo en tiempo real de los instrumentos de investigación académica aplicados al personal administrativo y de supervisión del **Hospital Central Universitario Dr. Antonio María Pineda (HCUAMP)** en Barquisimeto, Estado Lara.

El estudio se titula:
> **«Estrategia de Formación en Seguridad y Salud Laboral para Gerentes y Supervisores del HCUAMP, Barquisimeto 2026»**

Su objetivo central es diagnosticar el nivel de conocimiento técnico-legal y las necesidades de formación en seguridad y salud en el trabajo sobre la base de los cuatro elementos de gestión de la **LOPCYMAT**:
1. **Dimensión A:** Delegados de Prevención
2. **Dimensión B:** Comité de Seguridad y Salud Laboral (CSSL)
3. **Dimensión C:** Servicio de Seguridad y Salud en el Trabajo (SSST)
4. **Dimensión D:** Programa de Seguridad y Salud en el Trabajo (PSST)

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5 semántico, CSS3 con estética *Glassmorphism* (efectos translúcidos `backdrop-blur`, gradientes suaves de salud pública, bordes sutiles y baja carga cognitiva), Tailwind CSS (vía CDN), Vanilla JavaScript ES6+.
- **Backend API:** Google Apps Script (GAS) configurado como Web App con soporte completo para peticiones HTTP `doPost` y `doGet` y control de cabeceras CORS.
- **Base de Datos Cloud:** Google Sheets. ID de documento oficial: `1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc`.
- **Motor de Analítica y Gráficos:** Chart.js para renderizado dinámico de diagramas de barras, radar, donuts y tarjetas métricas.
- **Despliegue Continuo (CI/CD):** Preparado con `vercel.json` para despliegue automático en **Vercel** desde repositorio en **GitHub**.
- **Licencia:** Tecnologías Libres y de Acceso Abierto bajo **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

---

## 📂 Estructura del Proyecto

```text
├── index.html          # Interfaz SPA con navegación por pestañas (Encuesta, Expertos, Dashboard, Ajustes)
├── styles.css          # Estilos personalizados: Glassmorphism, paleta hospitalaria, animaciones y modo impresión
├── config.js          # Estructuras de datos: banco de preguntas (1-20), escala Likert (21-40), matriz de expertos y baremos
├── encuesta.js        # Módulo 1: Stepper 5 pasos, validación en cliente, baremos en vivo y envío a Sheets
├── expertos.js        # Módulo 2: Matriz interactiva de 40 ítems (Claridad, Pertinencia, Coherencia) y dictamen oficial
├── dashboard.js       # Módulo 3: Gráficos Chart.js en tiempo real, KPIs, selector En Vivo / Simulación
├── Codigo.gs          # Código completo para Google Apps Script (REST API, setup de hojas y cálculo de agregaciones)
├── vercel.json        # Configuración de despliegue optimizado para la plataforma Vercel
└── README.md          # Documentación técnica, metodológica y manual de instalación
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

## 🚀 Guía de Despliegue del Backend en Google Apps Script

1. Abra la hoja de cálculo de Google Sheets de la investigación:  
   👉 [Enlace a la Hoja de Google Sheets](https://docs.google.com/spreadsheets/d/1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc/edit)
2. En la barra superior, seleccione **Extensiones → Apps Script**.
3. Reemplace todo el contenido del editor con el código de [`Codigo.gs`](Codigo.gs).
4. Verifique que la variable `SPREADSHEET_ID` contenga el ID del documento:
   ```javascript
   const SPREADSHEET_ID = "1Xyy-vs2PJMxunvcCCMACMet9MMNsxq3fG2BkSk5AxDc";
   ```
5. En la barra de herramientas del editor, seleccione la función `setupSheets` y haga clic en **Ejecutar**. Esto creará automáticamente las pestañas estructuradas con sus colores y encabezados institucionales:
   - `Respuestas_Encuesta`
   - `Validacion_Expertos`
   - `Detalle_Items_Expertos`
6. Haga clic en el botón azul superior **Implementar (Deploy) → Nueva implementación**.
7. En el tipo de implementación (engranaje), elija **Aplicación web**.
8. Configure los parámetros exactamente así:
   - **Descripción:** `API REST SST HCUAMP v1`
   - **Ejecutar como:** `Yo (tu correo de Google)`
   - **Quién tiene acceso:** `Cualquiera (Anyone)` *(Importante: permite que el formulario web de Vercel envíe las respuestas)*.
9. Haga clic en **Implementar** y autorice los permisos solicitados.
10. Copie la **URL de la aplicación web** (con terminación `/exec`).
11. Abra la aplicación web frontend, vaya a la pestaña **⚙️ Conexión Sheets**, pegue la URL y presione **Guardar Configuración** y **Probar Conexión (Ping)**.

---

## 🌐 Guía de Despliegue en GitHub y Vercel

### Paso 1: Subir el proyecto al repositorio de GitHub
El repositorio oficial del proyecto es [https://github.com/ejavierds/instrumentossst](https://github.com/ejavierds/instrumentossst).
Para subir o sincronizar los cambios:
```bash
git add .
git commit -m "feat: integracion variable de entorno vercel y endpoint gas"
git branch -M main
git push -u origin main
```

### Paso 2: Importar y desplegar en Vercel
1. Inicie sesión en [Vercel](https://vercel.com).
2. Haga clic en **Add New... → Project**.
3. Seleccione el repositorio de GitHub `ejavierds/instrumentossst`.
4. En la configuración del proyecto:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
5. **Configurar la Variable de Entorno (Environment Variables):**
   - En la sección **Environment Variables**, agregue la siguiente clave y valor:
     - **Key:** `GAS_URL`
     - **Value:** `https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec`
     - **Target:** Seleccione *Production*, *Preview* y *Development*.
   - Haga clic en **Add**.
6. Haga clic en **Deploy**.
7. La aplicación estará en línea inmediatamente. Gracias a la función serverless `/api/config`, el frontend leerá automáticamente la variable de entorno `GAS_URL` desde Vercel sin necesidad de configuraciones manuales adicionales.

---

## 📜 Licencia de Tecnologías Libres

Este proyecto ha sido desarrollado bajo la licencia:  
**Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**

Usted es libre de:
- **Compartir:** copiar y redistribuir el material en cualquier medio o formato.
- **Adaptar:** remezclar, transformar y crear a partir del material con fines académicos y de investigación en salud pública.
- *Bajo los términos de atribución a la autora Lcda. María Pargas, sin fines comerciales y manteniendo la misma licencia libre.*
