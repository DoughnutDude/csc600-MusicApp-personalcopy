DROP TABLE IF EXISTS songs;--temporary for song dev. Comment out if unneeded

CREATE TABLE songs (
	id int NOT NULL PRIMARY KEY,
	song_title text NOT NULL,
	notes varchar NOT NULL
);


--Each note in a song has 2 parts and will be stored as 'Pitch/Duration'.
--Refer to https://tonejs.github.io/docs/14.7.77/type/Subdivision for duration format.
INSERT INTO songs (id, song_title, notes) 
VALUES (1, 'Ode to Joy (Dubstep Remix)', 'E4/4n E4/4n F4/4n G4/4n G4/4n F4/4n E4/4n D4/4n C4/4n C4/4n D4/4n E4/4n E4/4n. D4/8n D4/2n');
INSERT INTO songs (id, song_title, notes) 
VALUES (2, 'triplets example', 'C4/4t C4/4t C4/4t C4/4t C4/4t C4/4t C4/4n C4/4n C4/4t C4/4t C4/4t C4/4n C4/4t C4/4t C4/4t C4/4n');
INSERT INTO songs (id, song_title, notes) --by Snarky Puppy: https://youtu.be/1TQoY-w9_x4?t=94
VALUES (3, 'Coney Bear (breakdown part)', 'C4/8n C4/8n C4/8n C4/8n A3/8n G3/4n A3/8n A3/8n Bb3/8n C4/4n D4/8n C4/8n Bb3/8n A3/4n. Bb3/8n A3/8n G3/8n F3/4n. F3/8n F3/8n F3/8n F3/8n G3/8n Bb3/8n C4/4n');