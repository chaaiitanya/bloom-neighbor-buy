
import PostPlantForm from "@/components/PostPlantForm";
import BottomTabNav from "@/components/BottomTabNav";

export default function Post() {
  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white">
      <h2 className="pt-8 text-center text-green-900 font-bold text-2xl">Post a Plant</h2>
      <div className="flex-1 mt-4 px-3">
        <PostPlantForm />
      </div>
      <BottomTabNav />
    </div>
  );
}
