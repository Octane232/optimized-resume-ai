
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ClassicTemplateProps {
  data: ResumeData;
  scale?: number;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white p-8 font-serif text-gray-800 max-w-2xl mx-auto shadow-lg"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">{data.contact.name}</h1>
        <h2 className="text-xl text-gray-600 mb-3">{data.contact.title}</h2>
        <div className="text-sm space-y-1">
          <p>{data.contact.email} | {data.contact.phone}</p>
          <p>{data.contact.location}</p>
          {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
          {data.contact.github && <p>{data.contact.github}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      <section className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-3">PROFESSIONAL SUMMARY</h3>
        <p className="text-sm leading-relaxed">{data.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-3">CORE COMPETENCIES</h3>
        <div className="grid grid-cols-2 gap-y-1 gap-x-8 text-sm">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center h-6">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-2 flex-shrink-0"></span>
              <span className="truncate">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-3">PROFESSIONAL EXPERIENCE</h3>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-sm">{exp.title}</h4>
              <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="font-semibold text-sm text-gray-700 mb-2">{exp.company}</p>
            <ul className="text-sm space-y-1">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-400 mb-3">EDUCATION</h3>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm">{edu.degree}</h4>
                <p className="text-sm text-gray-700">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-600">{edu.startYear} - {edu.endYear}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Certifications */}
      {data.certifications && (
        <section>
          <h3 className="text-lg font-bold border-b border-gray-400 mb-3">CERTIFICATIONS</h3>
          <div className="text-sm space-y-1">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
                {cert.name} - {cert.issuer}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
