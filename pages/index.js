import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useMemo } from "react";
import MicRecorder from "mic-recorder-to-mp3";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const Mp3Recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => setIsBlocked(false),
      () => setIsBlocked(true)
    );
  }, []);

  const start = () => {
    if (isBlocked) {
      alert(
        "Permission Denied. Please allow app to record audio. GO to you settings."
      );
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setIsRecording(false);
        setAudioURL(blobURL);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Voice Recorder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className={styles.title}>
        Group 4 Information Theory - Voice Recorder
      </h2>
      <div className={styles.audio} id="audio">
        <div style={{ display: "flex" }}>
          <button
            style={{ marginRight: "10px" }}
            className={styles.btn}
            onClick={() => start()}
            disabled={isRecording}
          >
            Start
          </button>
          <button
            className={styles.btn}
            onClick={() => stop()}
            disabled={!isRecording}
          >
            Stop
          </button>
        </div>
        <audio controls="controls" src={audioURL} />
      </div>
      z
    </div>
  );
}

// function startRecording() {
//   let device = navigator.mediaDevices.getUserMedia({ audio: true });
//   let items = [];
//   device.then((stream) => {
//     let recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = (e) => {
//       items.push(e.data);
//       if (recorder.state == "inactive") {
//         var blob = new Blob(items, { type: "audio/webm" });
//         setAudioURL(URL.createObjectURL(blob));
//       }
//     };

//     recorder.start();

//     setTimeout(() => {
//       recorder.stop();
//     }, 5000);
//   });
// }
