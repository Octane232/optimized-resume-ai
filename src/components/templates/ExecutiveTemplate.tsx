
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ExecutiveTemplateProps {
  data: ResumeData;
  scale?: number;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-white font-serif text-gray-900 max-w-2xl mx-auto shadow-lg"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Header */}
      <div className="border-b-4 border-gray-800 pb-6 mb-8 p-8">
        <h1 className="text-4xl font-bold text-center mb-2">{data.contact.name}</h1>
        <h2 className="text-xl text-center text-gray-600 mb-4">{data.contact.title}</h2>
        <div className="flex justify-center space-x-8 text-sm">
          <span>{data.contact.email}</span>
          <span>{data.contact.phone}</span>
          <span>{data.contact.location}</span>
        </div>
        {data.contact.linkedin && (
          <p className="text-center text-sm text-gray-600 mt-2">{data.contact.linkedin}</p>
        )}
      </div>

      <div className="px-8 pb-8">
        {/* Executive Summary */}
        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4">
            Executive Summary
          </h3>
          <p className="text-gray-700 leading-relaxed text-justify">{data.summary}</p>
        </section>

        {/* Core Competencies */}
        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4">
            Core Competencies
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="text-center p-3 border border-gray-200 rounded">
                <span className="text-sm font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4">
            Professional Experience
          </h3>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-lg font-bold">{exp.title}</h4>
                  <p className="text-gray-700 font-semibold">{exp.company}</p>
                </div>
                <span className="text-gray-600 font-medium">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <ul className="space-y-2 ml-4">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-gray-700 leading-relaxed">
                    <span className="font-bold mr-2">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education & Professional Development */}
        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4">
            Education & Professional Development
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-bold">{edu.degree}</h4>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
                <span className="text-gray-600 font-medium">{edu.startYear} - {edu.endYear}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Board Memberships / Certifications */}
        {data.certifications && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4">
              Professional Certifications
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex items-center p-2 border-l-4 border-gray-400 bg-gray-50">
                  <span className="font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
