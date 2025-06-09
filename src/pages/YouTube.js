import React, { useState } from "react";
import styles from "../styles/YouTube.module.css";

const YouTube = () => {
  const [link, setLink] = useState("");
  const [videoId, setVideoId] = useState("");
  const [formats, setFormats] = useState({
    videoAudio: [],
    videoOnly: [],
    audioOnly: [],
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /(?:youtu\.be\/|youtube\.com.*v=)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };

  const handleProceed = async () => {
    const id = extractVideoId(link);
    if (!id) {
      setStatus("Invalid YouTube link.");
      return;
    }

    setStatus("Fetching qualities...");
    setIsLoading(true);
    setVideoId(id);

    try {
      const res = await fetch("http://localhost:5000/formats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const data = await res.json();

      if (data.success) {
        setFormats(data.formats);
        setStatus("Choose a format to download.");
      } else {
        setStatus(data.message || "Could not fetch formats.");
      }
    } catch (err) {
      setStatus("Server error.");
    }

    setIsLoading(false);
  };

  const downloadFromFormat = (formatId) => {
    if (!formatId) return;
    window.open(
      `http://localhost:5000/downloadByFormat?url=${encodeURIComponent(
        link
      )}&format=${formatId}`,
      "_blank"
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>YouTube Downloader</h1>
        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Enter YouTube video link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={styles.input}
          />
          <button
            className={styles.proceedButton}
            onClick={handleProceed}
            title="Proceed"
          >
            ➡
          </button>
        </div>

        {videoId && (
          <iframe
            className={styles.iframe}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video preview"
            allowFullScreen
          />
        )}

        {formats.videoAudio.length > 0 && (
          <div className={styles.section}>
            <h3>Video with Audio</h3>
            <select
              className={styles.dropdown}
              onChange={(e) => downloadFromFormat(e.target.value)}
            >
              <option value="">Select quality...</option>
              {formats.videoAudio.map((fmt, i) => (
                <option key={i} value={fmt.format_id}>
                  {fmt.resolution} - {fmt.ext} -{" "}
                  {fmt.filesize || "unknown size"}
                </option>
              ))}
            </select>
          </div>
        )}

        {formats.videoOnly.length > 0 && (
          <div className={styles.section}>
            <h3>Video Only</h3>
            <select
              className={styles.dropdown}
              onChange={(e) => downloadFromFormat(e.target.value)}
            >
              <option value="">Select quality...</option>
              {formats.videoOnly.map((fmt, i) => (
                <option key={i} value={fmt.format_id}>
                  {fmt.resolution} - {fmt.ext} -{" "}
                  {fmt.filesize || "unknown size"}
                </option>
              ))}
            </select>
          </div>
        )}

        {formats.audioOnly.length > 0 && (
          <div className={styles.section}>
            <h3>Audio Only</h3>
            <select
              className={styles.dropdown}
              onChange={(e) => downloadFromFormat(e.target.value)}
            >
              <option value="">Select quality...</option>
              {formats.audioOnly.map((fmt, i) => (
                <option key={i} value={fmt.format_id}>
                  {fmt.abr} - {fmt.ext} - {fmt.filesize || "unknown size"}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className={styles.status}>{isLoading ? "Please wait..." : status}</p>
      </div>
    </div>
  );
};

export default YouTube;
