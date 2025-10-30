import './GlassIcon.css';

interface GlassIconItem {
  icon: React.ReactNode;
  label: string;
  color: string;
  customClass?: string;
  onClick?: () => void;
}

interface GlassIconProps {
  items: GlassIconItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(135deg, hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(135deg, hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(135deg, hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(135deg, hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(135deg, hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(135deg, hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
  pink: 'linear-gradient(135deg, hsl(339, 82%, 61%), hsl(280, 78%, 59%))',
  cyan: 'linear-gradient(135deg, hsl(199, 89%, 48%), hsl(262, 83%, 58%))'
};

export const GlassIcon = ({ items, className }: GlassIconProps) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`glass-icon-container ${className || ''}`}>
      {items.map((item, index) => (
        <button
          key={index}
          className={`glass-icon-btn ${item.customClass || ''}`}
          aria-label={item.label}
          type="button"
          onClick={item.onClick}
        >
          <span className="glass-icon-back" style={getBackgroundStyle(item.color)}></span>
          <span className="glass-icon-front">
            <span className="glass-icon-symbol" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <span className="glass-icon-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
