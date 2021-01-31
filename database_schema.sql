-- --------------------------------------------------------
-- Server version:               10.5.8-MariaDB-1:10.5.8+maria~focal - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for insta_feed
CREATE DATABASE IF NOT EXISTS `insta_feed` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `insta_feed`;


-- Dumping structure for table insta_feed.credentials
DROP TABLE IF EXISTS `credentials`;
CREATE TABLE IF NOT EXISTS `credentials` (
                                             `id` int(11) NOT NULL AUTO_INCREMENT,
                                             `user_id` varchar(50) NOT NULL,
                                             `created_at` int(11) NOT NULL,
                                             `updated_at` int(11) NOT NULL,
                                             `deleted_at` int(11) DEFAULT NULL,
                                             PRIMARY KEY (`id`),
                                             UNIQUE KEY `user_id_deleted_at` (`user_id`,`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table insta_feed.access_token
DROP TABLE IF EXISTS `access_token`;
CREATE TABLE IF NOT EXISTS `access_token` (
                                              `id` int(11) NOT NULL AUTO_INCREMENT,
                                              `credentials_id` int(11) NOT NULL,
                                              `access_token` varchar(255) NOT NULL,
                                              `token_type` varchar(50) NOT NULL,
                                              `issued_at` int(11) NOT NULL,
                                              `expires_in` int(11) NOT NULL,
                                              `expires_at` int(11) NOT NULL,
                                              PRIMARY KEY (`id`),
                                              KEY `FK_access_token_credentials` (`credentials_id`),
                                              CONSTRAINT `FK_access_token_credentials` FOREIGN KEY (`credentials_id`) REFERENCES `credentials` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table insta_feed.media
DROP TABLE IF EXISTS `media`;
CREATE TABLE IF NOT EXISTS `media` (
                                       `id` int(11) NOT NULL AUTO_INCREMENT,
                                       `credentials_id` int(11) NOT NULL,
                                       `ig_id` varchar(50) NOT NULL,
                                       `media_type` varchar(50) NOT NULL,
                                       `media_url` text NOT NULL,
                                       `permalink` varchar(255) NOT NULL,
                                       `timestamp` varchar(50) NOT NULL,
                                       `created_at` int(11) NOT NULL,
                                       `updated_at` int(11) NOT NULL,
                                       `deleted_at` int(11) DEFAULT NULL,
                                       PRIMARY KEY (`id`),
                                       UNIQUE KEY `ig_id_deleted_at` (`ig_id`,`deleted_at`),
                                       KEY `FK_media_credentials` (`credentials_id`),
                                       CONSTRAINT `FK_media_credentials` FOREIGN KEY (`credentials_id`) REFERENCES `credentials` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
