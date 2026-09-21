CREATE TABLE Gestion_Rebuts_References_Pieces_New
(id INT IDENTITY(1,1) PRIMARY KEY,
 reference VARCHAR(50),
 designation VARCHAR(50));

CREATE TABLE Gestion_Rebuts_Secteurs_New
(id INT IDENTITY(1,1) PRIMARY KEY,
 secteur VARCHAR(50));

INSERT INTO Gestion_Rebuts_References_Pieces_New (reference, designation)
SELECT reference, designation
FROM Gestion_Rebuts_References_Pieces;

INSERT INTO Gestion_Rebuts_Secteurs_New (secteur)
SELECT secteur
FROM Gestion_Rebuts_Secteurs;

DROP TABLE Gestion_Rebuts_References_Pieces
DROP TABLE Gestion_Rebuts_Secteurs

exec sp_rename 'Gestion_Rebuts_References_Pieces_New', 'Gestion_Rebuts_References_Pieces';
exec sp_rename 'Gestion_Rebuts_Secteurs_New', 'Gestion_Rebuts_Secteurs';

CREATE TABLE Gestion_Rebuts_New
(id INT IDENTITY(1,1) PRIMARY KEY,
 date date,
 ordre_fabrication VARCHAR(50),
 id_secteur INT,
 id_reference_piece INT,
 quantite INT,
 visa VARCHAR(50),
 commentaire VARCHAR(50),
 FOREIGN KEY (id_reference_piece) REFERENCES Gestion_Rebuts_References_Pieces(id),
 FOREIGN KEY (id_secteur) REFERENCES Gestion_Rebuts_Secteurs(id)
);

INSERT INTO Gestion_Rebuts_New (date, ordre_fabrication, id_secteur, id_reference_piece, quantite, visa, commentaire)
SELECT date, ordre_fabrication, id_secteur, id_reference_piece, quantite, visa, commentaire
FROM Gestion_Rebuts;

DROP TABLE Gestion_Rebuts_New
exec sp_rename 'Gestion_Rebuts_New', 'Gestion_Rebuts';


MERGE dbo.Gestion_Rebuts_Top5 AS top5
    USING (VALUES (1, 'Septembre', 100)) AS source (id_ref, date, quantite)
    ON (top5.id_ref = source.id_ref AND top5.date = source.date)
    WHEN MATCHED THEN
UPDATE SET top5.quantite = top5.quantite + source.quantite
    WHEN NOT MATCHED THEN
INSERT (id_ref, date, quantite)
VALUES (source.id_ref, source.date, source.quantite);
