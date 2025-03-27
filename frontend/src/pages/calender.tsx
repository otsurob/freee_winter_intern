"use client";

import React, { useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

// shadcn/ui のDialog関連コンポーネントを import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ■ 例: 出勤スケジュール (実際は API から取得などで動的に管理)
const schedules = [
  {
    date: "2025-03-21",
    employees: [
      { name: "Taro", shift: "09:00-17:00" },
      { name: "Hanako", shift: "10:00-19:00" },
    ],
  },
  {
    date: "2025-03-22",
    employees: [
      { name: "Ken", shift: "13:00-22:00" },
      { name: "Mike", shift: "00:00-08:00" },
      { name: "Lucy", shift: "09:00-12:00" },
    ],
  },
];

// ■ 24時間の配列 (0 ~ 23)
const hours = Array.from({ length: 24 }, (_, i) => i);

/**
 * 従業員の出勤バーを描画するコンポーネント
 * shift 例: "09:00 - 17:00"
 */
const TimeBar: React.FC<{ name: string; shift: string }> = ({
  name,
  shift,
}) => {
  // 例: "09:00 - 17:00" -> [ "09:00", "17:00" ]
  const [startTime, endTime] = shift.split("-");
  // "09:00" -> ["09","00"]
  const [startH, startM] = startTime.split(":").map(Number);
  // "17:00" -> ["17","00"]
  const [endH, endM] = endTime.split(":").map(Number);

  const HOUR_HEIGHT = 50; // 1時間の高さ(px)

  // 開始のY座標(px)
  const startOffset = startH * HOUR_HEIGHT + (startM / 60) * HOUR_HEIGHT;
  // バーの高さ(px)
  const endOffset =
    endH * HOUR_HEIGHT + (endM / 60) * HOUR_HEIGHT - startOffset;

  return (
    <div
      style={{
        position: "absolute",
        top: `${startOffset}px`,
        left: "10px", // カラム内でのバー開始位置
        width: "140px", // バーの横幅
        height: `${endOffset}px`,
        backgroundColor: "#7dd3fc",
        borderRadius: "4px",
        padding: "4px",
        boxSizing: "border-box",
        fontSize: "14px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{name}</div>
      <div style={{ fontSize: "12px" }}>{shift}</div>
    </div>
  );
};

const Calendar = () => {
  const [open, setOpen] = useState(false); // モーダル開閉状態
  const [clickedDate, setClickedDate] = useState(""); // クリックされた日付
  const navigate = useNavigate();
  // カレンダーの日付クリック時に呼ばれる
  const handleDateClick = useCallback((arg: DateClickArg) => {
    setClickedDate(arg.dateStr); // e.g. "2025-03-21"
    setOpen(true);
  }, []);

  // クリックされた日付の出勤情報
  const daySchedule = schedules.find((s) => s.date === clickedDate) ?? {
    date: clickedDate,
    employees: [],
  };

  // 従業員リスト
  const employees = daySchedule.employees;

  return (
    <>
      <Button onClick={() => navigate("/")}>ホームへ</Button>
      {/* カレンダー本体 */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />

      {/* shadcn/ui の Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* 少し横幅を広げる & 高さを確保しておく */}
        <DialogContent className="max-w-[900px] w-full h-[700px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>出勤予定</DialogTitle>
            <DialogDescription>{clickedDate}</DialogDescription>
          </DialogHeader>

          {/* タイムライン全体を縦にも横にもスクロールさせたい */}
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto", // 縦横両方向スクロール可能に
              border: "1px solid #e2e8f0",
              position: "relative",
              backgroundColor: "#fff",
            }}
          >
            {/* メインのコンテナをflexで横方向に展開する */}
            <div style={{ display: "flex", minWidth: "700px" }}>
              {/* ■ 左カラム: 時間ラベル (0:00 ~ 23:00) */}
              <div
                style={{
                  flex: "0 0 60px", // 幅固定
                  borderRight: "1px solid #e2e8f0",
                  position: "relative",
                }}
              >
                {/* 24時間分のラベル表示 */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    style={{
                      height: "50px",
                      borderBottom: "1px solid #e2e8f0",
                      padding: "4px",
                      boxSizing: "border-box",
                      fontSize: "12px",
                      color: "#4a5568",
                    }}
                  >
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* ■ 右カラム: 従業員ごとに列を並べる */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  position: "relative",
                }}
              >
                {employees.length > 0 ? (
                  employees.map((emp, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          flex: "0 0 160px", // 各従業員の列の幅
                          borderRight: "1px solid #e2e8f0",
                          position: "relative",
                          height: `${24 * 50}px`, // 24時間*1時間50px=1200px
                        }}
                      >
                        {/* 従業員の出勤バーを配置 */}
                        <TimeBar name={emp.name} shift={emp.shift} />
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "8px",
                      color: "#718096",
                      fontSize: "14px",
                    }}
                  >
                    この日の出勤予定はありません。
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            {/* 必要に応じてボタンなどを配置してください */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
