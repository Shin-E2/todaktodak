import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useRef, useState } from "react";
import type { SignupFormValues } from "@/schemas/signup.schema";
import { X } from "lucide-react";

// 기본 프로필 이미지 경로
const DEFAULT_PROFILE_IMAGE = "/images/default-profile.png";

export function ProfileStep() {
  // React Hook Form의 메서드들을 가져옴
  const { setValue } = useFormContext<SignupFormValues>();

  // 파일 입력을 위한 ref
  const fileRef = useRef<HTMLInputElement>(null);

  // 선택된 이미지 파일 상태
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // 삭제 아이콘 표시 여부 상태
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  // 이미지 클릭 시 파일 선택 다이얼로그 표시
  const handleImageClick = () => {
    fileRef.current?.click();
  };

  // 파일 선택 시 처리
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 유효성 검사
    if (!file.type.includes("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 선택된 이미지 설정
    setSelectedImage(file);
    // 폼 데이터에 이미지 설정
    setValue("profileImage", file);
  };

  // 이미지 삭제 처리
  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setSelectedImage(null);
    setValue("profileImage", DEFAULT_PROFILE_IMAGE);
    // 파일 입력 초기화
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-xl font-semibold">프로필 설정</h2>

      {/* 이미지 업로드 영역 */}
      <div className="flex flex-col items-center">
        {/* 이미지 미리보기 */}
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 cursor-pointer"
          onClick={handleImageClick}
          onMouseEnter={() => selectedImage && setShowDeleteIcon(true)}
          onMouseLeave={() => setShowDeleteIcon(false)}
        >
          <Image
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : DEFAULT_PROFILE_IMAGE
            }
            alt="Profile Preview"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />

          {/* 삭제 아이콘 오버레이 */}
          {showDeleteIcon && selectedImage && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity"
              onClick={handleDeleteImage}
            >
              <X className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 안내 텍스트 */}
        <p className="text-sm text-gray-500 mt-2">
          {selectedImage
            ? "이미지를 변경하려면 클릭하세요"
            : "클릭하여 프로필 사진을 선택하세요"}
        </p>
      </div>
    </div>
  );
}
