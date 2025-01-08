import { useEffect, useRef, useState } from 'react';
import { useDebounce, useWindowSize } from 'react-use';

import S from './index.module.less';
import { MarchingMusic } from './marching-music';
import { Button, Row } from 'antd';

export default function Component() {
  const { width, height } = useWindowSize();
  const marchingMusicRef = useRef<MarchingMusic>();
  const inputRef = useRef<HTMLInputElement>();
  const [file, setFile] = useState<File>();

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
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start(0);

      // 律动效果
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function animate() {
        requestAnimationFrame(animate);
        analyser.getByteFrequencyData(dataArray);
        marchingMusicRef.current.drawLight(dataArray);
      }
      animate();
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
          <div className={S.fileName}>{file?.name || ''}</div>
        </Row>
      </div>
      <div
        id="marching-music"
        className="flex items-center justify-center"
      ></div>
    </div>
  );
}
