import {
  Dialog,
  Portal,
  Button,
  Input,
  Field,
  Flex,
  Container,
  Image,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Owner = () => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const resisterButton = () => {
    setOpen(true);
    setStep(1);
  };
  return (
    <Flex align="center" justify="center" h="100vh">
      <Container maxW="md" centerContent>
        <Heading>オーナー画面</Heading>
        <Button onClick={() => navigate("/owner/stampingHome")}>
          打刻画面へ
        </Button>
        <Button onClick={resisterButton}>新規従業員登録</Button>
        <Portal>
          <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            {step === 1 ? (
              <>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content className="sm:max-w-[425px]">
                    <Dialog.Header>
                      <Dialog.Title>LINE アカウントの登録</Dialog.Title>
                      <Dialog.Description>
                        QRコードを読み取ってください
                      </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Image src="qr.png" />
                    </Dialog.Body>
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
      </Container>
    </Flex>
  );
};
export default Owner;
