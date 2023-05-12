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
INSERT INTO songs (id, song_title, bpm, notes) 
VALUES (2, 'triplets example', 80, 'C4/4t C4/4t C4/4t C4/4t C4/4t C4/4t C4/4n C4/4n C4/4t C4/4t C4/4t C4/4n C4/4t C4/4t C4/4t C4/4n');
INSERT INTO songs (id, song_title, bpm, notes) --by Snarky Puppy: https://youtu.be/1TQoY-w9_x4?t=94
VALUES (3, 'Coney Bear (breakdown riff)', 108, 'C4/8n C4/8n C4/8n C4/8n A3/8n G3/4n A3/8n A3/8n Bb3/8n C4/4n D4/8n C4/8n Bb3/8n A3/4n. Bb3/8n A3/8n G3/8n F3/4n. F3/8n F3/8n F3/8n F3/8n G3/8n Bb3/8n C4/8n');
INSERT INTO songs (id, song_title, bpm, notes) --by Felix Colgrave: https://youtu.be/khn0rV_Svlc?t=242
VALUES (4, 'The Royal crab''s Off-Screen Journey to the Ocean floor', 105, 'F5/4n. C5/4n. A5/4n F5/4n. C5/4n. C5/8n D5/8n Eb5/8n D5/8n Eb5/8n D5/8n Eb5/4n Eb5/8n D5/8n C5/1n F5/4n. C5/4n. A5/4n F5/4n. C5/4n. C5/8n D5/8n E5/8n E5/8n D5/8n E5/4n E5/8n F5/4n C6/4n G5/4n C5/2n D6/8n D6/8n C6/8n D6/4n Bb5/4n. C6/8n C6/8n Bb5/8n C6/4n A5/4n. Bb5/4n A5/4n G5/4n F5/4n E5/4n. C5/4n.. F5/4n. C5/4n. D6/8n Bb5/8n C6/4n D6/4n A5/4n E5/8n D5/8n C5/8n F5/8n G5/8n A5/4n G5/8n E5/4n F5/2n');
INSERT INTO songs (id, song_title, bpm, notes) --by J.S. Bach: https://www.youtube.com/watch?v=5AFfCY1Qp24
VALUES (5, 'Contrapunctus IX (shortened)', 110, '0/4n D4/4n D5/2n. Db5/8n B4/8n A4/8n G4/8n F4/8n E4/8n D4/8n Db4/8n D4/8n E4/8n F4/8n D4/8n E4/8n f4/8n g4/8n gb4/8n g4/8n a4/8n bb4/8n g4/8n a4/8n bb4/8n bb4/16n c5/16n bb4/16n a4/4n. a4/8n g4/8n a4/8n bb4/8n d5/8n c5/8n bb4/8n c5/8n bb4/8n a4/8n g4/8n f4/8n bb4/8n a4/8n g4/8n a4/8n g4/8n f4/8n e4/8n d4/8n g4/8n f4/8n e4/8n f4/8n e4/8n d4/8n c4/8n b3/4n e4/4n ab4/4n e4/4n c4/8n d4/8n c4/8n b3/8n a3/4n bb4/4n f4/8n g4/8n f4/8n e4/8n d4/4n d5/4n fb4/4n g4/8n b4/8n c5/4n bb4/4n a4/2n. ab4/4n a4/2n. e4/4n f4/2n. f4/4n e4/2n. g4/2n f4/8n g4/8n a4/2n d4/2n. g4/4n e4/4n f4/8n g4/8n f4/4n e4/4n d4/2n');