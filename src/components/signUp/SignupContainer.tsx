"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "@/schemas/signup.schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BasicInfoStep from "./steps/BasicInfoStep";
import { ProfileStep } from "./steps/ProfileStep";
import { StepIndicator } from "./common/StepIndicator";
import { Button } from "@/components/ui/button";

// 회원가입 단계 정의
const SIGNUP_STEPS = [
  {
    id: 1,
    label: "기본정보",
    Component: BasicInfoStep,
    fields: [
      "name",
      "nickname",
      "email",
      "password",
      "passwordConfirm",
      "address.zoneCode",
      "address.address",
      "address.detailAddress",
    ],
  },
  {
    id: 2,
    label: "프로필설정",
    Component: ProfileStep,
    fields: ["profileImage"],
  },
] as const;

export function SignupContainer() {
  // 상태 관리
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  // React Hook Form 설정
  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      nickname: "",
      email: "",
      password: "",
      passwordConfirm: "",
      address: {
        zoneCode: "",
        address: "",
        detailAddress: "",
      },
      profileImage: null,
    },
  });

  // 현재 단계 정보
  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  const progress = (currentStep / (SIGNUP_STEPS.length - 1)) * 100;

  // 다음 단계로 이동
  const handleNext = async () => {
    const fields = currentStepData.fields;
    const isValid = await methods.trigger(fields);

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "모든 필수 항목을 올바르게 입력해주세요.",
      });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 폼 제출 처리
  const onSubmit = async (data: SignupFormValues) => {
    try {
      // 회원가입 mutation 작성ㅎㅏ기!!!
      console.log("회원가입 데이터:", data);

      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "회원가입 처리 중 오류가 발생했습니다.",
      });
    }
  };

  const StepComponent = currentStepData.Component;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* 진행 단계 표시 */}
          <div className="mb-8">
            <div className="relative">
              <div className="flex justify-around mb-2">
                {SIGNUP_STEPS.map((step) => (
                  <StepIndicator
                    key={step.id}
                    label={step.label}
                    step={step.id}
                    currentStep={currentStepData.id}
                  />
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 폼 영역 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* 현재 단계 컴포넌트 렌더링 */}
              <StepComponent />

              {/* 네비게이션 버튼 */}
              <div className="flex justify-between pt-4">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    이전
                  </Button>
                )}

                <Button
                  type={isLastStep ? "submit" : "button"}
                  onClick={isLastStep ? undefined : handleNext}
                  className={currentStep === 0 ? "ml-auto" : ""}
                >
                  {isLastStep ? "가입완료" : "다음"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
