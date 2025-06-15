
type ProfileProps = {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rating?: number;
  sales?: number;
};

export function ProfilePreview({
  fullName,
  firstName,
  lastName,
  avatar,
}: ProfileProps) {
  // Final name display logic
  let displayName = "Unknown Seller";
  if (firstName && lastName) {
    displayName = `${firstName} ${lastName}`;
  } else if (fullName) {
    displayName = fullName;
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={
          avatar ||
          "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(displayName)
        }
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover border-2 border-green-100 bg-green-50"
      />
      <div>
        <div className="text-sm font-semibold text-green-800">{displayName}</div>
      </div>
    </div>
  );
}

