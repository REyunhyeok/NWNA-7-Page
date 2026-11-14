"use client";

import { useRef } from "react";
import SubmitButton from "@/components/SubmitButton";

export default function CommentForm({
  action,
  placeholder = "사용 후기나 개선 아이디어를 남겨주세요",
}: {
  action: (fd: FormData) => Promise<void>;
  placeholder?: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await action(fd);
        ref.current?.reset();
      }}
      className="mt-4 flex gap-2"
    >
      <input name="body" required maxLength={1000} className="input" placeholder={placeholder} />
      <SubmitButton className="btn-primary shrink-0" pendingText="등록 중">등록</SubmitButton>
    </form>
  );
}
