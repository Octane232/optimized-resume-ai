
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ClassicTemplate2Props {
  data: ResumeData;
  scale?: number;
}

const ClassicTemplate2: React.FC<ClassicTemplate2Props> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white p-8 font-serif text-gray-900 max-w-2xl mx-auto shadow-lg"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{data.contact.name}</h1>
        <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-3"></div>
        <h2 className="text-xl text-gray-600 mb-4">{data.contact.title}</h2>
        <div className="text-sm space-x-4">
          <span>{data.contact.email}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          <span>•</span>
          <span>{data.contact.location}</span>
        </div>
        {data.contact.linkedin && (
          <p className="text-sm text-gray-600 mt-2">{data.contact.linkedin}</p>
        )}
      </div>

      {/* Professional Summary */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4">PROFESSIONAL SUMMARY</h3>
        <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4">CORE SKILLS</h3>
        <div className="text-center">
          <p className="text-sm leading-relaxed">
            {data.skills.join(' • ')}
          </p>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4">PROFESSIONAL EXPERIENCE</h3>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-5">
            <div className="text-center mb-2">
              <h4 className="font-bold text-sm">{exp.title}</h4>
              <p className="font-semibold text-sm text-gray-700">{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
            </div>
            <ul className="text-sm space-y-1">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="text-center">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4">EDUCATION</h3>
        {data.education.map((edu, index) => (
          <div key={index} className="text-center mb-3">
            <h4 className="font-bold text-sm">{edu.degree}</h4>
            <p className="text-sm text-gray-700">{edu.institution}</p>
            <p className="text-sm text-gray-600">{edu.startYear} - {edu.endYear}</p>
          </div>
        ))}
      </section>

      {/* Certifications */}
      {data.certifications && (
        <section>
          <h3 className="text-lg font-bold text-center mb-4">CERTIFICATIONS</h3>
          <div className="text-center text-sm space-y-1">
            {data.certifications.map((cert, index) => (
              <p key={index}>{cert.name} - {cert.issuer}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate2;
