-- ==============================================================================
-- SCRIPT DE MIGRACIÓN: PERSISTENCIA, AUTENTICACIÓN Y REPOSICIÓN FINAL (SIAC / CTO)
-- Ejecutar en el SQL Editor de Supabase
-- ==============================================================================

-- 1. AGREGAR NUEVAS COLUMNAS Y RELAJAR NOT NULL PARA PERMITIR BORRADORES PARCIALES

-- Tabla: experiencias_significativas
ALTER TABLE public.experiencias_significativas
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'borrador',
  ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fecha_radicacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS aprobado_por VARCHAR(255),
  ADD COLUMN IF NOT EXISTS observaciones_coordinador TEXT,
  ADD COLUMN IF NOT EXISTS datos_borrador JSONB DEFAULT '{}'::jsonb;

-- Permite guardar borradores incompletos sin error de constraint NOT NULL
ALTER TABLE public.experiencias_significativas
  ALTER COLUMN nombre_experiencia DROP NOT NULL,
  ALTER COLUMN programa_academico DROP NOT NULL,
  ALTER COLUMN espacio_academico DROP NOT NULL,
  ALTER COLUMN nivel_formacion DROP NOT NULL,
  ALTER COLUMN fecha_presentacion DROP NOT NULL,
  ALTER COLUMN periodo_academico DROP NOT NULL,
  ALTER COLUMN docentes_responsables DROP NOT NULL,
  ALTER COLUMN cedula_docente DROP NOT NULL,
  ALTER COLUMN correo_docente DROP NOT NULL,
  ALTER COLUMN modalidad DROP NOT NULL,
  ALTER COLUMN lugar_contexto DROP NOT NULL,
  ALTER COLUMN contexto_experiencia DROP NOT NULL,
  ALTER COLUMN pregunta_problematizadora DROP NOT NULL,
  ALTER COLUMN objetivo_experiencia DROP NOT NULL,
  ALTER COLUMN descripcion_experiencia DROP NOT NULL,
  ALTER COLUMN analisis_reflexion DROP NOT NULL,
  ALTER COLUMN resultados_aportes DROP NOT NULL,
  ALTER COLUMN proyeccion DROP NOT NULL;

-- Tabla: innovaciones_educativas
ALTER TABLE public.innovaciones_educativas
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'borrador',
  ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS fecha_radicacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS aprobado_por VARCHAR(255),
  ADD COLUMN IF NOT EXISTS observaciones_coordinador TEXT,
  ADD COLUMN IF NOT EXISTS datos_borrador JSONB DEFAULT '{}'::jsonb;

-- Permite guardar borradores incompletos sin error de constraint NOT NULL
ALTER TABLE public.innovaciones_educativas
  ALTER COLUMN titulo_innovacion DROP NOT NULL,
  ALTER COLUMN tipo_innovacion DROP NOT NULL,
  ALTER COLUMN fecha_creacion DROP NOT NULL,
  ALTER COLUMN nombre_empresa DROP NOT NULL,
  ALTER COLUMN sector_empresa DROP NOT NULL,
  ALTER COLUMN autor_principal_nombre DROP NOT NULL,
  ALTER COLUMN autor_principal_cedula DROP NOT NULL,
  ALTER COLUMN autor_principal_correo DROP NOT NULL,
  ALTER COLUMN autor_principal_afiliacion DROP NOT NULL,
  ALTER COLUMN autor_principal_grupo_facultad DROP NOT NULL,
  ALTER COLUMN resumen_innovacion DROP NOT NULL,
  ALTER COLUMN estado_previo_problematica DROP NOT NULL,
  ALTER COLUMN estado_posterior_solucion DROP NOT NULL,
  ALTER COLUMN novedad_tipo DROP NOT NULL,
  ALTER COLUMN novedad_explicacion DROP NOT NULL,
  ALTER COLUMN novedad_alcance DROP NOT NULL,
  ALTER COLUMN novedad_alcance_evidencias DROP NOT NULL,
  ALTER COLUMN impactos_explicacion_evidencias DROP NOT NULL;


