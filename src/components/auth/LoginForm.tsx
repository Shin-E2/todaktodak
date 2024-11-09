"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const { register, handleSubmit } = useForm();

  const onClickSubmit = async () => {
    // 로그인 로직 구현하기!!!!!
  };

  return (
    <form onSubmit={handleSubmit(onClickSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          type="text"
          placeholder="이메일를 입력하세요"
          {...register("email")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...register("password")}
        />
      </div>

      <Button className="w-full bg-indigo-600">로그인</Button>
    </form>
  );
}
