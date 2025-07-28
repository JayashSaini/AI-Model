function formatEmployee(emp) {
  return `
  Employee ID: ${emp.employee_id}
  Name: ${emp.name}
  Email: ${emp.email}
  Phone: ${emp.phone}
  Position: ${emp.position}
  Department: ${emp.department}
  Manager: ${emp.manager}
  Location: ${emp.location}
  Joining Date: ${emp.joining_date}
  Employment Type: ${emp.employment_type}
  Experience: ${emp.experience_years} years
  Remote: ${emp.is_remote ? 'Yes' : 'No'}
  Skills: ${emp.skills.join(', ')}
  Projects: ${emp.projects.join(', ')}
  `.trim();
}

module.exports = { formatEmployee };
