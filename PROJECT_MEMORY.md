# 🧠 MEMORIA INTEGRAL DEL PROYECTO DE INVESTIGACIONES E INNOVACIONES (CTO)

**Institución:** Corporación Tecnológica del Oriente (CTO)  
**Unidad Responsable:** Coordinación de Investigaciones  
**Sistema:** Portal Institucional de Captura de Información Científica, Experiencias Significativas e Innovaciones Educativas (SIAC / I+D+i)  
**Fecha de Última Actualización:** 25 de Agosto de 2026  
**Autor / Desarrollador:** Pedro Noriega (`pedronoriega-eng`) & Antigravity AI  

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
- **Conexión Automática:** Pre-configurada por defecto en `index.html`. Cualquier usuario que ingrese queda automáticamente conectado (`Supabase Conectado ✅`).

---

## 🛡️ 3. Arquitectura de Seguridad (Row Level Security - RLS)

Se ejecutó el blindaje en Supabase PostgreSQL para asegurar las tablas:
- **`public.experiencias_significativas`**
- **`public.innovaciones_educativas`**

**Políticas RLS Aplicadas:**
- `INSERT`: Permitido públicamente (cualquier docente/autor puede radicar).
- `SELECT`: Permitido públicamente (para consulta del repositorio público y generación de recibos).
- `UPDATE` / `DELETE`: Denegado públicamente (protege contra alteración o borrado malicioso de registros ajenos).

---

## 🏷️ 4. Nomenclatura Institucional de Radicados

El sistema genera códigos de radicado institucionales únicos con la siguiente estructura:
- **Experiencias Significativas:** `EXP-[CÓDIGO_PROG]-[AÑO_SEMESTRE]-[CONSECUTIVO]` (Ej: `EXP-ADM-20261-001`).
- **Innovaciones Educativas:** `INN-[CÓDIGO_PROG]-[AÑO_SEMESTRE]-[CONSECUTIVO]` (Ej: `INN-SOF-20261-002`).

**Códigos de Programa Estandarizados:**
- `ADM`: Administración de Empresas (Presencial / Virtual)
- `DER`: Derecho Virtual
- `SOF`: Ingeniería en Desarrollo de Software
- `IND`: Ingeniería Industrial Virtual
- `EDU`: Licenciatura en Educación Infantil
- `SST`: Seguridad y Salud en el Trabajo / Higiene
- `PRO`: Especialización en Gerencia de Proyectos
- `DAT`: Especialización en Inteligencia de Negocios y Analítica de Datos
- `PED`: Especialización en Pedagogía y Didácticas Específicas
- `INV` / `CTO`: Coordinación de Investigaciones / Departamento Transversal

---

## 📄 5. Exportación e Informes Oficiales

### A. Documento PDF Oficial Vectorial (`pdfMake`)
- **Tamaño de Hoja:** Carta (Letter).
- **Inmodificable:** Generación vectorial limpia en PDF para descarga oficial desde la Ficha Técnica del Repositorio.
- **Formato APA 7.ª Edición:** Todas las citas y listados bibliográficos aplican estrictamente **Normas APA 7.ª Edición**.
- **Regla de Omisión de Referencias Vacías:** Si el usuario no ingresó referencias bibliográficas, el título `Referencias Bibliográficas (Sistema APA 7.ª Edición)` y el mensaje `Sin referencias...` se **omiten completamente** del PDF.

### B. Documento Microsoft Word (.docx)
- Generación de archivo `.docx` estructurado con la plantilla institucional nativa.
- Incluye encabezados, pies de página, tablas organizativas y resumen de evidencias cargadas.

---

## 📎 6. Carga de Evidencias y Soporte (Cámara de Comercio, RUT, Anexos)

- **Módulos de Carga:** Zonas de carga independientes para Cámara de Comercio, RUT y Anexos Complementarios.
- **Límite de Tamaño:** Máximo **5 MB por archivo**.
- **Almacenamiento en Supabase:** Se codifican en Base64 y se persisten en la columna JSONB `evidencias_adjuntas`.
- **Acceso:** Descargables directamente desde la ventana emergente Ficha Técnica del Repositorio y referenciados en los documentos exportados.

---

## 🏛️ 7. Repositorio Público y Modales Independientes

