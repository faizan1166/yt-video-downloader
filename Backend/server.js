const express = require("express");
const cors = require("cors")
const app = express();
const ytdl = require("ytdl-core");
const sanitize = require("sanitize-filename");

function bytesToMB(bytes) {
  if (typeof bytes !== "string") return "Unknown";
  return (bytes / (1024 * 1024)).toFixed(2);
}
app.use(cors())
app.get("/videoInfo", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const info = await ytdl.getInfo(videoUrl);
    const videoId = info.videoDetails.videoId;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const formats = ytdl
      .filterFormats(info.formats, "video")
      .concat(ytdl.filterFormats(info.formats, "audio"))
      .map((format) => ({
        quality: format.qualityLabel || format.audioQuality || "Unknown",
        url: format.url,
        mimeType: format.mimeType,
        itag: format.itag,
        size: bytesToMB(format.contentLength),
        hasAudio: Boolean(format.audioBitrate || format.audioQuality),
      }));

    const videoDetails = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
      embedUrl,
      formats,
    };

    res.json(videoDetails);
  } catch (err) {
    console.error("Error fetching video details:", err);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
});

// Endpoint to download video based on selected quality

// app.get("/download", async (req, res) => {
//   try {
//     const { url, itag } = req.query; // Get video URL and selected itag (quality) from query parameters

//     // Validate URL parameter
//     const url2 = String(req.query.url); // Explicitly convert to string

//     if (typeof url !== "string") {
//       throw new Error("Invalid URL parameter");
//     }

//     // Fetch video information asynchronously and get formats array
//     const info = await ytdl.getInfo(url2);
//     const formats = info.formats;

//     // Choose the format based on itag (quality)
//     const format = ytdl.chooseFormat(formats, { quality: itag });

//     if (!format) {
//       throw new Error(`No format found for itag ${itag}`);
//     }

//     // Set headers for file download
//     res.header(
//       "Content-Disposition",
//       `attachment; filename="${sanitize(format.title)}.mp4"`
//     );

//     // Pipe video stream to response
//     ytdl(url2, { format }).pipe(res);
//   } catch (err) {
//     console.error("Error downloading video:", err);
//     res.status(500).send("Failed to download video");
//   }
// });
app.get("/download", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    console.log(videoUrl, itag);
    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = sanitize(info.videoDetails.title);

    const format = ytdl.chooseFormat(info.formats, { quality: itag });
    if (!format) {
      return res.status(400).send('Format not found');
    }

    const isAudioOnly = format.mimeType.includes("audio");
    const fileExtension = isAudioOnly ? "mp3" : "mp4";
    console.log("fileExtension", fileExtension);

    const headers = {
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(videoTitle)}.${fileExtension}`,
      "Content-Type": format.mimeType,
    };

    const contentLength = format.contentLength;
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    res.set(headers);
    ytdl(videoUrl, { format })
      .on('error', (err) => {
        console.error('Error downloading video:', err);
        res.status(500).send('Failed to download video');
      })
      .pipe(res); 
  } catch (err) {
    console.error("Error downloading video:", err);
    res.status(500).send("Failed to download video");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
