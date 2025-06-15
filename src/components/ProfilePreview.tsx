
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
  // Compute full display name per rules:
  let displayName = "";
  if (firstName && lastName) {
    displayName = `${firstName} ${lastName}`;
  } else if (fullName && fullName.trim().length > 0) {
    displayName = fullName;
  } else {
    displayName = "Unknown Seller";
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
        {/* 
          Focus: This is your selected section. 
          It will now always show the computed displayName with the logic above,
          so it shows 'First Last', or 'Full Name', or 'Unknown Seller'.
        */}
        <div className="text-sm font-semibold text-green-800">{displayName}</div>
      </div>
    </div>
  );
}

