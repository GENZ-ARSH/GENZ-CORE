import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: "primary" | "secondary" | "accent" | "yellow";
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const StatsCard = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  actionLabel,
  onAction,
}: StatsCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary-100 dark:bg-primary-900/30",
          text: "text-primary-600 dark:text-primary-400",
        };
      case "secondary":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400",
        };
      case "accent":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400",
        };
      case "yellow":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-600 dark:text-yellow-400",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const colorClasses = getColorClasses();

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toString();
  };

  return (
    <Card className="p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center">
        <div
          className={`p-3 rounded-full ${colorClasses.bg} ${colorClasses.text} mr-4`}
        >
          <i className={`${icon} text-xl`}></i>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold">{formatValue(value)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend ? (
          <>
            <span
              className={`${
                trend.direction === "up"
                  ? "text-green-500"
                  : "text-red-500"
              } flex items-center`}
            >
              <i
                className={`${
                  trend.direction === "up"
                    ? "ri-arrow-up-s-line"
                    : "ri-arrow-down-s-line"
                } mr-1`}
              ></i>
              {trend.value}
            </span>
            {subtitle && (
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                {subtitle}
              </span>
            )}
          </>
        ) : (
          subtitle && (
            <span className="text-gray-500 dark:text-gray-400">{subtitle}</span>
          )
        )}
        {actionLabel && (
          <button
            onClick={onAction}
            className="ml-2 text-primary-600 dark:text-primary-400 font-medium"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
