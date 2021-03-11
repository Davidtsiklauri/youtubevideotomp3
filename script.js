const download = document.getElementById("download");
const downloadAll = document.getElementById("downloadAll");
const pEl = document.querySelector(".not-supported");

download.addEventListener("click", convertYoutubeVideoToMusic);
downloadAll.addEventListener("click", convertYoutubeVideoToMusic);

const API = "https://y2mate.guru/api/convert";
const YOUTUBE_REGEX = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

function convertYoutubeVideoToMusic(e) {
  const isDownloadAll = e.target.id === "downloadAll";
  chrome.tabs.query({ lastFocusedWindow: true }, (tabs) => {
    tabs.map((tab) => {
      if (YOUTUBE_REGEX.test(tab.url)) {
        if (!isDownloadAll && tab.active) {
          return makeRequestToApi(tab.url);
        } else if (!isDownloadAll && !tab.active) {
          // IGNORE
        } else {
          return makeRequestToApi(tab.url);
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ lastFocusedWindow: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab.active && tab.url.startsWith("chrome")) {
        download.remove();
        downloadAll.remove();
        pEl.classList.remove("not-supported");
        return;
      }
      if (tab.active && YOUTUBE_REGEX.test(tab.url)) {
        download.classList.remove("disabled");
      } else if (!tab.active && YOUTUBE_REGEX.test(tab.url)) {
        downloadAll.classList.remove("disabled");
      }
    }
  });
});

function makeRequestToApi(url) {
  fetch(API, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })
    .then((response) => response.json())
    .then((data) => downloadMusic(data))
    .catch((err) => console.log(err));
}

function downloadMusic(data) {
  const file = data.url.find((file) => file.ext === "m4a");
  if (data && file) {
    chrome.downloads.download({
      url: file.url,
      filename: `${data.meta.title}.m4a`,
    });
  }
}
