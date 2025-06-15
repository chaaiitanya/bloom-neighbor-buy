
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function ProfileQrShare() {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    // Shareable profile link
    const link = window.location.origin + "/profile";
    setQrUrl(link);
    QRCode.toDataURL(link).then(setQrDataUrl);
  }, []);
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="font-semibold mb-1 text-green-800">Share your profile</div>
      <img src={qrDataUrl} alt="QR code profile" className="w-28 h-28 rounded-lg border border-green-50 bg-white shadow-sm" />
      <div className="text-xs text-green-700 mt-2 break-all">{qrUrl}</div>
    </div>
  );
}
