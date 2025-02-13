-- Update the presbiteros table with new fields and adjust existing ones
ALTER TABLE public.presbiteros
ADD COLUMN IF NOT EXISTS foto_perfil TEXT,
ADD COLUMN IF NOT EXISTS documento_ordenacao TEXT,
ADD COLUMN IF NOT EXISTS redes_sociais TEXT,
ADD COLUMN IF NOT EXISTS tipo_servico TEXT,
ADD COLUMN IF NOT EXISTS nome_paroquia TEXT,
ADD COLUMN IF NOT EXISTS data_provisao DATE,
ADD COLUMN IF NOT EXISTS tipo_presbitero TEXT,
ADD COLUMN IF NOT EXISTS pais_origem TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Ensure the aprovado column exists and has a default value
ALTER TABLE public.presbiteros
ADD COLUMN IF NOT EXISTS aprovado BOOLEAN DEFAULT FALSE;

-- Update existing rows to set aprovado to true if it's null
UPDATE public.presbiteros
SET aprovado = TRUE
WHERE aprovado IS NULL;

-- Add a check constraint to ensure aprovado is not null
ALTER TABLE public.presbiteros
ALTER COLUMN aprovado SET NOT NULL;

-- Create an index on nome_completo for faster searches
CREATE INDEX IF NOT EXISTS idx_presbiteros_nome_completo ON public.presbiteros (nome_completo);

-- Create an index on aprovado for faster filtering
CREATE INDEX IF NOT EXISTS idx_presbiteros_aprovado ON public.presbiteros (aprovado);

