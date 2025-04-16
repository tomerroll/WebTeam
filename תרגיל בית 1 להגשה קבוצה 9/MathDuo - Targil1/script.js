document.addEventListener('DOMContentLoaded', () => {
    const studentBtn = document.getElementById('studentBtn');
    const teacherBtn = document.getElementById('teacherBtn');
    const studentView = document.getElementById('studentView');
    const teacherView = document.getElementById('teacherView');

    // Set initial button state
    studentBtn.classList.add('bg-blue-700');

    // Handle view switching
    studentBtn.addEventListener('click', () => {
        studentView.classList.remove('hidden');
        teacherView.classList.add('hidden');
        studentBtn.classList.add('bg-blue-700');
        teacherBtn.classList.remove('bg-green-700');
    });

    teacherBtn.addEventListener('click', () => {
        teacherView.classList.remove('hidden');
        studentView.classList.add('hidden');
        teacherBtn.classList.add('bg-green-700');
        studentBtn.classList.remove('bg-blue-700');
    });

    // Add click handlers for theory sections
    const theorySections = document.querySelectorAll('.bg-blue-50');
    theorySections.forEach(section => {
        section.addEventListener('click', () => {
            // In a real implementation, this would open the theory content
            alert('פתיחת חומר תיאורטי...');
        });
    });

    // Add click handlers for practice sections
    const practiceSections = document.querySelectorAll('.bg-green-50');
    practiceSections.forEach(section => {
        section.addEventListener('click', () => {
            // In a real implementation, this would open the practice exercise
            alert('פתיחת תרגיל...');
        });
    });
}); 