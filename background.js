// let isRecording = false;
// let activeTabId = null;
// let mediaStream;
// let mediaRecorder;
// let recordedChunks = [];

// chrome.runtime.onConnect.addListener((port) => {
//     if (port.name === 'content-script') {
//         port.onMessage.addListener((message) => {
//             if (message.action === 'startRecording' && !isRecording) {
//                 chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                     const activeTab = tabs[0];
//                     startRecording(activeTab.id);
//                 });
//             }
//         });
//     }
// });

// function startRecording(tabId) {
//     if (!isRecording) {
//         isRecording = true;
//         activeTabId = tabId;
//         openScreenSharingOptions();
//     }
// }

// function openScreenSharingOptions() {
//     chrome.scripting.executeScript(
//         {
//             target: { tabId: activeTabId },
//             function: () => {
//                 navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
//                     .then((stream) => {
//                         mediaStream = stream;
//                         mediaRecorder = new MediaRecorder(mediaStream);
//                         mediaRecorder.ondataavailable = (event) => {
//                             if (event.data.size > 0) {
//                                 recordedChunks.push(event.data);
//                             }
//                         };
//                         mediaRecorder.start();
//                         mediaStream.getVideoTracks()[0].addEventListener("ended", () => {
//                             if (mediaRecorder && mediaRecorder.state === "recording") {
//                               mediaRecorder.stop();
//                               saveRecordedData();
//                             }
//                           });
//                     })
//                     .catch((error) => {
//                         console.error('Error starting screen sharing:', error);
//                     });
//             },
//         }
//     );
// }

// function stopRecording() {
//     if (isRecording) {
//         if (mediaRecorder && mediaRecorder.state === 'recording') {
//             mediaRecorder.stop();
//             saveRecordedData();
//         }
//         isRecording = false;
//     }
// }

// function saveRecordedData() {
//     const blob = new Blob(recordedChunks, { type: 'video/webm' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'recorded-screen-and-audio.webm';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
// }

// chrome.tabs.onActivated.addListener((activeInfo) => {
//     activeTabId = activeInfo.tabId;
// });


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    if(changeInfo.status === "complete" && /^http/.test(tab.url)){
        chrome.scripting.executeScript({
            target: {tabId},
            files: ["./content.js"]
        }).then(()=>{
            console.log("we have injected the content script")
        }).catch(err=> console.log(err, "error in background script line 10"))
    }
})