type AvatarProps = {
  name: string;
  src?: string;
};

export function Avatar({ name, src }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part.at(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return <img className="ui-avatar" src={src} alt={name} />;
  }

  return (
    <span className="ui-avatar" aria-label={name}>
      {initials}
    </span>
  );
}
