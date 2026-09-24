import { redirect } from 'next/navigation';

export default async function WorkerBookPage({
  params,
}: {
  params: Promise<{ workerId: string }>;
}) {
  const { workerId } = await params;
  redirect(`/services?workerId=${encodeURIComponent(workerId)}`);
}
