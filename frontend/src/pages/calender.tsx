"use client"; // Next.js で Client Component として扱う場合に必要

import React, { useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// ↑ shadcn/ui のテンプレートを使って生成したDialogコンポーネントのパスを指定してください

// 例: 出勤スケジュール (実際は API から取得などで動的に管理)
const schedules = [
  {
    date: "2025-03-21",
    employees: [
      { name: "Taro", shift: "09:00 - 17:00" },
      { name: "Hanako", shift: "10:00 - 19:00" },
    ],
  },
  {
    date: "2025-03-22",
    employees: [{ name: "Ken", shift: "13:00 - 22:00" }],
  },
];

const Calendar = () => {
  // モーダル(Dialog)を開いているかどうか
  const [open, setOpen] = useState(false);
  // クリックされた日付を保持
  const [clickedDate, setClickedDate] = useState("");

  // カレンダーの日付をクリックしたときのハンドラ
  const handleDateClick = useCallback((arg: DateClickArg) => {
    setClickedDate(arg.dateStr); // 例: "2025-03-21"
    setOpen(true); // Dialog を開く
  }, []);

  // クリックされた日付に紐づくスケジュールを抽出
  const daySchedule = schedules.find((s) => s.date === clickedDate);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />

      {/* shadcn/ui の Dialog を使用 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>出勤予定</DialogTitle>
            <DialogDescription>{clickedDate}</DialogDescription>
          </DialogHeader>

          {daySchedule && daySchedule.employees.length > 0 ? (
            <ul>
              {daySchedule.employees.map((employee, index) => (
                <li key={index}>
                  {employee.name}（{employee.shift}）
                </li>
              ))}
            </ul>
          ) : (
            <p>この日の出勤予定はありません。</p>
          )}

          <DialogFooter>
            {/* 何らかの処理用のボタンなどを配置したい場合に使用 */}
            {/* 例えば「閉じる」ボタンなど */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
