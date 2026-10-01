"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ProGate({
  children,
  feature,
}: {
  children: React.ReactNode;
  feature: string;
}) {
  const router = useRouter();
  const [paket, setPaket] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tenant/me")
      .then((r) => r.json())
      .then((d) => setPaket(d?.data?.Paket === "pro" ? "pro" : "free"))
      .catch(() => setPaket("free"));
  }, []);

  if (paket === null) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (paket !== "pro") {
    return (
      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900">Fitur Pro: {feature}</h3>
          <p className="text-gray-500 mt-2">
            Upgrade ke paket Pro untuk menggunakan fitur ini.
          </p>
          <Button variant="gold" className="mt-4" onClick={() => router.push("/upgrade")}>
            Upgrade ke Pro
          </Button>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
