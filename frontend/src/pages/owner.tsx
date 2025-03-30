import Header from "@/components/header";
import { Dialog, Portal, Button, Input, Field } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Owner = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  return (
    <div>
      <Header></Header>
      <h1>オーナー画面</h1>
      <div>とりあえずLINEのAPI叩きながら従業員登録機能を実装したい</div>
      <div>店に置いておく打刻ページ</div>
      <Button onClick={() => navigate("/owner/stampingHome")}>
        打刻画面へ
      </Button>
      <Portal>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="outline" onClick={() => setStep(1)}>
              Edit Profile
            </Button>
          </Dialog.Trigger>
          {step === 1 ? (
            <>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content className="sm:max-w-[425px]">
                  <Dialog.Header>
                    <Dialog.Title>Resister LINE Account</Dialog.Title>
                    <Dialog.Description>Read QR Code</Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Footer>
                    <Button onClick={() => setStep(2)}>Next Page</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </>
          ) : (
            <>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>従業員情報入力</Dialog.Title>
                    <Dialog.Description>
                      情報を入力して下さい
                    </Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Field.Root>
                      <Field.Label>
                        LINE ID
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input placeholder="LINEメッセージで受け取ったIDを入力してください" />
                      <Field.Label>
                        氏名
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input placeholder="苗字と名前の間にはスペースを入れてください" />
                      <Field.Label>
                        氏名（フリガナ）
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input placeholder="苗字と名前の間にはスペースを入れてください" />
                      <Field.Label>
                        生年月日
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input type="date" />
                      <Field.Label>
                        入社日（本日の日付）
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input type="date" />
                    </Field.Root>
                    <Button>登録</Button>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <Button type="button" onClick={() => setStep(1)}>
                        Close
                      </Button>
                    </Dialog.CloseTrigger>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </>
          )}
        </Dialog.Root>
      </Portal>
    </div>
  );
};
export default Owner;
