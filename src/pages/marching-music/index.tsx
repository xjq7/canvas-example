import { useEffect, useRef, useState } from 'react';
import { useDebounce, useWindowSize } from 'react-use';
import { Button, Row, Select } from 'antd';
// import Meyda from 'meyda';
import { MarchingMusic } from './marching-music';
import { RhythmMode } from './type';
import S from './index.module.less';

export default function Component() {
  const { width, height } = useWindowSize();
  const marchingMusicRef = useRef<MarchingMusic>();
  const inputRef = useRef<HTMLInputElement>();
  const [file, setFile] = useState<File>();
  const [rhythmMode, setRhythmMode] = useState<RhythmMode>('wave');
  const rhythmModeRef = useRef<RhythmMode>();
  const lightInterval = useRef<any>();

  const handleSelectAudio = () => {
    inputRef.current.click();
  };

  // 处理音频文件变更
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // 创建分析器
      const analyser = audioContext.createAnalyser();

      // const meydaAnalyzer = Meyda.createMeydaAnalyzer({
      //   audioContext: audioContext,
      //   source: source, // 连接到音频源
      //   bufferSize: 512,
      // });

      // 启动音频处理
      // meydaAnalyzer.start();

      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start(0);

      source.onended = () => {
        marchingMusicRef.current.closeLight();
        clearInterval(lightInterval.current);
        lightInterval.current = null;
      };

      if (lightInterval.current) {
        clearInterval(lightInterval.current);
        lightInterval.current = null;
      }

      lightInterval.current = setInterval(() => {
        if (rhythmModeRef.current === 'spectrogram') {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          marchingMusicRef.current.drawBarLight(dataArray);
        } else {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteTimeDomainData(dataArray);
          marchingMusicRef.current.drawWaveLight(dataArray);
        }
      }, 96);
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    marchingMusicRef.current = new MarchingMusic({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    return () => {
      marchingMusicRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    rhythmModeRef.current = rhythmMode;
    marchingMusicRef.current?.closeLight();
  }, [rhythmMode]);

  const [,] = useDebounce(
    () => {
      marchingMusicRef.current.update({ width, height });
    },
    500,
    [width, height]
  );

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col">
      <div className={S.operator}>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        ></input>

        <Row align="middle">
          <Button type="primary" onClick={handleSelectAudio}>
            选取音乐
          </Button>
          <div className={S.fileName}>{file?.name || '暂未选取音乐'}</div>
          <div className="ml-3">律动模式: </div>
          <Select<RhythmMode>
            className="ml-3 w-[100px]"
            defaultValue="spectrogram"
            value={rhythmMode}
            onChange={(val) => {
              setRhythmMode(val);
            }}
            options={[
              {
                label: '频谱',
                value: 'spectrogram',
              },
              {
                label: '波形',
                value: 'wave',
              },
            ]}
            placeholder="律动模式"
          ></Select>
        </Row>
      </div>
      <div
        id="marching-music"
        className="flex items-center justify-center"
      ></div>
    </div>
  );
}
