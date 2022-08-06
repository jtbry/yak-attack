interface YikyakAvatarProps {
  emoji: string;
  color: string;
  isMe?: boolean;
  onClick?: () => void;
}

const YikyakAvatar = ({ emoji, color, isMe, onClick }: YikyakAvatarProps) => {
  if (isMe) emoji = 'ME';
  return (
    <div
      className="p-2 rounded-full w-fit"
      style={{
        backgroundColor: color ?? 'gray',
        cursor: onClick ? 'pointer' : 'inherit',
      }}
      onClick={onClick}
    >
      <span className="text-xl flex items-center justify-center font-bold">
        {emoji ?? '???'}
      </span>
    </div>
  );
};

export default YikyakAvatar;
