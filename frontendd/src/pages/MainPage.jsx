import React from 'react';
import { Link as ScrollLink, Element } from 'react-scroll'; // ✅ alias Link as ScrollLink
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.logo}></div>
        <div style={styles.links}>
          {['home', 'about', 'Technologies', 'contact'].map((section) => (
            <ScrollLink
              key={section}
              to={section}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              style={styles.link}
              activeClass="active"
            >
              {section.toUpperCase()}
            </ScrollLink>
          ))}

          {/* 👇 LOGIN/SIGNUP button that navigates to login-page */}
          <span
            onClick={() => navigate('/login-page')}
            style={{ ...styles.link, color: 'lightblue' }}
          >
            LOGIN/SIGNUP
          </span>
        </div>
      </nav>

      <div style={{ paddingTop: '80px' }}>
  {/* HOME SECTION */}
  <Element name="home" style={styles.section}>
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Our Project</h1>
      <h2 style={styles.college}>Alagappa Chettiar Government College of Engineering & Technology, Karaikudi</h2>
      <p style={{ marginTop: '1rem' }}>
        Project Title: <strong>Transparent Stock Management in PDS Using GS1-128 FIFO System</strong>
      </p>
      <p>Department: B.E Electronics and Communication Engineering (ECE)</p>
      <p>Academic Year: 2021 - 2025</p>
    </div>
  </Element>

  {/* ABOUT SECTION */}
  <Element name="about" style={styles.section}>
    <div>
      <h1>About the Project</h1>
      <p style={{ maxWidth: '900px', marginTop: '1rem' , textAlign:'justify', fontSize:27,lineHeight:1.5 }}>
      This project presents a modernized Public Distribution System (PDS) that leverages barcode
       technology to automate inventory tracking and stock management.
        Utilizing a full-stack approach with React.js for the frontend,
         Node.js and Express.js for the backend, and MongoDB for database 
         management, the system ensures secure, role-based access for Admins,
          Godown Incharges, and PDS Incharges. <strong> Barcodes are used to encode essential 
          product information, enabling real-time tracking and FIFO-based stock clearance.</strong> 
          The integration of barcode scanners at dispatch and receipt points reduces manual
           errors, enhances transparency, and ensures efficient and tamper-proof distribution
            of goods from godowns to PDS shops, improving overall reliability. </p>
    </div>  
  </Element>

  {/* PROJECTS SECTION */}
  <Element name="Technologies" style={styles.section}>
    <div>
      <h1>Technologies Used</h1>
      <ul style={{ marginTop: '1rem', textAlign: 'left' }}>
        <li>⚙️ React.js for frontend</li>
        <li>🧠 Node.js  backend</li>
        <li>🗃️ MongoDB database</li>
        <li>📡 Barcode Reader (GS1-128)</li>
        <li>🔐 Role-Based Authentication (Admin, Godown, PDS)</li>
      </ul>
    </div>
  </Element>

  {/* CONTACT SECTION */}
  <Element name="contact" style={styles.section}>
    <div className='member'>
      <h1>Project Members</h1>
      <ul style={{ marginTop: '1rem', textAlign: 'left', fontSize:22,padding:30, }}>
        <li style={{ padding:10, }}>👨‍💻 PARAMASIVAM R - Fullstack Developer</li>
        <li style={{ padding:10, }}>👨‍💻 SANTHOSH R    - MongoDB Developer</li>
        <li style={{ padding:10, }}>👨‍💻 VIKNESHRAJA M - Backend Developer</li>
        <li style={{ padding:10, }}>👨‍💻 DHANUMOORTHY S- Backend Developer</li>
        <li style={{ padding:10, }}>👨‍🏫 Dr. A. SIVANANTHA RAJA, M.E., Ph.D., HoD, ECE</li>
        {/* <li style={{ padding:10, }}>👨‍🏫 Dr. A. Sivanantha Raja, M.E., Ph.D., HoD, ECE</li> */}
      </ul>
      <p style={{ marginTop: '2rem' }}>📧 Email: godownmanagement@college.edu</p>
    </div>
  </Element>
</div>
    </>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    width: '95%',
    backgroundColor: '#0a192f',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    // position:'fixed',
    // top:10,
    // left:0,
  },
  link: {
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  section: {
    height: '90vh',
    backgroundColor: '#e3f6f5',
    color: '#272343',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    fontSize: '2rem',
  },
  college:{
    color:'#272343',
  },
 
};

export default MainPage;
