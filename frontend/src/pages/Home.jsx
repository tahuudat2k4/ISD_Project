import { Link } from 'react-router';
import { Users, GraduationCap, BookOpen, Award } from 'lucide-react';

function Home() {
  const stats = [
    {
      name: 'Giáo viên',
      icon: Users,
      color: 'bg-blue-500',
      link: '/teachers',
    },
    {
      name: 'Học sinh',
      icon: GraduationCap,
      color: 'bg-green-500',
      link: '/students',
    },
    {
      name: 'Lớp học',
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      name: 'Thành tích',
      icon: Award,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Trường Mầm Non Hiền Giang
        </h2>
        <p className="text-lg text-gray-600">
          Hệ thống quản lý giáo viên và học sinh hiện đại, dễ sử dụng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Component = stat.link ? Link : 'div';
          const componentProps = stat.link ? { to: stat.link } : {};

          return (
            <Component
              key={stat.name}
              {...componentProps}
              className={`bg-white rounded-lg border border-gray-200 p-6 ${
                stat.link ? 'hover:border-blue-300 transition-colors cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Component>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/teachers"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Quản lý giáo viên</span>
          </Link>
          <Link
            to="/students"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <GraduationCap className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Quản lý học sinh</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