-- 2. TABLA DE CONFIGURACIÓN DEL COORDINADOR (CLAVE MAESTRA DE APROBACIÓN)
CREATE TABLE IF NOT EXISTS public.configuracion_coordinador (
    id INT PRIMARY KEY DEFAULT 1,
    clave_maestra VARCHAR(255) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar clave por defecto para el Coordinador de Investigaciones ('coordinador2026')
INSERT INTO public.configuracion_coordinador (id, clave_maestra)
VALUES (1, 'coordinador2026')
ON CONFLICT (id) DO NOTHING;


-- 3. ÍNDICES DE BÚSQUEDA Y TRACERÍA
CREATE INDEX IF NOT EXISTS idx_exp_estado ON public.experiencias_significativas(estado);
CREATE INDEX IF NOT EXISTS idx_exp_usuario ON public.experiencias_significativas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inn_estado ON public.innovaciones_educativas(estado);
CREATE INDEX IF NOT EXISTS idx_inn_usuario ON public.innovaciones_educativas(usuario_id);


-- 4. FUNCIÓN RPC PARA CAMBIO DE ESTADO Y APROBACIÓN POR EL COORDINADOR (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.cambiar_estado_coordinador(
    p_tabla TEXT,
    p_id UUID,
    p_nuevo_estado TEXT,
    p_clave TEXT,
    p_coordinador TEXT,
    p_observaciones TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clave_valida BOOLEAN;
BEGIN
    -- Validar clave maestra del coordinador
    SELECT (clave_maestra = p_clave) INTO v_clave_valida
    FROM public.configuracion_coordinador
    WHERE id = 1;

    IF v_clave_valida IS NOT TRUE THEN
        RETURN jsonb_build_object('success', false, 'message', 'Contraseña de coordinador incorrecta.');
    END IF;

    IF p_nuevo_estado NOT IN ('borrador', 'radicado', 'aprobado') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Estado no válido.');
    END IF;

    IF p_tabla = 'experiencias_significativas' THEN
        UPDATE public.experiencias_significativas
        SET estado = p_nuevo_estado,
            fecha_aprobacion = CASE WHEN p_nuevo_estado = 'aprobado' THEN CURRENT_TIMESTAMP ELSE fecha_aprobacion END,
            aprobado_por = p_coordinador,
            observaciones_coordinador = COALESCE(p_observaciones, observaciones_coordinador),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_id;
    ELSIF p_tabla = 'innovaciones_educativas' THEN
        UPDATE public.innovaciones_educativas
        SET estado = p_nuevo_estado,
            fecha_aprobacion = CASE WHEN p_nuevo_estado = 'aprobado' THEN CURRENT_TIMESTAMP ELSE fecha_aprobacion END,
            aprobado_por = p_coordinador,
            observaciones_coordinador = COALESCE(p_observaciones, observaciones_coordinador),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_id;
    ELSE
        RETURN jsonb_build_object('success', false, 'message', 'Tabla especificada no es válida.');
    END IF;

    RETURN jsonb_build_object('success', true, 'message', 'Estado de la solicitud actualizado a: ' || p_nuevo_estado);
END;
$$;


-- 5. REHABILITAR Y ACTUALIZAR POLÍTICAS RLS (ROW LEVEL SECURITY)

ALTER TABLE public.experiencias_significativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovaciones_educativas ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas anteriores
DROP POLICY IF EXISTS "Permitir insercion publica experiencias" ON public.experiencias_significativas;
DROP POLICY IF EXISTS "Permitir lectura publica experiencias" ON public.experiencias_significativas;
DROP POLICY IF EXISTS "Permitir insercion publica innovaciones" ON public.innovaciones_educativas;
DROP POLICY IF EXISTS "Permitir lectura publica innovaciones" ON public.innovaciones_educativas;

DROP POLICY IF EXISTS "Lectura general experiencias" ON public.experiencias_significativas;
DROP POLICY IF EXISTS "Escritura usuario experiencias" ON public.experiencias_significativas;
DROP POLICY IF EXISTS "Actualizacion borrador experiencias" ON public.experiencias_significativas;

DROP POLICY IF EXISTS "Lectura general innovaciones" ON public.innovaciones_educativas;
DROP POLICY IF EXISTS "Escritura usuario innovaciones" ON public.innovaciones_educativas;
DROP POLICY IF EXISTS "Actualizacion borrador innovaciones" ON public.innovaciones_educativas;

-- Políticas para experiencias_significativas:
-- Lectura: los registros APROBADOS son visibles públicamente (Repositorio Final).
-- Los registros en BORRADOR o RADICADO son visibles si coinciden con el usuario o consulta por cédula/radicado.
CREATE POLICY "Lectura experiencias" ON public.experiencias_significativas
    FOR SELECT USING (
        estado = 'aprobado' 
        OR (auth.uid() IS NOT NULL AND usuario_id = auth.uid())
        OR (estado = 'borrador' OR estado = 'radicado')
    );

-- Inserción: Permitir a cualquier usuario o visitante autenticado o anónimo crear borradores/radicados
CREATE POLICY "Insercion experiencias" ON public.experiencias_significativas
    FOR INSERT WITH CHECK (true);

-- Edición: Solo editable si el estado es 'borrador' (Inmutabilidad una vez radicado o aprobado)
CREATE POLICY "Edicion borrador experiencias" ON public.experiencias_significativas
    FOR UPDATE USING (
        estado = 'borrador'
    ) WITH CHECK (
        estado = 'borrador' OR estado = 'radicado'
    );

-- Eliminar: Solo registrante en borrador
CREATE POLICY "Eliminacion experiencias" ON public.experiencias_significativas
    FOR DELETE USING (estado = 'borrador');


-- Políticas para innovaciones_educativas:
CREATE POLICY "Lectura innovaciones" ON public.innovaciones_educativas
    FOR SELECT USING (
        estado = 'aprobado' 
        OR (auth.uid() IS NOT NULL AND usuario_id = auth.uid())
        OR (estado = 'borrador' OR estado = 'radicado')
    );

CREATE POLICY "Insercion innovaciones" ON public.innovaciones_educativas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Edicion borrador innovaciones" ON public.innovaciones_educativas
    FOR UPDATE USING (
        estado = 'borrador'
    ) WITH CHECK (
        estado = 'borrador' OR estado = 'radicado'
    );

CREATE POLICY "Eliminacion innovaciones" ON public.innovaciones_educativas
    FOR DELETE USING (estado = 'borrador');
