const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  PageBreak, Header, Footer, ImageRun, TabStopPosition, TabStopType,
  TableOfContents, SectionType, PageNumber, NumberFormat,
  convertInchesToTwip, LevelFormat
} = require('docx');
const fs = require('fs');

// ─── COLORES INSTITUCIONALES ─────────────────────────────────────────────────
const BRAND_ORANGE = 'E85D04';
const BRAND_DARK   = '1E293B';
const BRAND_BLUE   = '0F4C81';
const BRAND_GREEN  = '059669';
const BRAND_GRAY   = '64748B';
const WHITE        = 'FFFFFF';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({ text, bold: true, size: 32, color: BRAND_DARK, font: 'Calibri' })
    ]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({ text, bold: true, size: 26, color: BRAND_BLUE, font: 'Calibri' })
    ]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({ text, bold: true, size: 24, color: BRAND_ORANGE, font: 'Calibri' })
    ]
  });
}

function paragraph(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 276 },
    indent: opts.indent ? { firstLine: convertInchesToTwip(0.3) } : undefined,
    children: [
      new TextRun({ text, size: 22, font: 'Calibri', color: BRAND_DARK, ...(opts.bold && { bold: true }), ...(opts.italic && { italics: true }) })
    ]
  });
}

function bulletItem(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60, line: 276 },
    children: [
      new TextRun({ text, size: 22, font: 'Calibri', color: BRAND_DARK })
    ]
  });
}

function boldBullet(boldText, normalText, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60, line: 276 },
    children: [
      new TextRun({ text: boldText, bold: true, size: 22, font: 'Calibri', color: BRAND_DARK }),
      new TextRun({ text: normalText, size: 22, font: 'Calibri', color: BRAND_DARK })
    ]
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 80 }, children: [] });
}

function tableCell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    verticalAlign: 'center',
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text, size: 20, font: 'Calibri',
            bold: !!opts.bold,
            color: opts.color || BRAND_DARK
          })
        ]
      })
    ]
  });
}

function headerRow(...cells) {
  return new TableRow({
    tableHeader: true,
    children: cells.map(c => tableCell(c, { bold: true, shading: BRAND_BLUE, color: WHITE }))
  });
}

function dataRow(...cells) {
  return new TableRow({
    children: cells.map((c, i) => {
      if (typeof c === 'object') return tableCell(c.text, c.opts || {});
      return tableCell(c, i === 0 ? { bold: true } : {});
    })
  });
}

