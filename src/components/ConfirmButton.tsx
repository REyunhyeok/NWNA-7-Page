"use client";

import { useFormStatus } from "react-dom";

/** form 안에서 사용. 클릭 시 confirm 창을 띄우고 취소하면 제출을 막는다. */
export default function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "처리 중…" : children}
    </button>
  );
}
