// Student management
let students = [];
let editingStudentId = null;

// Load students from localStorage
function loadStudents() {
    const stored = localStorage.getItem('students');
    students = stored ? JSON.parse(stored) : [];
    renderStudents();
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Render students table
function renderStudents() {
    const tbody = document.getElementById('studentsTableBody');
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <h3>Chưa có học sinh nào</h3>
                    <p>Nhấn nút "Thêm Học sinh" để bắt đầu</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${formatDate(student.dob)}</td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.parent}</td>
            <td>${student.phone}</td>
            <td class="action-buttons">
                <button class="btn btn-warning btn-small" onclick="editStudent(${student.id})">Sửa</button>
                <button class="btn btn-danger btn-small" onclick="deleteStudent(${student.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Format date to dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Add new student
function addStudent(studentData) {
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.push({ id: newId, ...studentData });
    saveStudents();
    renderStudents();
}

// Update student
function updateStudent(id, studentData) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { id, ...studentData };
        saveStudents();
        renderStudents();
    }
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    editingStudentId = id;
    document.getElementById('modalTitle').textContent = 'Sửa Học sinh';
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentDob').value = student.dob;
    document.getElementById('studentGender').value = student.gender;
    document.getElementById('studentClass').value = student.class;
    document.getElementById('studentParent').value = student.parent;
    document.getElementById('studentPhone').value = student.phone;
    
    openModal();
}

// Delete student
function deleteStudent(id) {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderStudents();
    }
}

// Modal functions
function openModal() {
    document.getElementById('studentModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
    document.getElementById('studentForm').reset();
    editingStudentId = null;
    document.getElementById('modalTitle').textContent = 'Thêm Học sinh';
}

// Event listeners
document.getElementById('addStudentBtn').addEventListener('click', openModal);

document.querySelector('.close').addEventListener('click', closeModal);

document.getElementById('cancelBtn').addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeModal();
    }
});

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById('studentName').value,
        dob: document.getElementById('studentDob').value,
        gender: document.getElementById('studentGender').value,
        class: document.getElementById('studentClass').value,
        parent: document.getElementById('studentParent').value,
        phone: document.getElementById('studentPhone').value
    };
    
    if (editingStudentId) {
        updateStudent(editingStudentId, studentData);
    } else {
        addStudent(studentData);
    }
    
    closeModal();
});

// Initialize
loadStudents();
