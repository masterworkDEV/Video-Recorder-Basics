const videoDisplay = document.getElementById("stream");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const record = document.getElementById("record");
const stopRecord = document.getElementById("stop-record");
const modalOpen = document.getElementById("modal-open");
const modalClosed = document.getElementById("modal-close");
const recordsModalShown = document.querySelector(".modal-click-record-shown");
const modalShownLayer = document.querySelector(".modal-shown-layer");

let liveStream;
let recordLive;
let count = 0;

const fetchCameraAPI = async () => {
  liveStream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoDisplay.srcObject = liveStream;
};

//to stat and stop livestream;
start.addEventListener("click", fetchCameraAPI);

const stopLiveCamera = () => {
  if (liveStream) {
    videoDisplay.srcObject = null;
    liveStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
};
stop.addEventListener("click", stopLiveCamera);

// initialize record
let data = [];

const showData = () => {};

const recordVideo = async (output) => {
  const container = document.querySelector(".records-container");
  if (liveStream) {
    const fileType = { MimeType: "video/webm" };
    recordLive = new MediaRecorder(liveStream, fileType);

    recordLive.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: "video/webm" });

      const url = URL.createObjectURL(blob);
      const output = document.createElement("div");

      output.innerHTML += `
<div class="records-container">
<div class="row">
  <div class="card">
   <p>${url}</p>
  </div>
</div>
</div>

`;
      container.appendChild(output);
    };

    recordLive.start();
  }
};

record.addEventListener("click", recordVideo);
stopRecord.addEventListener("click", () => {
  if (recordLive) {
    recordLive.stop();
    stopLiveCamera();
  }
});

// Display data

const displayRecordsOnScreen = () => {
  if (recordLive) {
    console.log(recordLive);
  }
};
// records modal  controls

modalOpen.addEventListener("click", (e) => {
  e.preventDefault();
  recordsModalShown.classList.toggle("active");
  modalShownLayer.style.display = "block";
});

modalClosed.addEventListener("click", () => {
  recordsModalShown.classList.remove("active");
  modalShownLayer.style.display = "none";
});
