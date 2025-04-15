import { createEmployee } from "@/api/freeeApi";
import { toaster } from "@/components/ui/toaster";
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
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResisterInfo } from "@/types/types";

const Owner = () => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [isResistering, setIsResistering] = useState(false);
  const [resisterEmp, setResisterEmp] = useState<ResisterInfo>({
    lineId: "",
    lastName: "",
    firstName: "",
    lastNameLabel: "",
    firstNameLabel: "",
    birthDate: "",
    entryDate: "",
  });
  const navigate = useNavigate();

  const resisterButton = () => {
    setOpen(true);
    setStep(1);
  };

  const resisterEmployee = async () => {
    setIsResistering(true);
    const newEmpId = await createEmployee(resisterEmp);
    console.log(newEmpId);
    toaster.create({
      title: "登録が完了しました",
      description: "従業員ID:" + newEmpId,
      type: "success",
    });
    setOpen(false);
  };
  return (
    <Flex align="center" justify="center" h="100vh">
      <Container maxW="md" centerContent gap="20px">
        <Heading>オーナー画面</Heading>
        <Button onClick={() => navigate("/owner/stampingHome")}>
          打刻画面
        </Button>
        <Button onClick={() => navigate("/checkWorkTime")}>
          月次勤怠時間画面
        </Button>
        <Button onClick={resisterButton}>新規従業員登録</Button>
        <Button onClick={() => navigate("/editCalender")}>
          出勤表編集画面
        </Button>
        <Button onClick={() => navigate("/")}>ホーム画面</Button>
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
                      <Field.Root required gap="10px">
                        <Field.Label>
                          LINE ID
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          placeholder="LINEメッセージで受け取ったIDを入力してください"
                          onChange={(e) =>
                            setResisterEmp({
                              ...resisterEmp,
                              lineId: e.target.value,
                            })
                          }
                        />
                        <Field.Label>
                          氏名
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Box display="flex" flexDirection="row" gap="8px">
                          <Input
                            placeholder="苗字"
                            onChange={(e) =>
                              setResisterEmp({
                                ...resisterEmp,
                                lastName: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="名前"
                            onChange={(e) =>
                              setResisterEmp({
                                ...resisterEmp,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </Box>
                        <Field.Label>
                          氏名（フリガナ）
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Box display="flex" flexDirection="row" gap="8px">
                          <Input
                            placeholder="苗字"
                            onChange={(e) =>
                              setResisterEmp({
                                ...resisterEmp,
                                lastNameLabel: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="名前"
                            onChange={(e) =>
                              setResisterEmp({
                                ...resisterEmp,
                                firstNameLabel: e.target.value,
                              })
                            }
                          />
                        </Box>
                        <Field.Label>
                          生年月日
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          type="date"
                          onChange={(e) =>
                            setResisterEmp({
                              ...resisterEmp,
                              birthDate: e.target.value,
                            })
                          }
                        />
                        <Field.Label>
                          入社日（本日の日付）
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                          type="date"
                          onChange={(e) =>
                            setResisterEmp({
                              ...resisterEmp,
                              entryDate: e.target.value,
                            })
                          }
                        />
                      </Field.Root>
                      <Button onClick={resisterEmployee}>登録</Button>
                      {isResistering ? (
                        <Heading size="md">登録処理中...</Heading>
                      ) : (
                        <></>
                      )}
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
