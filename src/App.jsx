import { useRef, useState } from 'react';
import './App.css';

import { Stage, Layer, Image as KonvaImage, Rect, Line, Circle } from 'react-konva';
import useImage from 'use-image';


function App() {
  // const imageUrl = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg'
  const imageUrl = 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg'
  const [image] = useImage(imageUrl);

  let stageRef = useRef(null);

  const canvasWidth = 600;
  const canvasHeight = 400;

  // configs
  const _sensitivity = 0.1; // Mouse sensitivity
  const _minZoom = 0.5; // Mouse sensitivity
  const _maxZoom = 2; // Mouse sensitivity

  // state

  let offsetX = 0;
  let offsetY = 0;
  let scale = 1;

  const drawImage = () => {
    if (image) {
      const imageWidth = image.width;
      const imageHeight = image.height;
      const stageWidth = canvasWidth;
      const stageHeight = canvasHeight;

      if (imageWidth > stageWidth || imageHeight > stageHeight) {
        const scaleX = stageWidth / imageWidth;
        const scaleY = stageHeight / imageHeight;
        scale = Math.min(scaleX, scaleY);
      }

      if (imageWidth * scale < stageWidth) {
        offsetX = (stageWidth - imageWidth * scale) / 2;
      }

      if (imageHeight * scale < stageHeight) {
        offsetY = (stageHeight - imageHeight * scale) / 2;
      }

      return (
        <KonvaImage
          image={image}
          width={imageWidth * scale}
          height={imageHeight * scale}
          x={offsetX}
          y={offsetY}
        />
      );
    }
    return null;
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePos = stage.getPointerPosition();
    const newPos = stage.getPointerPosition();

    const sensitivity = _sensitivity;
    const minZoom = _minZoom;
    const maxZoom = _maxZoom;

    const zoomAmount = e.evt.deltaY * -sensitivity;

    const newScale = Math.max(minZoom, Math.min(maxZoom, oldScale + zoomAmount));

    stage.scale({ x: newScale, y: newScale });

    const mousePointTo = {
      x: (newPos.x - stage.x()) / oldScale,
      y: (newPos.y - stage.y()) / oldScale,
    };

    const newPosAfterScale = {
      x: newPos.x - mousePointTo.x * newScale,
      y: newPos.y - mousePointTo.y * newScale,
    };

    stage.position(newPosAfterScale);
    stage.batchDraw();
  };


  const resetZoom = () => {
    const stage = stageRef.current.getStage();
    const oldScale = stage.scaleX();

    const newScale = 1;

    stage.scale({ x: newScale, y: newScale });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
  }

  // methods for shape
  const drawRect = (rect) => {
    const { x, y, width, height } = rect;
    return (
      <Rect
        x={x * scale + offsetX}
        y={y * scale + offsetY}
        width={width * scale}
        height={height * scale}
        stroke="red"
        strokeWidth={2}
      />
    );
  };

  const drawPolygon = (points) => {
    const scaledPoints = points.map((point, index) => {
      return index % 2 === 0 ? point * scale + offsetX : point * scale + offsetY;
    });
    return (
      <Line
        points={scaledPoints}
        closed
        stroke="blue"
        strokeWidth={2}
      />
    );
  };

  const drawCircle = (circle) => {
    const { x, y, radius } = circle;
    return (
      <Circle
        x={x * scale + offsetX}
        y={y * scale + offsetY}
        radius={radius * scale}
        stroke="green"
        strokeWidth={2}
      />
    );
  };

  const drawLine = (line) => {
    const scaledPoints = line.map((point, index) => {
      return index % 2 === 0 ? point * scale + offsetX : point * scale + offsetY;
    });
    return (
      <Line
        points={scaledPoints}
        stroke="purple"
        strokeWidth={2}
      />
    );
  };

  const handleMouseDown = (e) => { }
  const handleMouseMove = (e) => { }
  const handleMouseUp = (e) => { }





  drawImage(imageUrl);

  return (
    <>
      <div className="flex flex-row justify-center w-full h-12">
        <button
          onClick={resetZoom}
        >Reset</button>
      </div>
      <div className="flex w-full h-full border border-gray-50">
        <Stage ref={stageRef} width={canvasWidth} height={canvasHeight} onWheel={handleWheel}>
          <Layer>
            {drawImage()}
            {drawRect({ x: 0, y: 0, width: 100, height: 100 })}
            {drawPolygon([150, 150, 200, 200, 250, 150])}
            {drawCircle({ x: 300, y: 300, radius: 50 })}
            {drawLine([350, 350, 400, 400, 450, 350])}
          </Layer>
        </Stage>
      </div>
    </>
  )
}

export default App
