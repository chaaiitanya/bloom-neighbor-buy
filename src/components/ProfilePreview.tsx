
type ProfileProps = {
  name: string;
  avatar?: string;
  rating?: number;
  sales?: number;
};

export function ProfilePreview({ name, avatar, rating = 4.6, sales = 22 }: ProfileProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name)}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-green-100 bg-green-50"
      />
      <div>
        <div className="text-sm font-semibold text-green-800">{name}</div>
        <div className="text-xs text-gray-500">
          ⭐ {rating} · {sales} sales
        </div>
      </div>
    </div>
  );
}
