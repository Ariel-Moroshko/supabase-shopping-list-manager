import { selectOneListForCronJob } from "@/lib/db/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await selectOneListForCronJob();
  return Response.json({
    success: true,
    randomNum: Math.random(),
  });
}