- **Diseño Principal:** Tarjetas Categorizadas Institucionales (`Experiencias Significativas` e `Innovación en Procesos`) con contadores de radicados en tiempo real.
- **Ventanas Emergentes (Modales):** 
  - `#modal-repo-exp`: Muestra en una ventana emergente dedicada el listado y fichas técnicas de Experiencias Significativas.
  - `#modal-repo-inn`: Muestra en una ventana emergente dedicada el listado y fichas técnicas de Innovaciones Educativas.

---

## ⚙️ 8. Estructura HTML y Filtros Evaluadores de Calidad (≥ 80%)

- **Aislamiento DOM por Pestaña:**
  - `<div id="tab-content-experiencias">` (Pestaña 1) y `<div id="tab-content-innovaciones">` (Pestaña 2) son hermanos independientes bajo `<main>`.
  - `#exp-quality-panel` pertenece únicamente a Formulario 1.
  - `#inn-quality-panel` pertenece únicamente a Formulario 2.
- **Filtro de Calidad en Tiempo Real:** Evalúa automáticamente el cumplimiento del 80% mínimo para habilitar el botón de radicación en Supabase (`#exp-submit-btn` y `#inn-submit-btn`).

---

## 📜 9. Script SQL de Migración (`schema.sql`)

```sql
-- TABLA EXPERIENCIAS SIGNIFICATIVAS
CREATE TABLE IF NOT EXISTS public.experiencias_significativas (
  id UUID PRIMARY KEY DEFAULT gen_random_state(),
  radicado TEXT UNIQUE NOT NULL,
  programa_academico TEXT NOT NULL,
  docente_nombre TEXT NOT NULL,
  docente_cedula TEXT NOT NULL,
  docente_correo TEXT NOT NULL,
  titulo_experiencia TEXT NOT NULL,
  asociacion_asc TEXT[] NOT NULL,
  asc_otro_especifique TEXT,
  contexto_donde TEXT NOT NULL,
  contexto_cuando TEXT NOT NULL,
  contexto_quienes TEXT NOT NULL,
  contexto_modalidad TEXT NOT NULL,
  metodologia_pasos TEXT NOT NULL,
  metodologia_recursos TEXT NOT NULL,
  resultados_logros TEXT NOT NULL,
  resultados_evaluacion TEXT NOT NULL,
  proyeccion_mejora TEXT NOT NULL,
  proyeccion_replicabilidad TEXT NOT NULL,
  observaciones TEXT,
  referencias_apa TEXT,
  evidencias_adjuntas JSONB DEFAULT '[]'::jsonb,
  puntaje_calidad INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA INNOVACIONES EDUCATIVAS
CREATE TABLE IF NOT EXISTS public.innovaciones_educativas (
  id UUID PRIMARY KEY DEFAULT gen_random_state(),
  radicado TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  tipo_innovacion TEXT NOT NULL,
  fecha_creacion DATE NOT NULL,
  empresa TEXT NOT NULL,
  sector TEXT NOT NULL,
  nit TEXT,
  proyecto_titulo TEXT,
  convocatoria TEXT,
  origen_ctei TEXT NOT NULL,
  nombre_estrategia TEXT NOT NULL,
  linea_investigacion TEXT NOT NULL,
  autor_nombre TEXT NOT NULL,
  autor_cedula TEXT NOT NULL,
  autor_correo TEXT NOT NULL,
  autor_afiliacion TEXT NOT NULL,
  coautores_json JSONB DEFAULT '[]'::jsonb,
  resumen TEXT NOT NULL,
  novedad_opcion TEXT NOT NULL,
  novedad_explicacion TEXT NOT NULL,
  impactos TEXT[] NOT NULL,
  impactos_otros_explicacion TEXT,
  impactos_explicacion TEXT NOT NULL,
  referencias_apa TEXT NOT NULL,
  evidencias_adjuntas JSONB DEFAULT '[]'::jsonb,
  puntaje_calidad INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 10. Instrucciones para Continuar en Futuras Sesiones

Al abrir una nueva sesión con el agente de IA, simplemente refiérete a este archivo `PROJECT_MEMORY.md`. El agente comprenderá de inmediato toda la arquitectura, esquemas de Supabase, reglas institucionales y estado perfecto del código para continuar ampliando el proyecto sin reprocesos.
