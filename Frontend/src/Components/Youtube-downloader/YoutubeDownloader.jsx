import React, { useState } from "react";
import axios from "axios";
import { LinkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Tabs from "../Tabs/Tabs";

function YoutubeDownloader() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/videoInfo?url=${videoUrl}`
      );
      setVideoDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching video details:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-center mb-5">
        <img
          className="h-6 sm:h-6 md:h-10 w-auto"
          src="/Images/logo.png"
          alt="TubeVault"
        />
      </div>
      <div className="text-center bg-orange-500 p-6 rounded-lg yt-downloader-container">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LinkIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="block w-full rounded-none rounded-l-md border-0 sm:py-3 md:py-4 xl:py-5 pl-12 text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-5  py-2 text-sm font-semibold text-white yt-send-button"
            onClick={fetchVideoDetails}
          >
            <MagnifyingGlassIcon
              className="-ml-0.5 h-6 w-6 text-white"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {loading && (
        <div className="animate-pulse mt-5">
          <div className="h-48 bg-gray-300 rounded-md"></div>
          <div className="mt-4 h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="mt-4 h-40 bg-gray-300 rounded-md"></div>
        </div>
      )}

      {videoDetails && !loading && (
        <div>
          <div className="rounded overflow-hidden shadow-md">
            <div className="iframe-container">
              <iframe
                src={videoDetails?.embedUrl}
                title={videoDetails?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                {videoDetails?.title}
              </div>
              <Tabs videoDetails={videoDetails} videoUrl={videoUrl} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default YoutubeDownloader;
