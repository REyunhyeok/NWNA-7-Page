import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SiteForm from "@/components/sites/SiteForm";
import { updateSite } from "../../actions";

export default async function EditSitePage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const site = await prisma.site.findUnique({ where: { id: params.id } });
  if (!site) notFound();
  if (site.authorId !== user.id && user.role !== "ADMIN") redirect(`/sites/${site.id}`);

  return (
    <div className="container-page max-w-3xl py-10">
      <PageHeader eyebrow="sites / edit" title="홈페이지 소개 수정" />
      <div className="mt-6">
        <SiteForm action={updateSite.bind(null, site.id)} initial={site} submitLabel="수정 완료" />
      </div>
    </div>
  );
}
