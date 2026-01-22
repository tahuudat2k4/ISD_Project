// Teacher management
let teachers = [];
let editingTeacherId = null;

// Load teachers from localStorage
function loadTeachers() {
    const stored = localStorage.getItem('teachers');
    teachers = stored ? JSON.parse(stored) : [];
    renderTeachers();
}

// Save teachers to localStorage
function saveTeachers() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
}

// Render teachers table
function renderTeachers() {
    const tbody = document.getElementById('teachersTableBody');
    
    if (teachers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <h3>Chưa có giáo viên nào</h3>
                    <p>Nhấn nút "Thêm Giáo viên" để bắt đầu</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = teachers.map(teacher => `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.class}</td>
            <td class="action-buttons">
                <button class="btn btn-warning btn-small" onclick="editTeacher(${teacher.id})">Sửa</button>
                <button class="btn btn-danger btn-small" onclick="deleteTeacher(${teacher.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Add new teacher
function addTeacher(teacherData) {
    const newId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
    teachers.push({ id: newId, ...teacherData });
    saveTeachers();
    renderTeachers();
}

// Update teacher
function updateTeacher(id, teacherData) {
    const index = teachers.findIndex(t => t.id === id);
    if (index !== -1) {
        teachers[index] = { id, ...teacherData };
        saveTeachers();
        renderTeachers();
    }
}

// Edit teacher
function editTeacher(id) {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    
    editingTeacherId = id;
    document.getElementById('modalTitle').textContent = 'Sửa Giáo viên';
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherEmail').value = teacher.email;
    document.getElementById('teacherPhone').value = teacher.phone;
    document.getElementById('teacherSubject').value = teacher.subject;
    document.getElementById('teacherClass').value = teacher.class;
    
    openModal();
}

// Delete teacher
function deleteTeacher(id) {
    if (confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
        teachers = teachers.filter(t => t.id !== id);
        saveTeachers();
        renderTeachers();
    }
}

// Modal functions
function openModal() {
    document.getElementById('teacherModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('teacherModal').style.display = 'none';
    document.getElementById('teacherForm').reset();
    editingTeacherId = null;
    document.getElementById('modalTitle').textContent = 'Thêm Giáo viên';
}

// Event listeners
document.getElementById('addTeacherBtn').addEventListener('click', openModal);

document.querySelector('.close').addEventListener('click', closeModal);

document.getElementById('cancelBtn').addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('teacherModal');
    if (event.target === modal) {
        closeModal();
    }
});

document.getElementById('teacherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const teacherData = {
        name: document.getElementById('teacherName').value,
        email: document.getElementById('teacherEmail').value,
        phone: document.getElementById('teacherPhone').value,
        subject: document.getElementById('teacherSubject').value,
        class: document.getElementById('teacherClass').value
    };
    
    if (editingTeacherId) {
        updateTeacher(editingTeacherId, teacherData);
    } else {
        addTeacher(teacherData);
    }
    
    closeModal();
});

// Initialize
loadTeachers();
