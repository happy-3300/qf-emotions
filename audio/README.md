# Audio

Drop one file per feeling here, named exactly:

    happy.mp3  grateful.mp3  disturbed.mp3  hopeful.mp3
    anxious.mp3  sad.mp3  overwhelmed.mp3  confused.mp3

It plays when that feeling is opened; a feeling without a file just shows no audio button.
Different file per language? Edit that feeling's `audio` in `js/content.js`.

Keep them light: MP3, mono, 64–96 kbps, 44.1 kHz → about 0.5–0.7 MB per minute.
Aim for under ~1.5 MB each (all eight are downloaded once when the page opens, then work offline).
