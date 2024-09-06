let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

// Function to update the table with subjects data
function updateTable() {
    const tableBody = document.getElementById('subjectTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    const subjectSelect = document.getElementById('selectedSubject');
    subjectSelect.innerHTML = ''; // Clear existing options

    subjects.forEach((subject, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = subject.name;
        row.insertCell(1).textContent = subject.type;
        
        // Total Hours with increment and decrement buttons
        const totalHoursCell = row.insertCell(2);
        totalHoursCell.innerHTML = `
            <button class="btn small-btn" onclick="changeTotalHours(${index}, -1)">-</button>
            ${subject.totalHours}
            <button class="btn small-btn" onclick="changeTotalHours(${index}, 1)">+</button>
        `;
        
        // Attended Hours with increment and decrement buttons
        const attendedHoursCell = row.insertCell(3);
        attendedHoursCell.innerHTML = `
            <button class="btn small-btn" onclick="changeAttendedHours(${index}, -1)">-</button>
            ${subject.attendedHours}
            <button class="btn small-btn" onclick="changeAttendedHours(${index}, 1)">+</button>
        `;

        row.insertCell(4).textContent = `${subject.attendancePercentage.toFixed(2)}%`;

        // Remove button with confirmation
        const actionsCell = row.insertCell(5);
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'btn';
        removeButton.onclick = () => {
            if (confirm('Are you sure you want to remove this subject?')) {
                subjects.splice(index, 1);
                localStorage.setItem('subjects', JSON.stringify(subjects));
                updateTable();
                updateOverallAttendance();
            }
        };
        actionsCell.appendChild(removeButton);
        
        // Populate subject selection dropdown for adding classes
        const option = document.createElement('option');
        option.value = index;
        option.textContent = subject.name;
        subjectSelect.appendChild(option);
    });

    updateOverallAttendance();
}

// Function to add or update a subject
function addSubject() {
    const name = document.getElementById('subjectName').value.trim();
    const type = document.getElementById('subjectType').value;
    const totalHours = parseInt(document.getElementById('totalHours').value, 10);
    const attendedHours = parseInt(document.getElementById('attendedHours').value, 10);

    if (name === '' || isNaN(totalHours) || isNaN(attendedHours)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const existingSubject = subjects.find(subject => subject.name === name);

    if (existingSubject) {
        existingSubject.type = type;
        existingSubject.totalHours = totalHours;
        existingSubject.attendedHours = attendedHours;
        existingSubject.attendancePercentage = (attendedHours / totalHours) * 100;
    } else {
        subjects.push({
            name,
            type,
            totalHours,
            attendedHours,
            attendancePercentage: (attendedHours / totalHours) * 100
        });
    }

    localStorage.setItem('subjects', JSON.stringify(subjects));
    updateTable();
    document.getElementById('subjectForm').reset();
}

// Function to change the attended hours (increment or decrement)
function changeAttendedHours(index, change) {
    const subject = subjects[index];
    let increment = subject.type === 'lab' ? 2 : 1.5; // Set increment based on subject type
    subject.attendedHours = Math.max(0, subject.attendedHours + (increment * change)); // Prevent negative attended hours
    subject.attendancePercentage = (subject.attendedHours / subject.totalHours) * 100;
    localStorage.setItem('subjects', JSON.stringify(subjects));
    updateTable();
}

// Function to change the total hours (increment or decrement)
// Function to change the total hours (increment or decrement)
function changeTotalHours(index, change) {
    const subject = subjects[index];
    let increment = subject.type === 'lab' ? 2 : 1.5; // Set increment based on subject type
    subject.totalHours = Math.max(0, subject.totalHours + (increment * change)); // Prevent negative total hours
    subject.attendancePercentage = (subject.attendedHours / subject.totalHours) * 100;
    localStorage.setItem('subjects', JSON.stringify(subjects));
    updateTable();
}


// Function to add a class to a subject
// Function to add a class to a subject
function addClass() {
    const subjectIndex = parseInt(document.getElementById('selectedSubject').value, 10);
    const classDate = document.getElementById('classDate').value;

    if (isNaN(subjectIndex) || !classDate) {
        alert('Please select a subject and enter a class date.');
        return;
    }

    const subject = subjects[subjectIndex];

    // Adjust hours based on subject type (theory or lab)
    const classDuration = subject.type === 'lab' ? 2 : 1.5; // 2 hours for lab, 1.5 hours for theory
    subject.totalHours += classDuration;
    subject.attendancePercentage = (subject.attendedHours / subject.totalHours) * 100;

    localStorage.setItem('subjects', JSON.stringify(subjects));
    updateTable();
    document.getElementById('classForm').reset();
    document.getElementById('addClassSection').style.display = 'none';
}


// Function to update overall attendance percentage
function updateOverallAttendance() {
    const totalHours = subjects.reduce((sum, subject) => sum + subject.totalHours, 0);
    const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedHours, 0);

    const overallPercentage = totalHours > 0 ? (totalAttended / totalHours) * 100 : 0;
    document.getElementById('overallAttendance').textContent = `${overallPercentage.toFixed(2)}%`;
}

// Function to handle Enter key to move to the next input field
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission behavior
        const inputs = Array.from(document.querySelectorAll('#subjectForm input'));
        const currentIndex = inputs.indexOf(event.target);
        const nextIndex = currentIndex + 1;

        if (nextIndex < inputs.length) {
            inputs[nextIndex].focus();
        } else {
            addSubject();
        }
    }
}

// Attach keydown event listeners to input fields
document.getElementById('subjectName').addEventListener('keydown', handleEnterKey);
document.getElementById('totalHours').addEventListener('keydown', handleEnterKey);
document.getElementById('attendedHours').addEventListener('keydown', handleEnterKey);

// Initialize the table on page load
document.addEventListener('DOMContentLoaded', updateTable);
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username'); // Retrieve the username from localStorage
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {
        welcomeMessage.textContent = `Welcome, ${username}`; // Display the welcome message
    } else {
        welcomeMessage.textContent = 'Welcome!';
    }
});

// Existing attendance.js functions go here...


// Function to handle logout
function logout() {
    // Handle logout logic
    window.location.href = 'index.html';
}
