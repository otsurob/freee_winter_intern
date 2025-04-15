// TimeBar.tsx
import React from "react";

type Props = {
  name: string;
  shift: string;
  onClick?: () => void; // クリック時に呼び出すコールバック
};

const TimeBar: React.FC<Props> = ({ name, shift, onClick }) => {
  const [startTime, endTime] = shift.split("-");
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const HOUR_HEIGHT = 50;
  const startOffset = startH * HOUR_HEIGHT + (startM / 60) * HOUR_HEIGHT;
  const endOffset =
    endH * HOUR_HEIGHT + (endM / 60) * HOUR_HEIGHT - startOffset;

  return (
    <div
      style={{
        position: "absolute",
        top: `${startOffset}px`,
        left: "10px",
        width: "140px",
        height: `${endOffset}px`,
        backgroundColor: "#7dd3fc",
        borderRadius: "4px",
        padding: "4px",
        boxSizing: "border-box",
        fontSize: "14px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        cursor: "pointer", // クリック感を出すためにポインターを設定
      }}
      onClick={onClick} // ← ここで受け取ったコールバックを実行
    >
      <div style={{ fontWeight: "bold" }}>{name}</div>
      <div style={{ fontSize: "12px" }}>{shift}</div>
    </div>
  );
};

export default TimeBar;
