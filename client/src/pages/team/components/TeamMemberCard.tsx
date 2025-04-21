import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TeamMember } from "@shared/schema";

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  const completionPercentage = 
    member.totalTasks > 0 
      ? Math.round((member.tasksCompleted / member.totalTasks) * 100) 
      : 0;

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 text-center">
        <img
          src={member.avatar}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          alt={`${member.name} profile`}
        />
        <h3 className="text-lg font-semibold">{member.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {member.role}
        </p>

        <div className="mt-4 flex justify-center space-x-2">
          {member.socialLinks && Object.entries(member.socialLinks).map(([platform, url]) => (
            <a 
              key={platform} 
              href={url as string} 
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`ri-${platform}-${platform === 'email' ? 'fill' : 'box-fill'} text-lg`}></i>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span>Tasks Completed</span>
          <span className="font-medium">
            {member.tasksCompleted}/{member.totalTasks}
          </span>
        </div>
        <Progress value={completionPercentage} className="h-1.5 mb-3" />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Role
            </span>
            <p className="text-sm font-medium">
              {member.role.split(' ')[0]}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Joined
            </span>
            <p className="text-sm font-medium">{member.joinedDate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberCard;
