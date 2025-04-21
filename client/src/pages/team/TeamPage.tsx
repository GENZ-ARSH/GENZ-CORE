import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TeamMemberCard from "./components/TeamMemberCard";

const TeamPage = () => {
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['/api/team'],
    queryFn: async () => {
      const res = await fetch('/api/team');
      if (!res.ok) throw new Error('Failed to fetch team members');
      return res.json();
    },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">TeamGENZ Dashboard</h1>
        <div className="mt-3 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            <i className="ri-user-add-line mr-2"></i>
            Add Team Member
          </button>
        </div>
      </div>

      {/* Team Progress */}
      <Card className="mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Team Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">NEET Resources</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <Progress value={75} className="h-2.5" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">JEE Resources</span>
              <span className="text-sm font-medium">90%</span>
            </div>
            <Progress
              value={90}
              className="h-2.5 bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-green-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">12th Class Resources</span>
              <span className="text-sm font-medium">60%</span>
            </div>
            <Progress
              value={60}
              className="h-2.5 bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-yellow-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">11th Class Resources</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <Progress
              value={45}
              className="h-2.5 bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array(4)
              .fill(null)
              .map((_, i) => (
                <Card
                  key={i}
                  className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))
          : teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
      </div>
    </div>
  );
};

export default TeamPage;
