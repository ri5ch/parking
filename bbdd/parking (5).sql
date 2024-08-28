-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-02-2024 a las 14:05:30
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `parking`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coche`
--

CREATE TABLE `coche` (
  `id` int(11) NOT NULL,
  `matricula` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `coche`
--

INSERT INTO `coche` (`id`, `matricula`) VALUES
(1, 'AB-1234-CD'),
(2, 'XY-5678-ZW'),
(3, 'GH-9012-IJ'),
(4, 'LM-3456-NO'),
(5, 'RS-7890-PQ'),
(6, 'UV-2345-WX'),
(7, 'CD-6789-EF'),
(8, 'IJ-0123-KL'),
(9, 'OP-4567-RS'),
(10, 'MN-8901-TU'),
(11, 'EFG456XYZ'),
(12, 'HIJ789XYZ'),
(13, 'KLM012XYZ'),
(14, 'NOP345XYZ'),
(15, 'QRS678XYZ'),
(16, 'TUV901XYZ'),
(17, 'WXY234XYZ'),
(18, 'YZA567XYZ'),
(19, 'BCD890XYZ'),
(20, 'CDE123XYZ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id` int(11) NOT NULL,
  `hora_entrada` timestamp NOT NULL DEFAULT current_timestamp(),
  `hora_salida` timestamp NULL DEFAULT NULL,
  `id_coche` int(11) NOT NULL,
  `total` double NOT NULL,
  `id_plaza` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `compra`
--
DELIMITER $$
CREATE TRIGGER `trigger` BEFORE UPDATE ON `compra` FOR EACH ROW BEGIN
    DECLARE minutos INT;
    DECLARE precio_total DOUBLE;

    -- Calcula la diferencia de minutos entre la fecha de entrada y la fecha de salida
    SET minutos = TIMESTAMPDIFF(MINUTE,  OLD.hora_entrada, NEW.hora_salida);

    -- Si el tiempo es menor que un minuto, establecer el precio total en 3 euros
    IF minutos < 1 THEN
        SET precio_total = 3;
    ELSE
        -- Calcula el precio total basado en el costo por hora (3 euros por minuto)
        SET precio_total = minutos * 3;
    END IF;

    -- Asigna el precio total al campo 'total'
    SET NEW.total = precio_total;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plaza`
--

CREATE TABLE `plaza` (
  `id` int(11) NOT NULL,
  `numero_plaza` int(11) NOT NULL,
  `estado` varchar(100) NOT NULL DEFAULT 'libre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plaza`
--

INSERT INTO `plaza` (`id`, `numero_plaza`, `estado`) VALUES
(1, 1, 'libre'),
(2, 2, 'libre'),
(3, 3, 'libre'),
(4, 4, 'libre'),
(5, 5, 'libre'),
(6, 6, 'libre'),
(7, 7, 'libre'),
(8, 8, 'libre'),
(9, 9, 'libre'),
(10, 10, 'libre'),
(11, 11, 'libre'),
(12, 12, 'libre'),
(13, 13, 'libre'),
(14, 14, 'libre'),
(15, 15, 'libre'),
(16, 16, 'libre'),
(17, 17, 'libre'),
(18, 18, 'libre'),
(19, 19, 'libre'),
(20, 20, 'libre');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `coche`
--
ALTER TABLE `coche`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_coche` (`id_coche`),
  ADD KEY `id_plaza` (`id_plaza`);

--
-- Indices de la tabla `plaza`
--
ALTER TABLE `plaza`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `coche`
--
ALTER TABLE `coche`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plaza`
--
ALTER TABLE `plaza`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_coche`) REFERENCES `coche` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`id_plaza`) REFERENCES `plaza` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
