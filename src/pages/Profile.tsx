
import { ProfilePreview } from "@/components/ProfilePreview";
import BottomTabNav from "@/components/BottomTabNav";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white pb-20">
      <div className="p-6 flex flex-col items-center">
        <ProfilePreview name="Jamie Lin" rating={4.8} sales={18} avatar={undefined} />
        <div className="mt-2 text-green-700 text-xl font-semibold">Jamie Lin</div>
        <div className="text-gray-400 mb-6">Plant Seller · 0.4 mi away</div>
        <div className="w-full bg-white rounded-2xl p-4 border shadow">
          <div className="font-semibold text-green-800 mb-2">Listings</div>
          <ul className="space-y-2 text-green-800">
            <li>Monstera Deliciosa – $18</li>
            <li>Aloe Vera – $6</li>
          </ul>
        </div>
      </div>
      <BottomTabNav />
    </div>
  );
}
