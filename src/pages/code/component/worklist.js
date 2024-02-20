import React from 'react';

function WorkExperience({ title, company, description, imageUrl }) {
  return (
    <div className="work-experience">
      <img src={imageUrl} alt={title} />
      <h2>{title}</h2>
      <p>{company}</p>
      <p>{description}</p>
    </div>
  );
}

export default WorkExperience;