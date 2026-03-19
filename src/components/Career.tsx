import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developement Intern</h4>
                <h5>IIDT</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Integrated backend services using Spring Boot supporting real-time
              application workflows .Delivered full-stack features using React,
              TypeScript, and MySQL across multiple modules. Managed version
              control using Git, improving collaboration and code tracking.
              Debugged API integration issues and reduced response errors during
              testing phase
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Product Trainee Intern</h4>
                <h5>Schneider Electric</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Worked as a Backend SDET, developing and maintaining automated
              test suites using Spring Boot. Conducted comprehensive API testing
              to validate microservices, ensuring high performance and system
              reliability. Collaborated with teams to debug complex issues and
              improve overall backend code quality.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer Freelancer</h4>
                <h5>Upwork</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Delivering specialized full-stack web applications for diverse
              clients. Building responsive frontends with React and TypeScript,
              layered over robust backend services using Spring Boot, Express,
              and MySQL. Providing tailored, scalable solutions that include
              seamless API integrations and optimized database workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
