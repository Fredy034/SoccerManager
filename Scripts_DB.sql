CREATE DATABASE SoccerManager;
GO
USE SoccerManager;
GO

-- SQL script to create tables and insert sample data for a soccer management system
CREATE TABLE TBL_Team (
  PK_IdTeam INT IDENTITY(1,1) PRIMARY KEY,
  SName NVARCHAR(100) NOT NULL,
  SCountry NVARCHAR(100) NULL,
  SCity NVARCHAR(100) NULL,
  SShieldUrl NVARCHAR(255) NULL,
  DCreationDate DATETIME NOT NULL DEFAULT GETDATE(),
  BActive BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE TBL_Match (
  PK_IdMatch INT IDENTITY(1,1) PRIMARY KEY,
  DMatchDate DATETIME NOT NULL,
  FK_HomeTeam INT NOT NULL,
  FK_AwayTeam INT NOT NULL,
  IHomeTeamScore INT NULL,
  IAwayTeamScore INT NULL,
  SStatus NVARCHAR(50) NOT NULL CONSTRAINT CHK_MatchStatus CHECK (SStatus IN ('Programado', 'Jugado', 'Suspendido', 'Cancelado')),
  DCreationDate DATETIME NOT NULL DEFAULT GETDATE(),
  BActive BIT NOT NULL DEFAULT 1,
  CONSTRAINT FK_HomeTeam FOREIGN KEY (FK_HomeTeam) REFERENCES TBL_Team(PK_IdTeam) ON DELETE NO ACTION,
  CONSTRAINT FK_AwayTeam FOREIGN KEY (FK_AwayTeam) REFERENCES TBL_Team(PK_IdTeam) ON DELETE NO ACTION,
  CONSTRAINT CHK_DifferentTeams CHECK (FK_HomeTeam <> FK_AwayTeam)
);
GO

CREATE TABLE TBL_Goal (
  PK_IdGoal INT IDENTITY(1,1) PRIMARY KEY,
  FK_Match INT NOT NULL,
  FK_Team INT NOT NULL,
  SScorer NVARCHAR(200) NULL,
  IMinute INT NULL CHECK (IMinute > 0),
  DCreationDate DATETIME NOT NULL DEFAULT GETDATE(),
  BActive BIT NOT NULL DEFAULT 1,
  CONSTRAINT FK_Match FOREIGN KEY (FK_Match) REFERENCES TBL_Match(PK_IdMatch) ON DELETE CASCADE,
  CONSTRAINT FK_Team FOREIGN KEY (FK_Team) REFERENCES TBL_Team(PK_IdTeam) ON DELETE NO ACTION
);
GO

-- Indexes for performance optimization
CREATE INDEX IDX_Match_Date ON TBL_Match(DMatchDate);
CREATE INDEX IDX_Match_HomeTeam ON TBL_Match(FK_HomeTeam);
CREATE INDEX IDX_Match_AwayTeam ON TBL_Match(FK_AwayTeam);

-- Sample data insertion
INSERT INTO TBL_Team (SName, SCountry, SCity) VALUES
('Atlético Nacional', 'Colombia', 'Medellín'),
('Millonarios FC', 'Colombia', 'Bogotá'),
('América de Cali', 'Colombia', 'Cali'),
('Deportivo Cali', 'Colombia', 'Cali'),
('Independiente Santa Fe', 'Colombia', 'Bogotá'),
('Junior FC', 'Colombia', 'Barranquilla'),
('Once Caldas', 'Colombia', 'Manizales'),
('Deportes Tolima', 'Colombia', 'Ibagué'),
('La Equidad', 'Colombia', 'Bogotá'),
('Envigado FC', 'Colombia', 'Envigado');
GO 

INSERT INTO TBL_Match (DMatchDate, FK_HomeTeam, FK_AwayTeam, SStatus) VALUES
(DATEADD(DAY, 1, GETDATE()), 1, 2, 'Programado'),
(DATEADD(DAY, 1, GETDATE()), 3, 4, 'Programado'),
(DATEADD(DAY, 1, GETDATE()), 5, 6, 'Programado'),
(DATEADD(DAY, 2, GETDATE()), 7, 8, 'Programado'),
(DATEADD(DAY, 3, GETDATE()), 9, 10, 'Programado');
GO

INSERT INTO TBL_Goal (FK_Match, FK_Team, SScorer, IMinute) VALUES
(1, 1, 'Juan Pérez', 23),
(1, 2, 'Carlos Gómez', 45),
(2, 3, 'Luis Martínez', 12),
(2, 4, 'Andrés Rodríguez', 67),
(3, 5, 'Diego Sánchez', 34);
GO