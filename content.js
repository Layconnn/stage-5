// let isRecording = false;
// let activeTabId = null;
// let mediaStream;
// let mediaRecorder;
// let recordedChunks = [];


// console.log("Hi, I have been injected whoopie!!!")
// // chrome.runtime.onConnect.addListener((port) => {
// //   if (port.name === "content-script") {
// //     port.onMessage.addListener((message) => {
// //       if (message.action === "startRecording" && !isRecording) {
// //         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// //           const activeTab = tabs[0];
// //           startRecording(activeTab.id);
// //         });
// //       }
// //     });
// //   }
// // });

// function startRecording() {
//   if (!isRecording) {
//     isRecording = true;
//     navigator.mediaDevices
//     .getDisplayMedia({ video: { width: 999999999, height: 999999999 }, audio: true })
//     .then((stream) => {
//       mediaStream = stream;
//       mediaRecorder = new MediaRecorder(mediaStream);
//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           recordedChunks.push(event.data);
//         }
//       };
//       mediaRecorder.start();
//       mediaStream.getVideoTracks()[0].addEventListener("ended", () => {
//         if (mediaRecorder && mediaRecorder.state === "recording") {
//           mediaRecorder.stop();
//           saveRecordedData();
//         }
//       });
//     })
//     .catch((error) => {
//       console.error("Error starting screen sharing:", error);
//     });
//   }
// }

// // function openScreenSharingOptions() {
// //   chrome.scripting.executeScript({
// //     target: { tabId: activeTabId },
// //     function: () => {
     
// //     },
// //   });
// // }

// // function stopRecording() {
// //   if (isRecording) {
// //     if (mediaRecorder && mediaRecorder.state === "recording") {
// //       mediaRecorder.stop();
// //       saveRecordedData();
// //     }
// //     isRecording = false;
// //   }
// // }

// function saveRecordedData() {
//   const blob = new Blob(recordedChunks, { type: "video/webm" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.style.display = "none";
//   a.href = url;
//   a.download = "recorded-screen-and-audio.webm";
//   document.body.appendChild(a);
//   a.click();
//   window.URL.revokeObjectURL(url);
// }

// // chrome.tabs.onActivated.addListener((activeInfo) => {
// //   activeTabId = activeInfo.tabId;
// // });


// chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

//     if(message.action === "startRecording"){
//         console.log("startRecording")

//         sendResponse(`processed: ${message.action}`);
//         startRecording();
//     }

// })

console.log("Hi, I have been injected whoopie!!!")

var recorder = null
function onAccessApproved(stream){
    recorder = new MediaRecorder(stream);

    recorder.start();

    recorder.onstop = function(){
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop()
            }
        })
    }

    recorder.ondataavailable = function(event){
        let recordedBlob  = event.data;
        let url = URL.createObjectURL(recordedBlob);

        let a = document.createElement("a");

        a.style.display = "none";
        a.href = url;
        a.download = "screen-recording.webm"

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }
}


chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

    if(message.action === "startRecording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video: {
                width:9999999999,
                height: 9999999999
            }
        }).then((stream)=>{
            onAccessApproved(stream)
        })  
    }

    if(message.action === "stopvideo"){
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if(!recorder) return console.log("no recorder")

        recorder.stop();


    }

})