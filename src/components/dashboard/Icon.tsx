type IconName =
  | 'history'
  | 'plus'
  | 'shield'
  | 'dashboard'
  | 'group'
  | 'box'
  | 'settings';

type IconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, string> = {
  history:
    'M12 8v5l3 2m6-3a9 9 0 11-3.16-6.84M21 3v6h-6',
  plus: 'M12 5v14m-7-7h14',
  shield:
    'M12 3l7 4v5c0 4.08-2.55 7.56-7 9-4.45-1.44-7-4.92-7-9V7l7-4z',
  dashboard:
    'M4 5h7v7H4V5zm9 0h7v4h-7V5zM4 14h7v5H4v-5zm9-3h7v8h-7v-8z',
  group:
    'M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  box: 'M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4m-18 0v5l9 4 9-4v-5',
  settings:
    'M12 8.5A3.5 3.5 0 1112 15.5 3.5 3.5 0 0112 8.5zm7.94 4a7.96 7.96 0 000-1l2.03-1.58-2-3.46-2.39.74a8.13 8.13 0 00-.87-.5l-.36-2.47h-4l-.36 2.47c-.3.14-.59.31-.87.5l-2.39-.74-2 3.46L4.06 11.5a7.96 7.96 0 000 1l-2.03 1.58 2 3.46 2.39-.74c.28.19.57.36.87.5l.36 2.47h4l.36-2.47c.3-.14.59-.31.87-.5l2.39.74 2-3.46L19.94 12.5z',
};

export default function Icon({ name, className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}