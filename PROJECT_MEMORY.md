# 🧠 MEMORIA INTEGRAL DEL PROYECTO DE INVESTIGACIONES E INNOVACIONES (CTO)

**Institución:** Corporación Tecnológica del Oriente  
**Sistema:** Portal Institucional de Captura de Información Científica, Experiencias Significativas e Innovaciones Educativas (SIAC / I+D+i) - **Fecha de Última Actualización:** 22 de Agosto de 2026  
- **Autor / Desarrollador:** Pedro Noriega (`pedronoriega-eng`) & Antigravity AI  

---

## 🌐 1. Enlaces y Despliegue en Producción

- **Sitio Web Público (GitHub Pages):** [https://pedronoriega-eng.github.io/portal-investigaciones-cto/](https://pedronoriega-eng.github.io/portal-investigaciones-cto/)
- **Repositorio de Código Fuente (GitHub):** [https://github.com/pedronoriega-eng/portal-investigaciones-cto.git](https://github.com/pedronoriega-eng/portal-investigaciones-cto.git)
- **Rama Principal:** `main`

---

## 🗄️ 2. Base de Datos y Persistencia en la Nube (Supabase)

- **Proveedor:** Supabase PostgreSQL
- **Nombre de Proyecto:** `portal-investigacion-cto`
- **ID de Proyecto:** `joumcvebzatdgluvxgkm`
- **SUPABASE URL:** `https://joumcvebzatdgluvxgkm.supabase.co`
- **SUPABASE PUBLISHABLE KEY:** `sb_publishable_rVH67ltDqdWsbZ5hQ1pGrg_bXr9v0ZI`
- **Conexión Automática:** Pre-configurada por defecto en `index.html`. Cualquier usuario que ingrese desde cualquier dispositivo o ubicación del mundo queda automáticamente conectado (`Supabase Conectado ✅`).

---

## 🛡️ 3. Arquitectura de Seguridad (Row Level Security - RLS)

Se ejecutó el blindaje en Supabase PostgreSQL para asegurar las tablas:
- **`public.experiencias_significativas`**
- **`public.innovaciones_educativas`**

**Políticas RLS Aplicadas:**
- `INSERT`: Permitido públicamente (cualquier docente puede radicar).
- `SELECT`: Permitido públicamente (para consulta y generación de recibos).
- `UPDATE` / `DELETE`: Denegado públicamente (protege contra alteración o borrado malicioso de datos ajenos).

---

## 📋 4. Oferta Académica Estandarizada (Menú Desplegable)

Para garantizar trazabilidad 100% homogénea sin errores tipográficos, los formularios usan el listado oficial de la Tecnológica del Oriente:

### Pregrados Presenciales y Virtuales:
1. Administración de Empresas
2. Administración de Empresas Virtual
3. Derecho Virtual
4. Ingeniería en Desarrollo de Software
5. Ingeniería Industrial Virtual
6. Licenciatura en Educación Infantil
7. Seguridad y Salud en el Trabajo
8. Seguridad y Salud en el Trabajo Virtual
9. Técnica Profesional en Higiene y Seguridad en el Trabajo

### Posgrados / Especializaciones:
1. Especialización en Gerencia de Proyectos
2. Especialización en Gerencia de Proyectos Virtual
3. Especialización en Gerencia Integral de Riesgo, Seguridad y Salud en el Trabajo
4. Especialización en Gestión de la SST
5. Especialización en Innovación Educativa en Entornos Virtuales de Aprendizaje
6. Especialización en Inteligencia de Negocios y Analítica de Datos
7. Especialización en Pedagogía y Didácticas Específicas

### Otras Áreas Transversales:
1. Dirección de Investigaciones / Dpto Transversal
2. Otro Programa Académico

---

## 📁 5. Estructura del Código y Funcionalidades Clave

### A. `index.html` (Aplicación SPA Completa)
- **Diseño Institucional:** Colores oficial CTO Naranja (`#e67817`), Azul Marino (`#1e293b`), Fuentes Google `Inter` y `Plus Jakarta Sans`. Logo original de la Tecnológica del Oriente.
- **Formulario 1 (Anexo 1 - Experiencias Significativas):** Captura de 18 campos institucionales + selección múltiple ASC + radicado `EXP-2026-XXXX`.
- **Formulario 2 (Guía Orientadora - Innovaciones Educativas):** Captura de 24 campos institucionales + dinámico de coautores + radicado `INN-2026-XXXX`.
- **Autoguardado en LocalStorage:** Cada 15 segundos guarda el borrador (`teo_portal_investigacion_draft`) para evitar pérdida de datos si se cierra la pestaña.
- **Limpieza Automática tras Radicación:** Al radicar exitosamente en Supabase y generar el recibo/descarga, el formulario y su borrador en `localStorage` se limpian automáticamente (quedando al 0%) para permitir el siguiente diligenciamiento inmediato.
- **Exportación Nativa a Microsoft Word (.docx) con Encabezado y Pie Institucional Nativo en Secciones Word:** Extraído directamente de la plantilla oficial `Formato investigación.docx`:
  - **Sección Nativa de Encabezado de Word (`mso-element: header` / `h1`):** Banner superior asignado estrictamente al marco de cabecera de la hoja.
  - **Sección Nativa de Pie de Página de Word (`mso-element: footer` / `f1`):** Banner inferior asignado estrictamente al marco de pie de la hoja.
  - **Formato Visual Impreso y Word:** El cuerpo inicia directamente con el título en mayúsculas, barra horizontal naranja institucional continua (`border-bottom: 3.5pt solid #e67817`), subtítulo de `Radicado No` centrado y sin imágenes sueltas pegadas en el cuerpo.
- **Nuevos Campos Requeridos:**
  - **Opción `q) Otros. (¿cuáles?):` en Impactos Evidenciados:** Casilla de verificación con campo de texto descriptivo dinámico `inn_impactos_otros`.
  - **Referencias Bibliográficas (Sistema APA 6ª Edición):** Módulo para ingresar y exportar las referencias en norma APA 6ª edición (`inn_referencias` y `exp_referencias`).

### B. `schema.sql` (Script de Migración SQL)
- Definición de tablas `experiencias_significativas` y `innovaciones_educativas`.
- Claves primarias UUID, tipos de datos array `TEXT[]`, JSONB para coautores `coautores_json`.
- Nuevas columnas `impactos_otros_explicacion TEXT` y `referencias_apa TEXT`.
- Índices de rendimiento por `radicado` y `cedula`.
- Sentencias RLS para activar seguridad en Supabase.

---

## 🚀 6. Instrucciones para Continuar en Futuras Sesiones

Al abrir una nueva sesión con el agente, solo debes compartir este archivo `PROJECT_MEMORY.md` o hacer referencia a él. El agente comprenderá de inmediato toda la arquitectura, las credenciales, los repositorios y el diseño del proyecto.
