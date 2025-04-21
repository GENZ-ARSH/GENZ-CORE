
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProgressChart() {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Study Hours',
      data: [10, 15, 8, 12],
      borderColor: 'rgb(99, 102, 241)',
      tension: 0.3
    }]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} />
      </CardContent>
    </Card>
  );
}