// ─── DOCUMENTO ───────────────────────────────────────────────────────────────
async function buildDocument() {
  const doc = new Document({
    creator: 'Corporación Tecnológica del Oriente',
    title: 'Documento Técnico - Portal Institucional de Investigaciones e Innovaciones CTO',
    description: 'Estructura, flujo de información y guía de uso del Portal de Investigaciones e Innovaciones Educativas de la CTO',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: BRAND_DARK }
        }
      }
    },
    numbering: {
      config: [{
        reference: 'numbered-list',
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.START
        }]
      }]
    },
    sections: [
      // ═══════════════════════════════════════════════════════════════════════
      // PORTADA
      // ═══════════════════════════════════════════════════════════════════════
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) }
          }
        },
        children: [
          emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),
          emptyLine(), emptyLine(), emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'CORPORACIÓN TECNOLÓGICA DEL ORIENTE', bold: true, size: 36, color: BRAND_DARK, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Coordinación de Investigaciones', size: 26, color: BRAND_GRAY, font: 'Calibri', italics: true })
            ]
          }),
          emptyLine(), emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', size: 20, color: BRAND_ORANGE })
            ]
          }),
          emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'DOCUMENTO TÉCNICO', bold: true, size: 44, color: BRAND_ORANGE, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({ text: 'Estructura y Arquitectura Tecnológica del', size: 28, color: BRAND_DARK, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Portal Institucional de Investigaciones\ne Innovaciones Educativas (SIAC / I+D+i)', bold: true, size: 30, color: BRAND_BLUE, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', size: 20, color: BRAND_ORANGE })
            ]
          }),
          emptyLine(), emptyLine(), emptyLine(), emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Flujo de Información, Elementos Tecnológicos en Interacción,', size: 22, color: BRAND_GRAY, font: 'Calibri', italics: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Guía de Uso y Propósito Institucional', size: 22, color: BRAND_GRAY, font: 'Calibri', italics: true })
            ]
          }),
          emptyLine(), emptyLine(), emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Septiembre de 2026', bold: true, size: 24, color: BRAND_DARK, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Bucaramanga, Santander — Colombia', size: 22, color: BRAND_GRAY, font: 'Calibri' })
            ]
          }),
        ]
      },

      // ═══════════════════════════════════════════════════════════════════════
      // TABLA DE CONTENIDO
      // ═══════════════════════════════════════════════════════════════════════
      {
        properties: {
          page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) } }
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'Portal de Investigaciones CTO — Documento Técnico', size: 16, color: BRAND_GRAY, font: 'Calibri', italics: true })]
            })]
          })
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Corporación Tecnológica del Oriente — Coordinación de Investigaciones — Pág. ', size: 16, color: BRAND_GRAY, font: 'Calibri' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GRAY, font: 'Calibri' })
              ]
            })]
          })
        },
        children: [
          heading1('TABLA DE CONTENIDO'),
          emptyLine(),
          paragraph('(Actualice este campo en Microsoft Word seleccionando la tabla y presionando F9)', { italic: true }),
          emptyLine(),
          new TableOfContents('Tabla de Contenido', {
            hyperlink: true,
            headingStyleRange: '1-3'
          }),
        ]
      },

      // ═══════════════════════════════════════════════════════════════════════
      // CONTENIDO PRINCIPAL
      // ═══════════════════════════════════════════════════════════════════════
      {
        properties: {
          page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) } }
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'Portal de Investigaciones CTO — Documento Técnico', size: 16, color: BRAND_GRAY, font: 'Calibri', italics: true })]
            })]
          })
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Corporación Tecnológica del Oriente — Coordinación de Investigaciones — Pág. ', size: 16, color: BRAND_GRAY, font: 'Calibri' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GRAY, font: 'Calibri' })
              ]
            })]
          })
        },
        children: [

          // ═══════════════════════════════════════════════════════════════════
          // 1. INTRODUCCIÓN Y PROPÓSITO
          // ═══════════════════════════════════════════════════════════════════
          heading1('1. INTRODUCCIÓN Y PROPÓSITO DE LA HERRAMIENTA'),
          emptyLine(),
          paragraph('El Portal Institucional de Investigaciones e Innovaciones Educativas es una herramienta tecnológica de tipo aplicación web, diseñada específicamente para la Corporación Tecnológica del Oriente (CTO), con el fin de digitalizar, estandarizar y centralizar la captura, validación y gestión de la producción investigativa e innovadora de la institución.', { indent: true }),
          paragraph('Esta herramienta responde a las necesidades de acreditación de alta calidad institucional, y está alineada con los lineamientos establecidos por el Ministerio de Ciencia, Tecnología e Innovación (Minciencias) y el Sistema Institucional de Aseguramiento de la Calidad (SIAC) de la CTO.', { indent: true }),

          heading2('1.1 ¿Para Qué Sirve?'),
          paragraph('El portal cumple los siguientes propósitos fundamentales:'),
          boldBullet('Captura estructurada: ', 'Permite a los docentes e investigadores registrar de manera formal y ordenada las Experiencias Significativas de Aula y las Innovaciones Educativas que desarrollan en sus programas académicos.'),
          boldBullet('Validación en tiempo real: ', 'Aplica un sistema de evaluación automática de calidad (≥ 80%) que verifica que cada registro cumpla con los criterios mínimos de profundidad, articulación investigativa y extensión documental antes de permitir su radicación oficial.'),
          boldBullet('Trazabilidad institucional: ', 'Genera un número de radicado único por registro (nomenclatura institucional estandarizada) que permite el seguimiento histórico de cada producción.'),
          boldBullet('Persistencia de borradores: ', 'Permite guardar avances parciales (borradores) para que el investigador pueda volver en cualquier momento a completar su registro sin perder información.'),
          boldBullet('Repositorio público consultable: ', 'Consolida un repositorio institucional de libre consulta donde se exhiben públicamente los productos de investigación e innovación radicados y aprobados.'),
          boldBullet('Exportación documental: ', 'Genera automáticamente documentos oficiales en formato PDF vectorial inmodificable y Microsoft Word (.docx) con la identidad institucional de la CTO.'),
          boldBullet('Norma Minciencias: ', 'Aplica restricciones de extensión (caracteres mínimos y máximos) en cada campo de texto descriptivo, con indicadores visuales dinámicos de cumplimiento de la norma Minciencias.'),

          heading2('1.2 ¿A Quién Está Dirigida?'),
          bulletItem('Docentes investigadores de todos los programas académicos de la CTO.'),
          bulletItem('Coordinación de Investigaciones como ente regulador y aprobador.'),
          bulletItem('Comités de acreditación y auditoría externa que requieran evidencia digitalizada.'),
          bulletItem('Directivos institucionales que consulten indicadores de producción investigativa.'),

          // ═══════════════════════════════════════════════════════════════════
          // 2. ARQUITECTURA TECNOLÓGICA
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('2. ARQUITECTURA TECNOLÓGICA'),
          emptyLine(),
          paragraph('La herramienta se construye sobre una arquitectura moderna de aplicación web tipo SPA (Single Page Application) desplegada como sitio estático en GitHub Pages, con la lógica de persistencia delegada a Supabase como Backend-as-a-Service (BaaS). A continuación, se describen todos los elementos tecnológicos que participan en el sistema y su rol específico.', { indent: true }),

          heading2('2.1 Stack Tecnológico Completo'),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Capa', 'Tecnología', 'Función / Rol en el Sistema'),
              dataRow('Frontend (Interfaz)', 'HTML5', 'Estructura semántica de la aplicación web: formularios, modales, pestañas, paneles de calidad.'),
              dataRow('Estilos Visuales', 'Tailwind CSS 3.x (CDN)', 'Framework de utilidades CSS para diseño responsivo, animaciones, gradientes y glassmorphism institucional.'),
              dataRow('Lógica de Aplicación', 'JavaScript Vanilla (ES6+)', 'Toda la lógica de negocio: validaciones, evaluadores de calidad, contadores Minciencias, generación de radicados, gestión de borradores, comunicación con APIs.'),
              dataRow('Iconografía', 'Font Awesome 6 (CDN)', 'Biblioteca de iconos vectoriales utilizados en botones, indicadores de estado, alertas y navegación.'),
              dataRow('Generación PDF', 'pdfMake (CDN)', 'Motor de generación de documentos PDF vectoriales inmodificables con la identidad institucional CTO.'),
              dataRow('Generación Word', 'docx.js', 'Motor de generación de documentos Microsoft Word (.docx) estructurados con tablas, encabezados y formato institucional.'),
              dataRow('Base de Datos', 'Supabase PostgreSQL', 'Base de datos relacional en la nube que almacena todos los registros (experiencias e innovaciones), borradores y evidencias.'),
              dataRow('Autenticación', 'Supabase Auth', 'Motor de autenticación por correo electrónico con generación de contraseñas aleatorias. Integrado con el control de sesiones del portal.'),
              dataRow('Almacenamiento Temporal', 'LocalStorage (Navegador)', 'Capa de respaldo local que guarda el estado del formulario cada 15 segundos para prevenir pérdidas de información ante desconexiones o cierres accidentales.'),
              dataRow('Seguridad de Datos', 'Row Level Security (RLS)', 'Políticas de seguridad a nivel de fila en PostgreSQL que impiden la modificación o eliminación no autorizada de registros.'),
              dataRow('Hosting / Despliegue', 'GitHub Pages', 'Servicio de alojamiento estático gratuito con dominio HTTPS. Despliegue automático desde la rama main del repositorio.'),
              dataRow('Control de Versiones', 'Git + GitHub', 'Sistema de control de versiones distribuido que registra cada cambio realizado en el código fuente del portal.'),
            ]
          }),

          // ═══════════════════════════════════════════════════════════════════
          // 3. DIAGRAMA DE INTERACCIÓN DE COMPONENTES
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('3. INTERACCIÓN DE COMPONENTES TECNOLÓGICOS'),
          emptyLine(),
          paragraph('El portal funciona como un ecosistema integrado donde cada componente tecnológico tiene un rol definido. La siguiente descripción explica cómo interactúan entre sí:', { indent: true }),

          heading2('3.1 Capa de Presentación (Frontend)'),
          paragraph('El archivo principal index.html contiene toda la interfaz visual del portal. Es un documento HTML5 de aproximadamente 4.400 líneas que integra:'),
          boldBullet('Dos formularios independientes: ', 'Uno para Experiencias Significativas de Aula y otro para Innovaciones Educativas, organizados mediante un sistema de pestañas (tabs) que permite alternar entre ambos sin recargar la página.'),
          boldBullet('Paneles de evaluación de calidad: ', 'Cada formulario cuenta con un panel lateral que evalúa en tiempo real el porcentaje de completitud y calidad del registro, desglosado en criterios ponderados.'),
          boldBullet('Contadores de extensión Minciencias: ', 'Barras informativas debajo de cada campo de texto que indican el mínimo y máximo de caracteres permitido, el conteo actual y el estado de cumplimiento (Cumple / No cumple).'),
          boldBullet('Repositorio público: ', 'Sección inferior de la página con tarjetas categorizadas que muestran los registros aprobados y radicados oficialmente.'),
          boldBullet('Modales de detalle: ', 'Ventanas emergentes que despliegan la ficha técnica completa de cada registro radicado, incluyendo botones de descarga PDF y Word.'),

          heading2('3.2 Capa de Lógica de Negocio (JavaScript)'),
          paragraph('Toda la lógica de la aplicación está embebida dentro del mismo archivo index.html mediante etiquetas <script>. Las funciones principales incluyen:'),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Función / Módulo', 'Descripción'),
              dataRow('initMincienciasCounters()', 'Inicializa los contadores de caracteres y palabras en todos los campos con atributos data-min y data-max. Aplica maxlength físico y actualiza los indicadores de cumplimiento Minciencias en tiempo real.'),
              dataRow('saveDraftToLocalStorage()', 'Serializa el estado completo de ambos formularios y lo almacena en localStorage del navegador como respaldo local.'),
              dataRow('saveDraftToSupabase()', 'Envía el estado actual del formulario activo a la base de datos Supabase con estado "borrador" para persistencia remota.'),
              dataRow('loadDraftFromLocalStorage()', 'Al cargar la página, restaura automáticamente el último borrador guardado localmente, rellenando todos los campos y actualizando los contadores.'),
              dataRow('evaluateExperienciasQuality()', 'Evalúa 5 criterios ponderados (información básica, contexto, articulación, metodología, resultados) y calcula un puntaje de calidad del 0% al 100%.'),
              dataRow('evaluateInnovacionesQuality()', 'Evalúa 5 criterios ponderados (información general, resumen y diagnóstico, novedad, impactos, referencias) para el formulario de innovaciones.'),
              dataRow('generateRadicadoAsync()', 'Genera un código de radicado institucional único con la estructura TIPO-PROGRAMA-PERIODO-CONSECUTIVO, consultando el consecutivo real en Supabase.'),
              dataRow('submitExperiencia() / submitInnovacion()', 'Ejecutan la radicación oficial del registro en Supabase, cambiando su estado a "aprobado" o "radicado" y generando el recibo digital.'),
              dataRow('fetchAndRenderPublicRepository()', 'Consulta los registros aprobados en Supabase y los renderiza como tarjetas institucionales en la sección de Repositorio Público.'),
              dataRow('downloadOfficialPdf()', 'Genera un documento PDF vectorial oficial con toda la información del registro, incluyendo encabezado y pie de página institucional.'),
              dataRow('manualSaveDraft()', 'Función del botón "Guardar Borrador Temporal" que fuerza un guardado inmediato tanto en localStorage como en Supabase.'),
            ]
          }),

          heading2('3.3 Capa de Persistencia (Supabase PostgreSQL)'),
          paragraph('La base de datos está alojada en Supabase (proyecto joumcvebzatdgluvxgkm) y contiene dos tablas principales:', { indent: true }),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Tabla', 'Columnas Principales', 'Propósito'),
              dataRow('experiencias_significativas', 'id, radicado, programa_academico, docente_nombre, docente_cedula, contexto_*, metodologia_*, resultados_*, proyeccion_*, evidencias_adjuntas (JSONB), estado, puntaje_calidad, created_at', 'Almacena tanto borradores como registros radicados oficiales de Experiencias Significativas de Aula.'),
              dataRow('innovaciones_educativas', 'id, radicado, titulo, tipo_innovacion, empresa, sector, autor_*, coautores_json (JSONB), resumen, novedad_*, impactos_*, evidencias_adjuntas (JSONB), estado, puntaje_calidad, created_at', 'Almacena tanto borradores como registros radicados oficiales de Innovaciones Educativas.'),
            ]
          }),
          emptyLine(),
          paragraph('Ambas tablas soportan los estados: "borrador" (editable, en progreso) y "aprobado" (radicado, inalterable en el repositorio final).'),

          heading2('3.4 Capa de Seguridad (Row Level Security)'),
          paragraph('Supabase implementa políticas de seguridad a nivel de fila (RLS) que actúan como un firewall de datos:', { indent: true }),
          bulletItem('INSERT: Permitido públicamente (cualquier docente puede iniciar un registro).'),
          bulletItem('SELECT: Permitido públicamente (para consultar el repositorio público y cargar borradores propios).'),
          bulletItem('UPDATE: Permitido de forma controlada (solo borradores propios o por el Coordinador de Investigaciones).'),
          bulletItem('DELETE: Denegado públicamente (ningún usuario puede eliminar registros, protegiendo la integridad de los datos institucionales).'),

          // ═══════════════════════════════════════════════════════════════════
          // 4. FLUJO DE LA INFORMACIÓN
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('4. FLUJO DE LA INFORMACIÓN'),
          emptyLine(),
          paragraph('El recorrido completo de la información en el portal sigue un flujo de 7 etapas claramente definidas, desde el ingreso del docente hasta la publicación final en el repositorio institucional:', { indent: true }),

          heading2('Etapa 1 — Ingreso del Usuario y Selección de Formulario'),
          paragraph('El docente o investigador accede al portal a través de la URL pública (GitHub Pages). La página se carga completamente en el navegador sin necesidad de instalar software adicional. El sistema verifica si existen borradores anteriores en localStorage y los restaura automáticamente. El usuario selecciona la pestaña correspondiente: "Experiencias Significativas" o "Innovaciones Educativas".', { indent: true }),

          heading2('Etapa 2 — Diligenciamiento del Formulario con Validación Minciencias'),
          paragraph('A medida que el usuario escribe en cada campo, se activan dos mecanismos simultáneos:', { indent: true }),
          boldBullet('Contadores Minciencias: ', 'Cada campo de texto muestra en tiempo real la cantidad de caracteres escritos, el número de palabras, el rango permitido (Mín. X | Máx. Y) y el estado de cumplimiento con indicadores de color (rojo = faltan caracteres, verde = cumple la norma).'),
          boldBullet('Evaluador de Calidad: ', 'El panel lateral calcula el porcentaje de calidad del registro evaluando 5 criterios ponderados. El botón de radicación solo se habilita cuando el puntaje alcanza o supera el 80%.'),

          heading2('Etapa 3 — Guardado de Borradores (Temporal y Persistente)'),
          paragraph('La información se protege mediante un sistema de guardado de tres niveles:', { indent: true }),
          boldBullet('Nivel 1 — Auto-guardado local: ', 'Cada 15 segundos, el sistema serializa todos los campos del formulario y los almacena en localStorage del navegador. Si el usuario cierra la ventana accidentalmente, al volver se restaurará su último avance.'),
          boldBullet('Nivel 2 — Auto-guardado en nube: ', 'Simultáneamente, cada 15 segundos se envía el estado del formulario a Supabase con estado "borrador", garantizando persistencia incluso si cambia de equipo.'),
          boldBullet('Nivel 3 — Guardado manual: ', 'El botón "💾 Guardar Borrador Temporal" permite al usuario forzar un guardado inmediato en ambas capas (local + nube) en cualquier momento.'),

          heading2('Etapa 4 — Carga de Evidencias Digitales'),
          paragraph('El portal permite adjuntar tres tipos de archivos como soporte documental:', { indent: true }),
          bulletItem('Cámara de Comercio (archivo PDF o imagen, máximo 5 MB).'),
          bulletItem('RUT actualizado (archivo PDF o imagen, máximo 5 MB).'),
          bulletItem('Anexos complementarios (múltiples archivos, máximo 5 MB cada uno).'),
          paragraph('Los archivos se codifican en formato Base64 y se almacenan directamente en la columna JSONB evidencias_adjuntas de la tabla correspondiente en Supabase, eliminando la necesidad de un servidor de archivos independiente.', { indent: true }),

          heading2('Etapa 5 — Radicación Oficial'),
          paragraph('Cuando el evaluador de calidad alcanza el 80% o más, se habilita el botón de radicación. Al presionarlo:', { indent: true }),
          bulletItem('Se genera un número de radicado institucional único (ej.: EXP-ADM-20261-001).'),
          bulletItem('El registro se inserta o actualiza en Supabase con toda la información capturada.'),
          bulletItem('Se muestra un recibo digital con el número de radicado asignado y un resumen del registro.'),
          bulletItem('El estado del registro se marca como "radicado" preparándolo para la aprobación final.'),

          heading2('Etapa 6 — Aprobación y Paso al Repositorio Final'),
          paragraph('El Coordinador de Investigaciones, mediante su contraseña de administrador, puede cambiar el estado de un registro de "borrador/radicado" a "aprobado". Una vez aprobado:', { indent: true }),
          bulletItem('El registro se vuelve inalterable (no puede ser editado ni eliminado por ningún usuario).'),
          bulletItem('Aparece automáticamente en la sección de Repositorio Público del portal.'),
          bulletItem('Se integra a la tarjeta categorizada correspondiente con su ficha técnica completa.'),

          heading2('Etapa 7 — Consulta, Descarga y Auditoría'),
          paragraph('Cualquier visitante del portal puede consultar el Repositorio Público y acceder a las fichas técnicas de cada registro aprobado. Desde la ficha técnica se puede:', { indent: true }),
          bulletItem('Descargar el Documento PDF Oficial (vectorial, inmodificable, con identidad CTO).'),
          bulletItem('Descargar el Documento Word (.docx) para uso interno o auditorías.'),
          bulletItem('Consultar las evidencias adjuntas (Cámara de Comercio, RUT, Anexos).'),
          bulletItem('Verificar el número de radicado, la fecha de radicación y el puntaje de calidad.'),

          // ═══════════════════════════════════════════════════════════════════
          // 5. DIAGRAMA DE FLUJO TEXTUAL
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('5. DIAGRAMA DE FLUJO DEL SISTEMA'),
          emptyLine(),
          paragraph('El siguiente diagrama describe el flujo general del sistema de extremo a extremo:'),
          emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '┌─────────────────────────────────────────┐', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   DOCENTE / INVESTIGADOR (NAVEGADOR)    │', font: 'Consolas', size: 18, color: BRAND_DARK, bold: true }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   Accede al Portal (GitHub Pages)       │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '└───────────────────┬─────────────────────┘', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '                    ▼', font: 'Consolas', size: 18, color: BRAND_ORANGE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '┌─────────────────────────────────────────┐', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   RESTAURAR BORRADOR (localStorage)     │', font: 'Consolas', size: 18, color: BRAND_BLUE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   ¿Existe borrador? → Sí → Rellenar    │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '└───────────────────┬─────────────────────┘', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '                    ▼', font: 'Consolas', size: 18, color: BRAND_ORANGE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '┌─────────────────────────────────────────┐', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   DILIGENCIAR FORMULARIO                │', font: 'Consolas', size: 18, color: BRAND_BLUE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   Contadores Minciencias en tiempo real  │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   Evaluador Calidad ≥ 80%               │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '└─────────┬─────────────────┬─────────────┘', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '          ▼                 ▼', font: 'Consolas', size: 18, color: BRAND_ORANGE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '┌─────────────────┐  ┌──────────────────┐', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│ GUARDAR BORRADOR│  │ RADICAR OFICIAL  │', font: 'Consolas', size: 18, color: BRAND_BLUE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│ (Local + Nube)  │  │ (Si Calidad ≥80%)│', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '└────────┬────────┘  └────────┬─────────┘', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '         ▼                    ▼', font: 'Consolas', size: 18, color: BRAND_ORANGE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '┌─────────────────────────────────────────┐', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│         SUPABASE POSTGRESQL             │', font: 'Consolas', size: 18, color: BRAND_GREEN, bold: true }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   experiencias_significativas           │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   innovaciones_educativas               │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   Row Level Security (RLS) activo       │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '└───────────────────┬─────────────────────┘', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '                    ▼', font: 'Consolas', size: 18, color: BRAND_ORANGE }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '┌─────────────────────────────────────────┐', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   REPOSITORIO PÚBLICO (Consulta)        │', font: 'Consolas', size: 18, color: BRAND_GREEN, bold: true }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '│   Tarjetas + Fichas + PDF/Word          │', font: 'Consolas', size: 18, color: BRAND_GRAY }) ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [ new TextRun({ text: '└─────────────────────────────────────────┘', font: 'Consolas', size: 18, color: BRAND_DARK }) ]
          }),

          // ═══════════════════════════════════════════════════════════════════
          // 6. GUÍA DE USO
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('6. GUÍA DE USO DE LA HERRAMIENTA'),
          emptyLine(),

          heading2('6.1 Acceso al Portal'),
          paragraph('Acceda al portal desde cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) ingresando a la siguiente dirección:', { indent: true }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'https://pedronoriega-eng.github.io/portal-investigaciones-cto/', bold: true, size: 24, color: BRAND_BLUE, font: 'Calibri' })
            ]
          }),
          paragraph('No requiere instalación de software ni complementos adicionales. El portal es 100% responsivo y puede utilizarse desde dispositivos móviles, tablets o computadores de escritorio.', { indent: true }),

          heading2('6.2 Selección del Tipo de Registro'),
          paragraph('Al ingresar al portal, verá dos pestañas principales en la parte superior del formulario:', { indent: true }),
          boldBullet('Experiencias Significativas de Aula: ', 'Para registrar prácticas pedagógicas e investigativas que generan impacto en los procesos de enseñanza-aprendizaje.'),
          boldBullet('Innovaciones Educativas: ', 'Para documentar productos, procesos o servicios nuevos o significativamente mejorados de origen investigativo.'),

          heading2('6.3 Diligenciamiento del Formulario'),
          paragraph('Complete cada sección del formulario siguiendo las indicaciones institucionales. Preste especial atención a:', { indent: true }),
          boldBullet('Indicadores de extensión Minciencias: ', 'Debajo de cada campo de texto largo aparecerá una barra que muestra el rango permitido de caracteres (ej.: Mín. 25 | Máx. 1500 car.), la cantidad actual ingresada y un indicador de cumplimiento visual.'),
          boldBullet('Bordes de color: ', 'Un borde rojo indica que aún no se alcanza el mínimo de caracteres requerido. Un borde verde indica que el campo cumple con la extensión Minciencias.'),
          boldBullet('Evaluador de calidad (panel derecho): ', 'Monitoree el puntaje de calidad en el panel lateral. Se requiere un mínimo del 80% para habilitar la radicación oficial.'),

          heading2('6.4 Guardado de Avances Parciales (Borradores)'),
          paragraph('Si no puede completar todo el formulario en una sola sesión:', { indent: true }),
          bulletItem('El sistema guarda automáticamente su progreso cada 15 segundos.'),
          bulletItem('Use el botón "💾 Guardar Borrador Temporal" para forzar un guardado inmediato.'),
          bulletItem('Al volver al portal (incluso desde otro equipo si está conectado a Supabase), su borrador se restaurará automáticamente.'),

          heading2('6.5 Carga de Evidencias'),
          paragraph('En la sección de evidencias, adjunte los archivos requeridos:', { indent: true }),
          bulletItem('Cámara de Comercio (PDF o imagen, máx. 5 MB).'),
          bulletItem('RUT (PDF o imagen, máx. 5 MB).'),
          bulletItem('Anexos complementarios (múltiples archivos, máx. 5 MB cada uno).'),

          heading2('6.6 Radicación Oficial'),
          paragraph('Cuando el evaluador de calidad marque ≥ 80%, presione el botón de radicación. Recibirá:', { indent: true }),
          bulletItem('Un número de radicado institucional único (ej.: EXP-ADM-20261-001).'),
          bulletItem('Un recibo digital con el resumen de su registro.'),
          bulletItem('La confirmación de que su registro ha sido almacenado en la base de datos institucional.'),

          heading2('6.7 Consulta del Repositorio Público'),
          paragraph('En la parte inferior del portal encontrará la sección de "Repositorio Público Institucional" donde podrá:', { indent: true }),
          bulletItem('Ver las tarjetas categorizadas de Experiencias e Innovaciones aprobadas.'),
          bulletItem('Abrir la ficha técnica completa de cada registro.'),
          bulletItem('Descargar los documentos oficiales en PDF y Word.'),

          // ═══════════════════════════════════════════════════════════════════
          // 7. NOMENCLATURA INSTITUCIONAL
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('7. NOMENCLATURA INSTITUCIONAL DE RADICADOS'),
          emptyLine(),
          paragraph('Cada registro aprobado recibe un código de radicado institucional único con la siguiente estructura:', { indent: true }),
          emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'TIPO  —  PROGRAMA  —  PERIODO  —  CONSECUTIVO', bold: true, size: 26, color: BRAND_ORANGE, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Ejemplo: EXP-ADM-20261-001', bold: true, size: 24, color: BRAND_BLUE, font: 'Calibri' })
            ]
          }),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Código', 'Programa Académico'),
              dataRow('ADM', 'Administración de Empresas (Presencial / Virtual)'),
              dataRow('DER', 'Derecho Virtual'),
              dataRow('SOF', 'Ingeniería en Desarrollo de Software'),
              dataRow('IND', 'Ingeniería Industrial Virtual'),
              dataRow('EDU', 'Licenciatura en Educación Infantil'),
              dataRow('SST', 'Seguridad y Salud en el Trabajo / Higiene'),
              dataRow('PRO', 'Especialización en Gerencia de Proyectos'),
              dataRow('DAT', 'Especialización en Inteligencia de Negocios y Analítica de Datos'),
              dataRow('PED', 'Especialización en Pedagogía y Didácticas Específicas'),
              dataRow('INV / CTO', 'Coordinación de Investigaciones / Departamento Transversal'),
            ]
          }),

          // ═══════════════════════════════════════════════════════════════════
          // 8. RESTRICCIONES MINCIENCIAS
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('8. RESTRICCIONES DE EXTENSIÓN BAJO NORMA MINCIENCIAS'),
          emptyLine(),
          paragraph('Cada campo de texto descriptivo del portal tiene restricciones de extensión que garantizan la uniformidad y estructura institucional, alineadas con los estándares de documentación del Ministerio de Ciencia, Tecnología e Innovación (Minciencias).', { indent: true }),

          heading2('8.1 Campos del Formulario de Experiencias Significativas'),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Campo', 'Mín. Caracteres', 'Máx. Caracteres'),
              dataRow('Nombre de la Experiencia', '10', '200'),
              dataRow('Contexto — Dónde', '20', '800'),
              dataRow('Contexto — Con quién', '20', '800'),
              dataRow('Contexto — Condiciones', '20', '800'),
              dataRow('Contexto — Por qué', '20', '800'),
              dataRow('Pregunta Problematizadora', '15', '500'),
              dataRow('Objetivo de la Experiencia', '15', '500'),
              dataRow('Descripción — Actividades', '20', '1200'),
              dataRow('Descripción — Metodología', '20', '1200'),
              dataRow('Descripción — Actores', '15', '800'),
              dataRow('Análisis — Logros', '20', '1000'),
              dataRow('Análisis — Dificultades', '20', '1000'),
              dataRow('Análisis — Aprendizajes', '20', '1000'),
              dataRow('Resultados Educativos', '15', '1000'),
              dataRow('Resultados Sociales', '15', '1000'),
              dataRow('Proyección — Mejora', '15', '800'),
              dataRow('Proyección — Replicabilidad', '15', '800'),
              dataRow('Referencias APA', '15', '1500'),
            ]
          }),

          heading2('8.2 Campos del Formulario de Innovaciones Educativas'),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Campo', 'Mín. Caracteres', 'Máx. Caracteres'),
              dataRow('Título de la Innovación', '10', '250'),
              dataRow('Resumen de la Innovación', '25', '1500'),
              dataRow('Estado Previo (Problemática)', '25', '1500'),
              dataRow('Estado Posterior (Solución)', '25', '1500'),
              dataRow('Explicación de Novedad', '25', '1200'),
              dataRow('Evidencias de Alcance', '15', '800'),
              dataRow('Explicación de Impactos', '20', '1500'),
              dataRow('Referencias APA', '15', '1500'),
            ]
          }),

          // ═══════════════════════════════════════════════════════════════════
          // 9. ENLACES DE ACCESO
          // ═══════════════════════════════════════════════════════════════════
          new Paragraph({ children: [new PageBreak()] }),
          heading1('9. ENLACES DE ACCESO Y REPOSITORIO DE CÓDIGO'),
          emptyLine(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow('Recurso', 'Enlace / Dirección'),
              dataRow('Portal en Producción (GitHub Pages)', 'https://pedronoriega-eng.github.io/portal-investigaciones-cto/'),
              dataRow('Repositorio de Código (GitHub)', 'https://github.com/pedronoriega-eng/portal-investigaciones-cto'),
              dataRow('Base de Datos (Supabase Dashboard)', 'https://app.supabase.com/project/joumcvebzatdgluvxgkm'),
              dataRow('Rama Principal', 'main'),
            ]
          }),
          emptyLine(), emptyLine(),

          heading1('10. CONCLUSIÓN'),
          emptyLine(),
          paragraph('El Portal Institucional de Investigaciones e Innovaciones Educativas de la CTO representa un avance significativo en la digitalización de los procesos de gestión del conocimiento institucional. Su arquitectura tecnológica —compuesta por HTML5, JavaScript, Tailwind CSS, Supabase PostgreSQL y GitHub Pages— garantiza una solución robusta, segura, escalable y de cero costo operativo en infraestructura.', { indent: true }),
          paragraph('La herramienta no solo cumple con los estándares de documentación de Minciencias y los requisitos de acreditación de alta calidad, sino que establece un modelo replicable para la sistematización de la producción investigativa en instituciones de educación superior.', { indent: true }),
          emptyLine(), emptyLine(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', size: 20, color: BRAND_ORANGE })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Corporación Tecnológica del Oriente', bold: true, size: 22, color: BRAND_DARK, font: 'Calibri' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Coordinación de Investigaciones — Septiembre de 2026', size: 20, color: BRAND_GRAY, font: 'Calibri', italics: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Bucaramanga, Santander — Colombia', size: 20, color: BRAND_GRAY, font: 'Calibri' })
            ]
          }),
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = 'Documento_Tecnico_Portal_Investigaciones_CTO.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Documento generado exitosamente: ${outputPath}`);
  console.log(`   Tamaño: ${(buffer.length / 1024).toFixed(1)} KB`);
}

buildDocument().catch(err => {
  console.error('Error al generar el documento:', err);
  process.exit(1);
});
