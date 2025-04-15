import { useState, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, Portal, Text, Input } from "@chakra-ui/react"; // Inputを追加
import { getShiftData } from "@/api/gasApi";
import { ShiftData } from "@/types/types";
import TimeBar from "@/components/timeBar"; // ← 分けたと仮定

const hours = Array.from({ length: 24 }, (_, i) => i);

const EditCalendar = () => {
  const [open, setOpen] = useState(false); // 既存の「日付のモーダル」開閉
  const [clickedDate, setClickedDate] = useState("");
  const [schedules, setSchedules] = useState<ShiftData[]>([]);
  const navigate = useNavigate();

  // --- 追加分 ---
  const [editModalOpen, setEditModalOpen] = useState(false); // "編集用" モーダルの開閉
  // 編集対象となる従業員情報 (date も識別できるようにしておくとよい)
  const [selectedEmployee, setSelectedEmployee] = useState<{
    date: string;
    index: number; // employees配列上のインデックス
    name: string;
    shift: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const scheduleDatas = await getShiftData();
      if (!scheduleDatas) {
        return;
      }
      setSchedules(scheduleDatas);
    }
    fetchData();
  }, []);

  // カレンダー日付クリック
  const handleDateClick = useCallback((arg: DateClickArg) => {
    setClickedDate(arg.dateStr);
    setOpen(true);
  }, []);

  // クリックされた日付に紐づく従業員情報を取得
  const daySchedule = schedules.find((s) => s.date === clickedDate) ?? {
    date: clickedDate,
    employees: [],
  };
  const employees = daySchedule.employees;

  // --- タイムバークリック時の処理 ---
  const handleTimeBarClick = useCallback(
    (empIndex: number) => {
      const emp = employees[empIndex];
      // どの従業員を編集するかを selectedEmployee にセット
      setSelectedEmployee({
        date: daySchedule.date,
        index: empIndex,
        name: emp.name,
        shift: emp.shift,
      });
      setEditModalOpen(true); // 編集用モーダルを表示
    },
    [daySchedule.date, employees]
  );

  // --- 編集用モーダルで表示・編集するためのステート ---
  // 現在の開始時刻・終了時刻だけ Input で編集する例
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  // selectedEmployee が変化したら、editStart / editEnd を初期セット
  useEffect(() => {
    if (selectedEmployee) {
      const [st, ed] = selectedEmployee.shift.split("-").map((s) => s.trim());
      setEditStart(st);
      setEditEnd(ed);
    }
  }, [selectedEmployee]);

  // --- 編集を保存する ---
  const handleSaveEdit = () => {
    if (!selectedEmployee) return;
    // schedulesを更新して、指定の従業員のシフトを差し替える
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.date !== selectedEmployee.date) return s;
        const updatedEmployees = s.employees.map((emp, i) => {
          if (i === selectedEmployee.index) {
            // シフトを更新
            return {
              ...emp,
              shift: `${editStart} - ${editEnd}`,
            };
          }
          return emp;
        });
        return { ...s, employees: updatedEmployees };
      })
    );
    setEditModalOpen(false);
  };

  return (
    <>
      <Button onClick={() => navigate("/")}>ホームへ</Button>

      {/* カレンダー本体 */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />

      {/* 日付クリックモーダル */}
      <Portal>
        <Dialog.Root open={open} onOpenChange={() => setOpen(false)} size="xl">
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              style={{
                maxWidth: "900px",
                width: "100%",
                height: "700px",
                overflow: "hidden",
              }}
            >
              <Dialog.Header>
                出勤予定
                <Text fontSize="sm" color="gray.500">
                  {clickedDate}
                </Text>
              </Dialog.Header>
              <Dialog.CloseTrigger />

              <Dialog.Body
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                  backgroundColor: "#fff",
                }}
              >
                <div style={{ display: "flex", minWidth: "700px" }}>
                  {/* 左カラム: 時間ラベル */}
                  <div
                    style={{
                      flex: "0 0 60px",
                      borderRight: "1px solid #e2e8f0",
                      position: "relative",
                    }}
                  >
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

                  {/* 右カラム: 従業員ごとに列を並べる */}
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
                              flex: "0 0 160px",
                              borderRight: "1px solid #e2e8f0",
                              position: "relative",
                              height: `${24 * 50}px`,
                            }}
                          >
                            {/* ★TimeBar に onClick を渡す★ */}
                            <TimeBar
                              name={emp.name}
                              shift={emp.shift}
                              onClick={() => handleTimeBarClick(i)}
                            />
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
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Portal>

      {/* --- 編集用モーダル --- */}
      <Portal>
        <Dialog.Root
          open={editModalOpen}
          onOpenChange={() => setEditModalOpen(false)}
          size="md"
        >
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              style={{
                maxWidth: "400px",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Dialog.Header>
                予定の編集
                {selectedEmployee && (
                  <Text fontSize="sm" color="gray.500">
                    {selectedEmployee.name} / {selectedEmployee.date}
                  </Text>
                )}
              </Dialog.Header>
              <Dialog.CloseTrigger />

              <Dialog.Body
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <Text fontSize="sm" color="gray.500">
                  開始時刻・終了時刻を入力してください。
                </Text>
                {/* 開始時刻のInput */}
                <Input
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  placeholder="09:00"
                />
                {/* 終了時刻のInput */}
                <Input
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  placeholder="17:00"
                />
              </Dialog.Body>

              <Dialog.Footer>
                <Button onClick={handleSaveEdit} colorScheme="blue">
                  保存
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Portal>
    </>
  );
};

export default EditCalendar;
