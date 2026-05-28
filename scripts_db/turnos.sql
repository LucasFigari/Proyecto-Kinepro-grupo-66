//verifica el id del usuario con tu tabla, lo mismo con area
INSERT INTO turnos (fecha, horario, "isDisponible", "areaId", "usuarioId") VALUES
('2026-06-01', '08:00:00', TRUE, 1, 1),
('2026-06-01', '09:00:00', FALSE, 1, 1),
('2026-06-01', '10:00:00', TRUE, 2, 1),
('2026-06-01', '11:00:00', FALSE, 2, 1),
('2026-06-02', '14:00:00', TRUE, 3, 1),
('2026-06-02', '15:00:00', TRUE, 1, 1),
('2026-06-02', '16:00:00', FALSE, 3, 1),
('2026-06-03', '08:30:00', TRUE, 2, 1),
('2026-06-03', '09:30:00', FALSE, 1, 1),
('2026-06-03', '10:30:00', TRUE, 3, 1);