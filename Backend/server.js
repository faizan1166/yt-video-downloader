const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const sanitize = require("sanitize-filename");

function bytesToMB(bytes) {
  if (typeof bytes !== "string") return "Unknown";
  return (bytes / (1024 * 1024)).toFixed(2);
}

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

app.get("/download", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    console.log(videoUrl, itag);
    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = sanitize(info.videoDetails.title);

    const format = ytdl.chooseFormat(info.formats, { quality: itag });
    if (!format) {
      return res.status(400).send("Format not found");
    }

    const isAudioOnly = format.mimeType.includes("audio");
    const fileExtension = isAudioOnly ? "mp3" : "mp4";
    console.log("fileExtension", fileExtension);

    const headers = {
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
        videoTitle
      )}.${fileExtension}`,
      "Content-Type": format.mimeType,
    };

    res.set(headers);
    ytdl(videoUrl, { format }).pipe(res);
  } catch (err) {
    console.error("Error downloading video:", err);
    res.status(500).send("Failed to download video");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
