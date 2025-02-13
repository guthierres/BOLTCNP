-- Remove the specified fields from the presbiteros table
ALTER TABLE public.presbiteros
DROP COLUMN IF EXISTS redes_sociais,
DROP COLUMN IF EXISTS paroquia,
DROP COLUMN IF EXISTS pais_origem;

