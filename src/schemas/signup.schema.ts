import { z } from "zod";

export const signupSchema = z
  .object({
    // 이름: 2~10글자
    name: z
      .string()
      .min(2, "이름은 2글자 이상이어야 합니다")
      .max(10, "이름은 10글자 이하여야 합니다"),

    // 닉네임: 2~10글자
    nickname: z
      .string()
      .min(2, "닉네임은 2글자 이상이어야 합니다")
      .max(10, "닉네임은 10글자 이하여야 합니다"),

    // 이메일
    email: z.string().email("올바른 이메일 형식이 아닙니다"),

    // 비밀번호: 8자 이상, 영문/숫자/특수문자 포함
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
        "영문, 숫자, 특수문자를 포함해야 합니다"
      ),

    // 비밀번호 확인
    passwordConfirm: z.string(),

    // 주소
    address: z.object({
      zoneCode: z.string().min(1, "우편번호를 입력해주세요"),
      address: z.string().min(1, "주소를 입력해주세요"),
      detailAddress: z.string().min(1, "상세주소를 입력해주세요"),
    }),

    // 프로필 이미지
    profileImage: z.string().nullable(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"], // 에러
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
