import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ProfileForms from "./ProfileForms";

export const metadata: Metadata = { title: "내 프로필" };

export default async function ProfilePage() {
  const me = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: me.id },
    select: { name: true, email: true, bio: true, github: true },
  });

  return (
    <div className="container-page max-w-2xl py-10">
      <PageHeader eyebrow="profile" title="내 프로필" description={user.email} />
      <div className="mt-6">
        <ProfileForms user={user} />
      </div>
    </div>
  );
}
