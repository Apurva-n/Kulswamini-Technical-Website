document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    window.location.href = 'Login.html';
    return;
  }

  if (user.role === 'instructor') {
    window.location.href = 'fetch.html';  // shows enrolled students
  } else if (user.enrolled) {
    window.location.href = 'EnrolledCOurses.html';  // student enrolled
  } else {
    window.location.href = 'Courses.html';  // student not enrolled
  }
});
