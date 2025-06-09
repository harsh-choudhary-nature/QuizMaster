import React, { useState } from "react";
import styles from "../styles/YouTube.module.css";

const YouTube = () => {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (type) => {
    if (!link.trim()) {
      setStatus("Please enter a valid YouTube link.");
      return;
    }

    setStatus("Processing...");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/you-tube/download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: link, type }),
        }
      );

      const data = await res.json();

      if (data.success) {
        window.open(data.downloadUrl, "_blank");
        setStatus("Download started!");
      } else {
        setStatus(data.message || "Download failed.");
      }
    } catch (err) {
      setStatus("Server error.");
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>YouTube Downloader</h1>
        <input
          type="text"
          placeholder="Enter YouTube video link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttonGroup}>
          <button
            className={styles.button}
            onClick={() => handleDownload("video+audio")}
          >
            Download Video (All Qualities)
          </button>
          <button
            className={styles.button}
            onClick={() => handleDownload("video")}
          >
            Download Video Only
          </button>
          <button
            className={styles.button}
            onClick={() => handleDownload("audio")}
          >
            Download Audio Only
          </button>
        </div>
        <p className={styles.status}>{isLoading ? "Please wait..." : status}</p>
      </div>
    </div>
  );
};

export default YouTube;
