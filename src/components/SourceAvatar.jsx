const SourceAvatar = ({ initials, name }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#003165] rounded flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{initials}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">{name}</span>
    </div>
  );
};

export default SourceAvatar;
