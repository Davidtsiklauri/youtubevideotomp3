
document.getElementById("download").addEventListener("click", convertYoutubeVideoToMusic);
document.getElementById("downloadAll").addEventListener("click", convertYoutubeVideoToMusic);

const URL ='https://y2mate.guru/api/convert';
const youtubeRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; 


function convertYoutubeVideoToMusic(e) {
    const isDownloadAll = e.target.id === 'downloadAll';
    chrome.tabs.query({ lastFocusedWindow: true }, tabs => {
        tabs.map((tab) => {
            if(youtubeRegex.test(tab.url)) {
                if(!isDownloadAll && tab.active) {
                     return makeRequestToApi(tab.url);
                } else if(!isDownloadAll && !tab.active) {
                    // IGNORE 
                }else {
                     return makeRequestToApi(tab.url);
                }
            }
        })
    });
};


function makeRequestToApi(url) {
    fetch(URL, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({url})
    }).then(response => response.json())
      .then(data => downloadMusic(data))
      .catch(err => console.log(err))
};

function downloadMusic(data) {
 const file = data.url.find((file) => file.ext === 'm4a');
  if(data && file) {
      chrome.downloads.download({
        url: file.url,
        filename: `${data.meta.title}.m4a`      
    });
  }
};