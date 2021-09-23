USE [1086113] 
GO

/*CREATE TABLE flowers (
    flowerId INT IDENTITY NOT NULL PRIMARY KEY,
    flowerType NVARCHAR(100) NOT NULL, 
    flowerColor NVARCHAR(50) , 
    breedingFlower1 INT, 
    breedingFlower2 INT, 
    note NVARCHAR(255)
) 

CREATE TABLE ACloginUser (
    userId INT IDENTITY NOT NULL PRIMARY KEY,
    userName NVARCHAR(50) NOT NULL,
    userEmail NVARCHAR(255) NOT NULL,
    islandName NVARCHAR(50) NOT NULL
)

CREATE TABLE ACloginPassword (
    passwordValue NVARCHAR(255) NOT NULL,
    FK_userId INT NOT NULL,

    CONSTRAINT FK_ACloginPassword_ACloginUser FOREIGN KEY(FK_userId) REFERENCES ACloginUser (userId),

)

CREATE TABLE islandFlowers (
    FK_userId INT NOT NULL,
    FK_flowerId INT NOT NULL,

    CONSTRAINT FK_ACloginUser_islandFlowers FOREIGN KEY(FK_userId) REFERENCES ACloginUser (userId),
    CONSTRAINT FK_flowers_islandFlowers FOREIGN KEY(FK_flowerId) REFERENCES flowers (flowerId)

) */


/* DROP TABLE IF EXISTS 
dbo.flowers 
GO 

ALTER TABLE 
dbo.islandFlowers 
DROP CONSTRAINT IF EXISTS 
FK_flowers_islandFlowers 
GO 


DROP TABLE IF EXISTS 
dbo.islandFlowers 
GO  */

/*
INSERT INTO flowers 
( [flowerType], [flowerColor], [breedingFlower1], [breedingFlower2], [note]) 
VALUES 
	( 'Windflower', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif') , 	
	( 'Windflower', 'Orange', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Windflower', 'Pink', '1', '2', NULL), 
	( 'Windflower', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Windflower', 'Blue', '4', '4', NULL),  
	( 'Windflower', 'Hybrid red', '1', '5', NULL), 
	( 'Windflower', 'Purple', '6', '6', NULL), 
	( 'Cosmos', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Cosmos', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Cosmos', 'Orange', '8', '9', NULL), 
	( 'Cosmos', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Cosmos', 'Pink', '8', '11', NULL), 
	( 'Cosmos', 'Black', '10', '10', NULL), 
	( 'Tulip', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Tulip', 'Black', '14', '14', NULL), 
	( 'Tulip', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Tulip', 'Pink', '14', '16', NULL), 
	( 'Tulip', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Tulip', 'Orange', '14', '18', NULL), 
	( 'Tulip', 'Purple', '19', '19', NULL), 
	( 'Lily', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Lily', 'Black', '21', '21', NULL), 
	( 'Lily', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Lily', 'Orange', '21', '23', NULL), 
	( 'Lily', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Lily', 'Pink', '21', '25', NULL), 
	( 'Mum', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Mum', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Mum', 'Pink', '27', '28', NULL), 
	( 'Mum', 'Purple', '27', '27', NULL), 
	( 'Mum', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Mum', 'Hybrid yellow', '28', '31', NULL), 
	( 'Mum', 'Hybrid purple', '32', '32', NULL), 
	( 'Mum', 'Green', '33', '33', NULL), 
	( 'Pansy', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Pansy', 'Blue', '35', '35', NULL), 
	( 'Pansy', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Pansy', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Pansy', 'Orange', '37', '38', NULL), 
	( 'Pansy', 'Hybrid red', '37', '36', NULL), 
	( 'Pansy', 'Purple', '40', '40', NULL), 
	( 'Hyacinth', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Hyacinth', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Hyacinth', 'Pink', '42', '43', NULL), 
	( 'Hyacinth', 'Blue', '43', '43', NULL), 
	( 'Hyacinth', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Hyacinth', 'Orange', '42', '46', NULL), 
	( 'Hyacinth', 'Blue', '47', '47', NULL), 
	( 'Rose', 'Red', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Rose', 'Black', '49', '49', NULL), 
	( 'Rose', 'White', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Rose', 'Pink', '49', '51', NULL), 
	( 'Rose', 'Yellow', NULL, NULL, 'Obtained via Nooks Cranny or Leif'), 
	( 'Rose', 'Orange', '49', '53', NULL), 
	( 'Rose', 'Purple', '51', '51', NULL), 
	( 'Rose', 'Hybrid pink', '49', '55', NULL), 
	( 'Rose', 'Hybrid red', '56', '53', NULL), 
	( 'Rose', 'Blue', '57', '57', NULL), 
	( 'Rose', 'Gold', NULL, NULL, 'From a black rose watered with a gold watering can') , 
	( 'Lily of the valley', NULL, NULL, NULL, 'Requires a 5 star rating of your island') 
	GO 
*/