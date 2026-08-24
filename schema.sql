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
    nivel_formacion VARCHAR(50) NOT NULL,
    fecha_presentacion DATE NOT NULL,
    periodo_academico VARCHAR(20) NOT NULL,
    docentes_responsables TEXT NOT NULL,
    cedula_docente VARCHAR(20) NOT NULL,
    correo_docente VARCHAR(150) NOT NULL,
    num_estudiantes INTEGER DEFAULT 1,
    modalidad VARCHAR(30) NOT NULL,
    lugar_contexto TEXT NOT NULL,
    lineas_investigacion_programa TEXT,
    lineas_investigacion_institucional TEXT,
    espacio_divulgacion_asc TEXT[],
    espacio_divulgacion_otro TEXT,
    
    -- 2. Desarrollo de la Experiencia
    contexto_experiencia TEXT NOT NULL,
    pregunta_problematizadora TEXT NOT NULL,
    objetivo_experiencia TEXT NOT NULL,
    descripcion_experiencia TEXT NOT NULL,
    analisis_reflexion TEXT NOT NULL,
    resultados_aportes TEXT NOT NULL,
    proyeccion TEXT NOT NULL,
    observaciones TEXT,
    referencias_apa TEXT,
    evidencias_adjuntas JSONB DEFAULT '[]'::jsonb
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
    tipo_innovacion VARCHAR(100) NOT NULL,
    fecha_creacion DATE NOT NULL,
    nombre_empresa TEXT NOT NULL,
    sector_empresa TEXT NOT NULL,
    nit_empresa VARCHAR(50),
    proyecto_investigacion_titulo TEXT,
    proyecto_investigacion_convocatoria TEXT,
    origen_estrategia_ctei VARCHAR(100),
    nombre_estrategia_ctei TEXT,
    institucion_financiadora TEXT,
    disponibilidad VARCHAR(50),
    tipo_proteccion VARCHAR(50),
    
    -- 2. Autor Principal y Coautores
    autor_principal_nombre TEXT NOT NULL,
    autor_principal_cedula VARCHAR(20) NOT NULL,
    autor_principal_correo VARCHAR(150) NOT NULL,
    autor_principal_afiliacion TEXT NOT NULL,
    autor_principal_grupo_facultad TEXT NOT NULL,
    coautores_json JSONB DEFAULT '[]'::jsonb,
    
    -- 3. Información de la Innovación
    resumen_innovacion TEXT NOT NULL,
    estado_previo_problematica TEXT NOT NULL,
    estado_posterior_solucion TEXT NOT NULL,
    novedad_tipo VARCHAR(50) NOT NULL,
    novedad_explicacion TEXT NOT NULL,
    novedad_alcance TEXT NOT NULL,
    novedad_alcance_evidencias TEXT NOT NULL,
    impactos_economicos_list TEXT[],
    impactos_explicacion_evidencias TEXT NOT NULL,
    impactos_otros_explicacion TEXT,
    referencias_apa TEXT,
    evidencias_adjuntas JSONB DEFAULT '[]'::jsonb
);

-- ==============================================================================
-- 3. ÍNDICES DE RENDIMIENTO
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_exp_radicado ON public.experiencias_significativas(radicado);
CREATE INDEX IF NOT EXISTS idx_exp_cedula ON public.experiencias_significativas(cedula_docente);
CREATE INDEX IF NOT EXISTS idx_inn_radicado ON public.innovaciones_educativas(radicado);
CREATE INDEX IF NOT EXISTS idx_inn_cedula ON public.innovaciones_educativas(autor_principal_cedula);

-- ==============================================================================
-- 4. POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- Permite que la clave pública (anon/publishable) solo pueda registrar nuevos
-- formularios, protegiendo contra modificaciones o eliminaciones maliciosas.
-- ==============================================================================

ALTER TABLE public.experiencias_significativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovaciones_educativas ENABLE ROW LEVEL SECURITY;

-- Políticas para Experiencias Significativas
DROP POLICY IF EXISTS "Permitir insercion publica experiencias" ON public.experiencias_significativas;
CREATE POLICY "Permitir insercion publica experiencias" 
    ON public.experiencias_significativas 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura publica experiencias" ON public.experiencias_significativas;
CREATE POLICY "Permitir lectura publica experiencias" 
    ON public.experiencias_significativas 
    FOR SELECT 
    USING (true);

-- Políticas para Innovaciones Educativas
DROP POLICY IF EXISTS "Permitir insercion publica innovaciones" ON public.innovaciones_educativas;
CREATE POLICY "Permitir insercion publica innovaciones" 
    ON public.innovaciones_educativas 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura publica innovaciones" ON public.innovaciones_educativas;
CREATE POLICY "Permitir lectura publica innovaciones" 
    ON public.innovaciones_educativas 
    FOR SELECT 
    USING (true);
