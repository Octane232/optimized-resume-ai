
import React from 'react';
import { ResumeData } from '@/types/resume';

interface ClassicTemplate2Props {
  data: ResumeData;
  scale?: number;
}

const ClassicTemplate2: React.FC<ClassicTemplate2Props> = ({ data, scale = 1 }) => {
  return (
    <div 
      className="bg-cream-50 p-8 font-serif text-gray-900 max-w-2xl mx-auto shadow-xl border border-amber-200"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Elegant Header with Golden Accent */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
        <div className="pt-4">
          <h1 className="text-4xl font-bold mb-2 text-amber-800">{data.contact.name}</h1>
          <div className="w-24 h-0.5 bg-amber-600 mx-auto mb-3"></div>
          <h2 className="text-xl text-amber-700 mb-4 font-medium">{data.contact.title}</h2>
          <div className="text-sm space-x-4 text-gray-700">
            <span>{data.contact.email}</span>
            <span className="text-amber-600">•</span>
            <span>{data.contact.phone}</span>
            <span className="text-amber-600">•</span>
            <span>{data.contact.location}</span>
          </div>
          {data.contact.linkedin && (
            <p className="text-sm text-amber-600 mt-2">{data.contact.linkedin}</p>
          )}
        </div>
      </div>

      {/* Professional Summary with Elegant Border */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4 text-amber-800 relative">
          <span className="bg-cream-50 px-4">EXECUTIVE PROFILE</span>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300 -z-10"></div>
        </h3>
        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
          <p className="text-sm leading-relaxed text-justify italic">{data.summary}</p>
        </div>
      </section>

      {/* Skills in Elegant Grid */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4 text-amber-800 relative">
          <span className="bg-cream-50 px-4">CORE EXPERTISE</span>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300 -z-10"></div>
        </h3>
        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rotate-45 mr-3"></div>
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience with Timeline Style */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4 text-amber-800 relative">
          <span className="bg-cream-50 px-4">PROFESSIONAL JOURNEY</span>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300 -z-10"></div>
        </h3>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-5 bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
            <div className="text-center mb-2 border-b border-amber-100 pb-2">
              <h4 className="font-bold text-sm text-amber-800">{exp.title}</h4>
              <p className="font-semibold text-sm text-amber-700">{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
            </div>
            <ul className="text-sm space-y-1">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="text-center text-gray-700">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-center mb-4 text-amber-800 relative">
          <span className="bg-cream-50 px-4">ACADEMIC CREDENTIALS</span>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300 -z-10"></div>
        </h3>
        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
          {data.education.map((edu, index) => (
            <div key={index} className="text-center mb-3">
              <h4 className="font-bold text-sm text-amber-800">{edu.degree}</h4>
              <p className="text-sm text-amber-700">{edu.institution}</p>
              <p className="text-sm text-gray-600">{edu.startYear} - {edu.endYear}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {data.certifications && (
        <section>
          <h3 className="text-lg font-bold text-center mb-4 text-amber-800 relative">
            <span className="bg-cream-50 px-4">PROFESSIONAL CERTIFICATIONS</span>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300 -z-10"></div>
          </h3>
          <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
            <div className="text-center text-sm space-y-2">
              {data.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-500 rotate-45 mr-3"></div>
                  <span>{cert.name} - {cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate2;
