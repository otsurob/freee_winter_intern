import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setStep(1)}>
            Edit Profile
          </Button>
        </DialogTrigger>
        {step === 1 ? (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Resister LINE Account</DialogTitle>
              <DialogDescription>Read QR Code</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setStep(2)}>Next Page</Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>従業員情報入力</DialogTitle>
              <DialogDescription>情報を入力して下さい</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={() => setStep(1)}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
export default Owner;
