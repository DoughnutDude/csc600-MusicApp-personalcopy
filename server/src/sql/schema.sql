DROP TABLE IF EXISTS songs;--temporary for song dev. Comment out if unneeded

CREATE TABLE songs (
	id int NOT NULL PRIMARY KEY,
	song_title text NOT NULL,
	bpm int NOT NULL DEFAULT 120,
	notes varchar NOT NULL
);

--TODO: We might consider eventually programming a way to tie notes together, (e.g. slides and slurs).
--Each note in a song has 2 parts and will be stored as 'Pitch/Duration'.
--(e.g. 'C4/4n' means a middle C, played for a quarter note's duration)
--Refer to https://tonejs.github.io/docs/14.7.77/type/Subdivision for duration format.
INSERT INTO songs (id, song_title, notes) 
VALUES (1, 'Ode to Joy (Dubstep Remix)', 'E4/4n E4/4n F4/4n G4/4n G4/4n F4/4n E4/4n D4/4n C4/4n C4/4n D4/4n E4/4n E4/4n. D4/8n D4/4n');
INSERT INTO songs (id, song_title, notes) 
VALUES (2, 'triplets example', 'C4/4t C4/4t C4/4t C4/4t C4/4t C4/4t C4/4n C4/4n C4/4t C4/4t C4/4t C4/4n C4/4t C4/4t C4/4t C4/4n');
INSERT INTO songs (id, song_title, bpm, notes) --by Snarky Puppy: https://youtu.be/1TQoY-w9_x4?t=94
VALUES (3, 'Coney Bear (breakdown part)', 110, 'C4/8n C4/8n C4/8n C4/8n A3/8n G3/4n A3/8n A3/8n Bb3/8n C4/4n D4/8n C4/8n Bb3/8n A3/4n. Bb3/8n A3/8n G3/8n F3/4n. F3/8n F3/8n F3/8n F3/8n G3/8n Bb3/8n C4/8n');