import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { MapPin } from "lucide-react";
import { ProfilePreview } from "@/components/ProfilePreview";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

type Plant = {
  image: string;
  name: string;
  price: string;
  distance: string;
  location: string;
  seller: string;
  sellerId?: string;
  sellerAvatar?: string;
  sellerRating?: number;
  sellerSales?: number;
  additionalDetails?: string;
  type?: string;
};

interface PlantDetailDrawerProps {
  open: boolean;
  plant?: Plant;
  onClose: () => void;
}

export default function PlantDetailDrawer({ open, plant, onClose }: PlantDetailDrawerProps) {
  const [showChat, setShowChat] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get current user id
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user?.id) setMyUserId(data.user.id);
      else setMyUserId(null);
    });
  }, []);

  // Hide chat when drawer closes or plant changes
  useEffect(() => {
    setShowChat(false);
  }, [open, plant]);

  if (!plant) return null;

  // Only allow show chat button to logged-in users that are not the seller
  const canChat = plant.sellerId && myUserId && myUserId !== plant.sellerId;

  // Guest messaging: if NOT logged in, prompt login and redirect back here
  const handleMessageSeller = () => {
    if (!myUserId) {
      // Save current path and plant info to redirect back after login
      // We'll send ?redirectTo=<current path with state>
      const params = new URLSearchParams();
      params.set("redirectTo", location.pathname + location.search + location.hash);
      // Optionally: can also pass plant id in state, if you want to reopen this drawer after login
      navigate(`/auth?${params.toString()}`);
      return;
    }
    setShowChat(true);
  };

  return (
    <Drawer open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DrawerContent className="max-w-md mx-auto w-full p-0 rounded-t-2xl pb-6">
        <DrawerHeader className="p-0">
          <div className="relative">
            <img src={plant.image} alt={plant.name} className="w-full h-56 object-cover rounded-t-2xl" style={{ background: "#f6faf7" }} />
            <DrawerClose className="absolute top-3 right-3 z-10 bg-white rounded-full shadow p-1 hover:bg-green-50 transition">
              <span className="sr-only">Close</span>
              <svg width={22} height={22} viewBox="0 0 22 22" fill="none"><path d="M6 6L11 11M11 11L16 16M11 11L16 6M11 11L6 16" stroke="#3B7C41" strokeWidth="2" strokeLinecap="round"/></svg>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-5 pt-5">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold text-green-700">{plant.name}</h2>
            <div className="text-green-800 font-bold text-lg">{plant.price}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <MapPin className="w-4 h-4 text-green-400" />
            <span>{plant.location}</span>
            <span>• {plant.distance} away</span>
          </div>
          <div className="my-3">
            <span className="block text-green-600 font-medium mb-1">Additional Details</span>
            <div className="text-sm text-gray-600 min-h-[36px]">
              {plant.additionalDetails || "No extra details provided."}
            </div>
          </div>
          <div className="border-t border-green-100 mt-4 pt-3">
            <span className="block text-green-600 font-medium mb-1">Seller Information</span>
            <ProfilePreview
              name={plant.seller}
              avatar={plant.sellerAvatar}
              rating={plant.sellerRating ?? 4.6}
              sales={plant.sellerSales ?? 22}
            />
          </div>
          {/* Message Seller Button + Chat */}
          {/* Show button if I'm NOT the seller */}
          {plant.sellerId && myUserId !== plant.sellerId && !showChat && (
            <div className="mt-5 flex justify-center">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
                onClick={handleMessageSeller}
              >
                Message Seller
              </button>
            </div>
          )}
          {/* If logged in and showChat is true, show ChatBox */}
          {plant.sellerId && myUserId && myUserId !== plant.sellerId && showChat && (
            <div className="mt-5">
              <ChatBox
                otherUserId={plant.sellerId}
                myUserId={myUserId}
                onClose={() => setShowChat(false)}
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
