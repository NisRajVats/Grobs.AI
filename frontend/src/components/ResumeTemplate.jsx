import React from 'react';

export const ResumeTemplate = ({ resume }) => {
  
  // Basic styles (no changes)
  const styles = {
    body: { fontFamily: 'Arial, sans-serif', lineHeight: 1.6, margin: '2rem' },
    h1: { fontSize: '2.5rem', marginBottom: '0.5rem', borderBottom: '2px solid #333', paddingBottom: '0.5rem' },
    h2: { fontSize: '1.5rem', color: '#007bff', borderBottom: '1px solid #eee', paddingBottom: '0.25rem', marginTop: '2rem' },
    contactInfo: { marginBottom: '2rem', fontSize: '1.1rem' },
    contactP: { margin: '0.25rem 0' },
    entry: { marginBottom: '1.5rem' },
    entryHeader: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.1rem' },
    entrySubheader: { fontStyle: 'italic', color: '#555', marginBottom: '0.25rem' },
    entryDesc: { whiteSpace: 'pre-wrap' },
  };

  return (
    <div style={styles.body}>
      {/* 1. Personal Info */}
      <h1 style={styles.h1}>{resume.full_name}</h1>
      <div style={styles.contactInfo}>
        {resume.email && <p style={styles.contactP}>Email: {resume.email}</p>}
        {resume.phone && <p style={styles.contactP}>Phone: {resume.phone}</p>}
        {resume.linkedin_url && <p style={styles.contactP}>LinkedIn: {resume.linkedin_url}</p>}
      </div>

      {/* 2. Education */}
      {resume.education?.length > 0 && (
        <section>
          <h2 style={styles.h2}>Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} style={styles.entry}>
              <div style={styles.entryHeader}>{edu.degree}</div>
              <div style={styles.entrySubheader}>{edu.school} | {edu.start_date} - {edu.end_date}</div>
            </div>
          ))}
        </section>
      )}

      {/* 3. Experience */}
      {resume.experience?.length > 0 && (
        <section>
          <h2 style={styles.h2}>Work Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} style={styles.entry}>
              <div style={styles.entryHeader}>{exp.role}</div>
              <div style={styles.entrySubheader}>{exp.company} | {exp.start_date} - {exp.end_date}</div>
              <div style={styles.entryDesc}>{exp.description}</div>
            </div>
          ))}
        </section>
      )}

      {/* 4. Projects */}
      {resume.projects?.length > 0 && (
        <section>
          <h2 style={styles.h2}>Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} style={styles.entry}>
              <div style={styles.entryHeader}>{proj.project_name}</div>
              {proj.project_url && <div style={styles.entrySubheader}>{proj.project_url}</div>}
              <div style={styles.entryDesc}>{proj.description}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};