// Initialize sample data if not exists
function initializeData() {
    if (!localStorage.getItem('teachers')) {
        const sampleTeachers = [
            {
                id: 1,
                name: 'Nguyễn Thị Mai',
                email: 'mai.nguyen@example.com',
                phone: '0901234567',
                subject: 'Toán',
                class: 'Mẫu giáo 5 tuổi'
            },
            {
                id: 2,
                name: 'Trần Văn Hùng',
                email: 'hung.tran@example.com',
                phone: '0912345678',
                subject: 'Tiếng Việt',
                class: 'Mẫu giáo 4 tuổi'
            }
        ];
        localStorage.setItem('teachers', JSON.stringify(sampleTeachers));
    }

    if (!localStorage.getItem('students')) {
        const sampleStudents = [
            {
                id: 1,
                name: 'Lê Minh Anh',
                dob: '2020-05-15',
                gender: 'Nữ',
                class: 'Mẫu giáo 5 tuổi',
                parent: 'Lê Văn An',
                phone: '0923456789'
            },
            {
                id: 2,
                name: 'Phạm Đức Nam',
                dob: '2021-03-20',
                gender: 'Nam',
                class: 'Mẫu giáo 4 tuổi',
                parent: 'Phạm Văn Đức',
                phone: '0934567890'
            },
            {
                id: 3,
                name: 'Hoàng Thị Lan',
                dob: '2021-07-10',
                gender: 'Nữ',
                class: 'Mẫu giáo 4 tuổi',
                parent: 'Hoàng Văn Long',
                phone: '0945678901'
            }
        ];
        localStorage.setItem('students', JSON.stringify(sampleStudents));
    }
}

// Get statistics
function getStatistics() {
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    // Count unique classes
    const classes = new Set();
    teachers.forEach(t => classes.add(t.class));
    students.forEach(s => classes.add(s.class));
    
    const totalClasses = classes.size;
    const avgStudentsPerClass = totalClasses > 0 ? Math.round(students.length / totalClasses) : 0;
    
    return {
        totalTeachers: teachers.length,
        totalStudents: students.length,
        totalClasses: totalClasses,
        avgStudentsPerClass: avgStudentsPerClass
    };
}

// Update dashboard
function updateDashboard() {
    initializeData();
    const stats = getStatistics();
    
    document.getElementById('totalTeachers').textContent = stats.totalTeachers;
    document.getElementById('totalStudents').textContent = stats.totalStudents;
    document.getElementById('totalClasses').textContent = stats.totalClasses;
    document.getElementById('avgStudentsPerClass').textContent = stats.avgStudentsPerClass;
}

// Run on page load
updateDashboard();
