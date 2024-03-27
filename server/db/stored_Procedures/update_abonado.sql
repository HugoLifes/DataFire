-- Crear un procedimiento almacenado en PostgreSQL
CREATE OR REPLACE FUNCTION actualizar_monto_abonado(nuevo_monto INT, proyecto_id INT) RETURNS VOID AS $$
BEGIN
  UPDATE proyectos
  SET abonado = abonado + nuevo_monto
  WHERE id = proyecto_id;
END;
$$ LANGUAGE plpgsql;
