import {
  ArrowDownTrayIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

export default function Tabs({ videoDetails, videoUrl }) {
  const [currentTab, setCurrentTab] = useState("Video");
  const [details, setDetails] = useState({
    videoFormats: [],
    audioFormats: [],
  });
  const tabs = [{ name: "Video" }, { name: "Audio" }];
  console.log(videoDetails);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    if (videoDetails) {
      const videoFormats = videoDetails.formats.filter((format) =>
        format.mimeType.includes("video/mp4")
      );
      const audioFormats = videoDetails.formats.filter((format) =>
        format.mimeType.includes("audio")
      );
      setDetails({ videoFormats, audioFormats });
    }
  }, [videoDetails]);

  return (
    <div>
      <div className=" mt-5 overflow-auto">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              onClick={() => setCurrentTab(tab.name)}
              className={classNames(
                currentTab === tab.name
                  ? "bg-green-100 text-black"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
              )}
              aria-current={currentTab === tab.name ? "page" : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={currentTab === tab.name ? "block" : "hidden"}
          >
            <div className="h-80 overflow-auto ">
              <table class="download-table">
                <thead>
                  <tr>
                    <th class="px- py-2 text-xs">Quality</th>
                    <th class="px-4 py-2 text-xs">Size</th>
                    <th class="px-4 py-2 text-xs">Action</th>
                  </tr>
                </thead>
                {tab.name === "Video" && details && (
                  <tbody className="text-center">
                    {details.videoFormats?.map((quality, index) => (
                      <tr key={index}>
                        <td class="border-x-0 border px- py-2 text-xs">
                          <div className="flex items-center justify-center">
                            {quality.quality}{" "}
                            {!quality.hasAudio && (
                              <SpeakerXMarkIcon className="text-red-500 h-3 ms-1" />
                            )}
                          </div>
                        </td>
                        <td class="border-x-0 border px-4 py-2 text-xs">
                          {quality.size} MB
                        </td>
                        <td class="border-x-0 border px-4 py-2">
                          <button
                            className="bg-emerald-500 text-white text-xs p-2 rounded-md hover:bg-emerald-600"
                            onClick={() =>
                              window.open(
                                `http://localhost:5000/download?url=${videoUrl}&itag=${quality.itag}`
                              )
                            }
                            target="_blank"
                          >
                            <ArrowDownTrayIcon className="text-white h-4 px-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}

                {tab.name === "Audio" && details && (
                  <tbody>
                    {details.audioFormats?.map((quality, index) => (
                      <tr key={index}>
                        <td class="border-x-0 border px- py-2 text-xs">
                          <div className="flex items-center justify-center">
                            {quality.quality}{" "}
                            {!quality.hasAudio && (
                              <SpeakerXMarkIcon className="text-red-500 h-3 ms-1" />
                            )}
                          </div>
                        </td>
                        <td class="border-x-0 border px-4 py-2 text-xs">
                          {quality.size} MB
                        </td>
                        <td class="border-x-0 border px-4 py-2">
                          <button
                            className="bg-emerald-500 text-white text-xs p-2 rounded-md hover:bg-emerald-600"
                            onClick={() =>
                              window.open(
                                `http://localhost:5000/download?url=${videoUrl}&itag=${quality.itag}`
                              )
                            }
                            target="_blank"
                          >
                            <ArrowDownTrayIcon className="text-white h-4 px-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
