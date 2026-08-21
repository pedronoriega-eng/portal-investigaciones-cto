-- ==============================================================================
-- SCRIPT DE MIGRACIÓN SUPABASE SQL
-- Institución: Corporación Tecnológica del Oriente
-- Sistema de Investigaciones, Innovación, Creación Artística y Cultural
-- ==============================================================================

-- Habilitar extensión uuid-ossp si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLA: experiencias_significativas (Anexo 1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.experiencias_significativas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    radicado VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 1. Información general
    nombre_experiencia TEXT NOT NULL,
    programa_academico TEXT NOT NULL,
    espacio_academico TEXT NOT NULL,
    nivel_formacion VARCHAR(50) NOT NULL, -- Técnico Profesional, Tecnológico, Profesional, Especialización
    fecha_presentacion DATE NOT NULL,
    periodo_academico VARCHAR(20) NOT NULL,
    docentes_responsables TEXT NOT NULL,
    cedula_docente VARCHAR(20) NOT NULL,
    correo_docente VARCHAR(150) NOT NULL,
    num_estudiantes INTEGER DEFAULT 1,
    modalidad VARCHAR(30) NOT NULL, -- Presencial, Virtual, Distancia, Dual
    lugar_contexto TEXT NOT NULL,
    lineas_investigacion_programa TEXT,
    lineas_investigacion_institucional TEXT,
    espacio_divulgacion_asc TEXT[], -- Array de casillas seleccionadas
    espacio_divulgacion_otro TEXT,
    
    -- 2. Desarrollo de la Experiencia
    contexto_experiencia TEXT NOT NULL, -- 2.1 Dónde, con quién, condiciones
    pregunta_problematizadora TEXT NOT NULL, -- 2.2 Pregunta que orienta
    objetivo_experiencia TEXT NOT NULL, -- 2.3 Objetivo principal
    descripcion_experiencia TEXT NOT NULL, -- 2.4 Actividades, metodología, actores
    analisis_reflexion TEXT NOT NULL, -- 2.5 Lo que funcionó, dificultades, aprendizajes
    resultados_aportes TEXT NOT NULL, -- 2.6 Resultados en ámbitos educativo, social, etc.
    proyeccion TEXT NOT NULL, -- 2.7 Replicar y mejorar
    observaciones TEXT
);

-- ==============================================================================
-- 2. TABLA: innovaciones_educativas (Guía Orientadora)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.innovaciones_educativas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    radicado VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 1. Información general
    titulo_innovacion TEXT NOT NULL,
    tipo_innovacion VARCHAR(100) NOT NULL, -- En productos/servicios, procesos, organización, comercialización
    fecha_creacion DATE NOT NULL,
    nombre_empresa TEXT NOT NULL,
    sector_empresa TEXT NOT NULL,
    nit_empresa VARCHAR(50),
    proyecto_investigacion_titulo TEXT,
    proyecto_investigacion_convocatoria TEXT,
    origen_estrategia_ctei VARCHAR(100), -- Semillero, Grupo estudio, Grupo trabajo, Colectivo, Joven Inv, Trabajo de grado
    nombre_estrategia_ctei TEXT,
    institucion_financiadora TEXT,
    disponibilidad VARCHAR(50), -- Restringido, No restringido
    tipo_proteccion VARCHAR(50), -- Ninguno, Registro, Patente, Secreto Empresarial
    
    -- 2. Autor Principal y Coautores
    autor_principal_nombre TEXT NOT NULL,
    autor_principal_cedula VARCHAR(20) NOT NULL,
    autor_principal_correo VARCHAR(150) NOT NULL,
    autor_principal_afiliacion TEXT NOT NULL,
    autor_principal_grupo_facultad TEXT NOT NULL,
    coautores_json JSONB DEFAULT '[]'::jsonb, -- Lista estructurada de coautores
    
    -- 3. Información de la Innovación
    resumen_innovacion TEXT NOT NULL, -- Máx 350 palabras
    estado_previo_problematica TEXT NOT NULL, -- Estado del arte y problemas antes de la innovación
    estado_posterior_solucion TEXT NOT NULL, -- Estado posterior a la innovación y resolución
    novedad_tipo VARCHAR(50) NOT NULL, -- nuevo, mejorado
    novedad_explicacion TEXT NOT NULL,
    novedad_alcance TEXT NOT NULL, -- Existía nac/int, no nac sí int, ni nac ni int
    novedad_alcance_evidencias TEXT NOT NULL,
    impactos_economicos_list TEXT[], -- Array de impactos seleccionados
    impactos_explicacion_evidencias TEXT NOT NULL
);

-- ==============================================================================
-- 3. ÍNDICES DE RENDIMIENTO Y AUDITORÍA
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_exp_radicado ON public.experiencias_significativas(radicado);
CREATE INDEX IF NOT EXISTS idx_exp_cedula ON public.experiencias_significativas(cedula_docente);
CREATE INDEX IF NOT EXISTS idx_exp_correo ON public.experiencias_significativas(correo_docente);

CREATE INDEX IF NOT EXISTS idx_inn_radicado ON public.innovaciones_educativas(radicado);
CREATE INDEX IF NOT EXISTS idx_inn_cedula ON public.innovaciones_educativas(autor_principal_cedula);
CREATE INDEX IF NOT EXISTS idx_inn_correo ON public.innovaciones_educativas(autor_principal_correo);
