# 🧠 MEMORIA INTEGRAL DEL PROYECTO DE INVESTIGACIONES E INNOVACIONES (CTO)

**Institución:** Corporación Tecnológica del Oriente (CTO)  
**Unidad Responsable:** Coordinación de Investigaciones  
**Sistema:** Portal Institucional de Captura de Información Científica, Experiencias Significativas e Innovaciones Educativas (SIAC / I+D+i)  
**Fecha de Última Actualización:** 24 de Septiembre de 2026  
**Autor / Desarrollador:** Pedro Noriega (`pedronoriega-eng`) & Antigravity AI  

---

## 🌐 1. Enlaces y Despliegue en Producción

- **Sitio Web Público (GitHub Pages):** [https://pedronoriega-eng.github.io/portal-investigaciones-cto/](https://pedronoriega-eng.github.io/portal-investigaciones-cto/)
- **Repositorio de Código Fuente (GitHub):** [https://github.com/pedronoriega-eng/portal-investigaciones-cto.git](https://github.com/pedronoriega-eng/portal-investigaciones-cto.git)
- **Rama Principal:** `main`

---

## 🗄️ 2. Base de Datos y Persistencia en la Nube (Supabase)

- **Proveedor:** Supabase PostgreSQL & Auth
- **Nombre de Proyecto:** `portal-investigacion-cto`
- **ID de Proyecto:** `joumcvebzatdgluvxgkm`
- **SUPABASE URL:** `https://joumcvebzatdgluvxgkm.supabase.co`
- **SUPABASE PUBLISHABLE KEY:** `sb_publishable_rVH67ltDqdWsbZ5hQ1pGrg_bXr9v0ZI`
- **Conexión Automática:** Pre-configurada por defecto en `index.html`. Cualquier usuario que ingrese queda automáticamente conectado (`Supabase Conectado ✅`).

---

## 💾 3. Trazabilidad, Guardado Temporal de Borradores y Repositorio Final

1. **Guardado Manual y Automático (Borradores Temporales):**
   - Botón visible **"💾 Guardar Borrador Temporal"** en ambos formularios (Experiencias Significativas e Innovaciones Educativas).
   - Auto-guardado periódico cada 15 segundos en `localStorage` del navegador y en la base de datos Supabase con la propiedad `estado = 'borrador'`.
   - Permite al docente/investigador cerrar sesión o abandonar la página y volver en otro momento a completar su registro usando su cédula o correo electrónico.

2. **Control de Repositorio Final (Coordinación de Investigaciones):**
   - Transición de estado: `borrador` ➔ `aprobado` (Repositorio Final).
   - **Inalterabilidad:** Una vez que un registro pasa al Repositorio Final mediante aprobación con contraseña del Coordinador de Investigaciones, **se bloquea la edición pública** garantizando la trazabilidad e inalterabilidad de los datos.

3. **Motor de Autenticación por Correo Electrónico:**
   - Soporte para autenticación por correo electrónico y generación/envío de contraseñas de forma aleatoria mediante Supabase Auth.

---

## 📐 4. Control de Extensión y Estructura Institucional (Norma Minciencias)

- **Restricción Física por `maxlength`:** Los campos de texto estructurado impiden que el usuario exceda el máximo permitido por la norma.
- **Indicadores en Tiempo Real:** Cada campo de texto descriptivo incluye una barra informativa que detalla:
  - Rango de extensión institucional (`Mín. X | Máx. Y car.`).
  - Caracteres actuales ingresados y conteo dinámico de palabras.
  - Alerta visual de cumplimiento:
    - 🔴 **Incompleto:** Alerta de caracteres faltantes y resaltado en tono rosado.
    - 🟢 **Conforme:** Indicador verde con el mensaje `Cumple extensión Minciencias ✓`.
- **Refresco Automático:** Los contadores se refrescan dinámicamente al escribir (`input`), al restaurar borradores y al reiniciar formularios.

---

## 🛡️ 5. Arquitectura de Seguridad (Row Level Security - RLS)

Se ejecutó el blindaje en Supabase PostgreSQL para asegurar las tablas:
- **`public.experiencias_significativas`**
- **`public.innovaciones_educativas`**

**Políticas RLS Aplicadas:**
- `INSERT`: Permitido públicamente (cualquier docente/autor puede radicar o guardar borrador).
- `SELECT`: Permitido públicamente (para consulta del repositorio público, borrador personal y generación de recibos).
- `UPDATE`: Permitido para actualización de borradores propios o por parte del Coordinador de Investigaciones.
- `DELETE`: Denegado públicamente (protege contra alteración o borrado malicioso).

---

## 🏷️ 6. Nomenclatura Institucional de Radicados

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

## 📄 7. Exportación e Informes Oficiales

### A. Documento PDF Oficial Vectorial (`pdfMake`)
- **Tamaño de Hoja:** Carta (Letter).
- **Inmodificable:** Generación vectorial limpia en PDF para descarga oficial desde la Ficha Técnica del Repositorio.
- **Formato APA 7.ª Edición:** Citas y referencias bibliográficas formateadas bajo **Normas APA 7.ª Edición**.
- **Regla de Omisión de Referencias Vacías:** Si no hay referencias registradas, la sección se omite limpiamente del PDF.

### B. Documento Microsoft Word (.docx)
- Generación de archivo `.docx` estructurado con la plantilla institucional nativa.
- Incluye encabezados, pies de página, tablas organizativas y resumen de evidencias cargadas.

---

## 📎 8. Carga de Evidencias y Soporte (Cámara de Comercio, RUT, Anexos)

- **Módulos de Carga:** Zonas independientes para Cámara de Comercio, RUT y Anexos Complementarios.
- **Límite de Tamaño:** Máximo **5 MB por archivo**.
- **Almacenamiento en Supabase:** Codificados en Base64 y persistidos en la columna JSONB `evidencias_adjuntas`.
- **Acceso:** Descargables directamente desde la ventana emergente Ficha Técnica del Repositorio.

---

## 🏛️ 9. Repositorio Público y Modales Independientes

- **Diseño Principal:** Tarjetas Categorizadas Institucionales (`Experiencias Significativas` e `Innovación en Procesos`) con contadores de radicados en tiempo real.
- **Ventanas Emergentes (Modales):** 
  - `#modal-repo-exp`: Muestra en una ventana emergente dedicada el listado y fichas técnicas de Experiencias Significativas.
  - `#modal-repo-inn`: Muestra en una ventana emergente dedicada el listado y fichas técnicas de Innovaciones Educativas.

---

## ⚙️ 10. Estructura HTML y Filtros Evaluadores de Calidad (≥ 80%)

- **Aislamiento DOM por Pestaña:**
  - `<div id="tab-content-experiencias">` (Pestaña 1) y `<div id="tab-content-innovaciones">` (Pestaña 2) son hermanos independientes bajo `<main>`.
  - `#exp-quality-panel` pertenece únicamente a Formulario 1.
  - `#inn-quality-panel` pertenece únicamente a Formulario 2.
- **Filtro de Calidad en Tiempo Real:** Evalúa automáticamente el cumplimiento del 80% mínimo para habilitar el botón de radicación en Supabase (`#exp-submit-btn` y `#inn-submit-btn`).

---

## 📜 11. Script SQL de Migración (`schema_migration.sql`)

El esquema de la base de datos en Supabase incluye soporte para estado de borrador, usuarios y control de la norma Minciencias. Se encuentra documentado y sincronizado en [schema_migration.sql](file:///c:/Users/Estudiante%2008/Documents/Pedro_Noriega/Acreditaci%C3%B3n_Alta%20Calidad/Investigaci%C3%B3n_Proyecci%C3%B3n%20Social/schema_migration.sql).

---

## 🚀 12. Instrucciones para Continuar en Futuras Sesiones

Al abrir una nueva sesión con el agente de IA, solo necesitas hacer referencia a este archivo `PROJECT_MEMORY.md` o al repositorio de GitHub (`pedronoriega-eng/portal-investigaciones-cto`). El agente comprenderá de inmediato toda la arquitectura, esquemas de Supabase, reglas institucionales y estado perfecto del código para continuar ampliando el proyecto sin reprocesos.
