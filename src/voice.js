document.addEventListener("DOMContentLoaded", () => {
  const permissionPrompt = document.getElementById("permission-prompt");
  const permissionButton = document.getElementById("permission-button");
  const waveform = document.getElementById("waveform");
  const dbValue = document.getElementById("db-value");
  const showCircle = document.getElementById("showCircle"); // 显示圆形
  const bkgCircle = document.getElementById("bkgCircle"); // 背景圆形

  let audioContext;
  let analyser;
  let microphone;
  let dataArray;
  let animationId;
  let meterCount = 5;
  const baseRadius = 16; // 1rem 约等于 16px

  function createMeters() {
    waveform.innerHTML = "";
    for (let i = 0; i < meterCount; i++) {
      const meter = document.createElement("div");
      meter.className = "meter";
      waveform.appendChild(meter);
    }
  }

  async function initAudio() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      createMeters();
      visualize();

      permissionPrompt.style.display = "none";
    } catch (err) {
      console.error("获取麦克风权限失败:", err);
      alert(
        "获取麦克风权限请求失败。如果你无法开启麦克风，请尝试重新打开此应用程序或将错误信息发送给他人帮助。（错误：" +
          err +
          "）"
      );
    }
  }

  function visualize() {
    analyser.getByteFrequencyData(dataArray);

    const mappedData = [];
    const step = dataArray.length / meterCount / 1.25;

    for (let i = 0; i < meterCount; i++) {
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);
      let sum = 0;

      for (let j = start; j < end; j++) {
        if (j < dataArray.length) {
          sum += dataArray[j];
        }
      }

      const average = sum / (end - start);
      mappedData.push(average || 0);
    }

    let sum = 0;
    mappedData.forEach((value) => (sum += value));
    const average = sum / mappedData.length;

    const db = Math.round(20 * Math.log10(average / 255) * 10) / 10 + 100;
    dbValue.innerHTML = db.toFixed(1) + " %";

    const normalizedValue = Math.min(average / 255, 1);
    const showRadius = normalizedValue * baseRadius * 4; // 展示园最大扩展倍数
    showCircle.style.width = `${showRadius}vh`;
    showCircle.style.height = `${showRadius}vh`;

    const bkgRadius = normalizedValue * baseRadius * 8; // 背景圆最大扩展倍数
    bkgCircle.style.width = `${bkgRadius}vh`;
    bkgCircle.style.height = `${bkgRadius}vh`;

    const meters = waveform.querySelectorAll(".meter");
    mappedData.forEach((value, index) => {
      if (index < meters.length) {
        meters[index].style.height = `${(value / 255) * 100}%`;
      }
    });

    animationId = requestAnimationFrame(visualize);
  }

  permissionButton.addEventListener("click", initAudio);
});
