import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SiteForm from "@/components/sites/SiteForm";
import { createSite } from "../actions";

export const metadata: Metadata = { title: "내 홈페이지 소개하기" };

export default async function NewSitePage() {
  await requireUser();
  return (
    <div className="container-page max-w-3xl py-10">
      <PageHeader eyebrow="sites / new" title="내 홈페이지 소개하기" description="직접 만든 홈페이지를 동지들에게 보여주세요." />
      <div className="mt-6">
        <SiteForm action={createSite} submitLabel="소개하기" />
      </div>
    </div>
  );
}
