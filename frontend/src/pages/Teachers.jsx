import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { teacherAPI } from '../services/api';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    subject: '',
    experience: 0,
    joinDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await teacherAPI.getAll();
      setTeachers(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teacherAPI.update(editingTeacher._id, formData);
        toast.success('Cập nhật giáo viên thành công');
      } else {
        await teacherAPI.create(formData);
        toast.success('Thêm giáo viên thành công');
      }
      fetchTeachers();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        await teacherAPI.delete(id);
        toast.success('Xóa giáo viên thành công');
        fetchTeachers();
      } catch (error) {
        toast.error('Không thể xóa giáo viên');
      }
    }
  };

  const openModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address || '',
        dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
        subject: teacher.subject,
        experience: teacher.experience || 0,
        joinDate: teacher.joinDate ? new Date(teacher.joinDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        subject: '',
        experience: 0,
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý giáo viên</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm giáo viên</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kinh nghiệm
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.experience} năm</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(teacher)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTeacher ? 'Chỉnh sửa giáo viên' : 'Thêm giáo viên mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kinh nghiệm (năm)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu làm việc
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTeacher ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
