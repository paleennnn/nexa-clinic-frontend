import { useState } from "react";
import Tabs from "../../components/ui/Tabs";
import PoliTab from "./PoliTab";
import DoctorTab from "./DoctorTab";

const TABS = [
  { value: "poli", label: "Poli" },
  { value: "doctors", label: "Dokter" },
];

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("poli");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-ink">Master Data Pendukung</h2>
        <p className="text-sm text-ink-soft">
          Kelola data Poli dan Dokter — dipakai sebagai referensi saat pendaftaran pasien.
        </p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === "poli" ? <PoliTab /> : <DoctorTab />}
    </div>
  );
}
