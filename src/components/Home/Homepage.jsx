import React, { useRef, useState, useEffect } from "react";
import "./Homepage.css";
import emailjs from "@emailjs/browser";
import Loader from "./Loader";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { DarkmodeHandler } from "../../redux/reducer/Reducer";

const Homepage = () => {
  const form = useRef();

  const [loader, setLoader] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState(localStorage.getItem('adminSecret') || "");
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    details: "",
    image: "",
    github: "",
    web: ""
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleAdminSecretTrigger = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount === 5) {
      setShowLoginForm(true);
      setAdminClickCount(0);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setAdminSecret(data.secret);
        localStorage.setItem('adminSecret', data.secret);
        setShowLoginForm(false);
        setLoginPassword("");
        toast.success("Logged in as Admin");
      } else {
        toast.error("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login error: Make sure the backend server is running on port 5000", { duration: 5000 });
    }
  };

  const handleLogout = () => {
    setAdminSecret("");
    localStorage.removeItem('adminSecret');
    setShowAddForm(false);
    toast.success("Logged out");
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      let finalImagePath = newProject.image;

      // If a new image file is selected, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-admin-secret': adminSecret
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalImagePath = uploadData.filePath;
        } else {
          const errorData = await uploadResponse.json();
          toast.error(errorData.error || "Image upload failed");
          return;
        }
      }

      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify({ ...newProject, image: finalImagePath }),
      });
      if (response.ok) {
        toast.success(editingId ? "Project updated successfully" : "Project added successfully");
        setNewProject({ title: "", details: "", image: "", github: "", web: "" });
        setImageFile(null);
        setShowAddForm(false);
        setEditingId(null);
        fetchProjects();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Error saving project");
    }
  };

  const handleEditClick = (project) => {
    setNewProject({
      title: project.title,
      details: project.details,
      image: project.image,
      github: project.github,
      web: project.web
    });
    setEditingId(project.id);
    setShowAddForm(true);
    // Scroll to form
    window.scrollTo({ top: document.querySelector('.add-project-btn-sec').offsetTop - 100, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': adminSecret
        }
      });
      if (response.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project");
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();

    let user_name = document.forms["myForm"]["to_name"].value;
    let from_name = document.forms["myForm"]["from_name"].value;
    let message = document.forms["myForm"]["message"].value;
    var atposition=from_name.indexOf("@");  
    var dotposition=from_name.lastIndexOf(".");  

    // console.log(from_name);
    if (user_name == "") {
      toast.error("You should enter Name ", {
        position: "bottom-center",
      });
      return false;
    } else if (from_name == ""  || atposition<1 || dotposition<atposition+2 || dotposition+2>=from_name.length) {
      toast.error("You should Enter a Valid Email", {
        position: "bottom-center",
      });
      return false;
    // } else if (subject == "") {
    //   toast.error("You should enter Subject", {
    // //     position: "bottom-center",
    // //   });
    //   return false;
    } else if (message == "") {
      toast.error("You should enter Message", {
        position: "bottom-center",
      });
      return false;
    }

    // const fields = ["from_name", "from_email", "subject", "message"];

    // for (let field of fields) {
    //   const value = document.forms["myForm"][field].value;
    //   if (value.trim() === "") {
    //     toast.error(`You should enter ${field.replace("_", " ")}`, {
    //       position: "bottom-center",
    //     });
    //     return false;
    //   }
    // }
   
    setLoader(true);

    emailjs
      .sendForm("service_fd5kg1m", "template_901v1v7", form.current, {
        publicKey: "Zme0_qDouIGTObo7X",
      })
      .then(
        () => {
          // console.log("SUCCESS!");
          toast.success("Email sent", { position: "bottom-center" });
          setLoader(false);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          toast.error("Failed to send message: " + (error.text || "Unknown error"), { position: "bottom-center" });
          setLoader(false);
        }
      );
  };

  //Redux area for Dark mode

  const dispatch = useDispatch();
  const darkModeHandlerfunction = useSelector(
    (state) => state.DarkmodeStore.value
  );
  // console.log(darkModeHandlerfunction);
  return (
    <div>
      <Toaster />
      {/* <div className="homepage-main"> */}
      <div
        className={
          darkModeHandlerfunction == true
            ? "homepage-main"
            : "darkmode-homepage-main"
        }
      >
        {/* //Home section */}

        <div className="home-sec" id="home-sec">
          {/* //sidebar */}
          <div className="home-sec-side-bar-sec">
            <div className="home-sec-darkmode">
              <div onClick={() => dispatch(DarkmodeHandler())}>
                <img
                  src={
                    darkModeHandlerfunction == true
                      ? "/darkmode.png"
                      : "/lightmode.png "
                  }
                  className="darkmode-icon"
                />
              </div>{" "}
            </div>{" "}
            <div className="home-sec-side-bar">
              <a href="https://www.instagram.com/v_i_s_h_n_u_vijayan_?utm_source=qr&igsh=MWsydTZ5ZTJ2ZzA4Yw== " target="_black">
                <img
                  src="/instagram.png"
                  alt=""
                  className="home-sec-sidebar-logo"
                />
              </a>
              <a href="https://www.linkedin.com/in/vishnu-vijayan-9a35452a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_black">
                <img
                  src="/linkedin.png"
                  alt=""
                  className="home-sec-sidebar-logo"
                />{" "}
              </a>
              <a href="https://github.com/Vishnu-Vijayan-2002" target="_black">
                <img
                  src="/github.png"
                  alt=""
                  className="home-sec-sidebar-logo"
                />{" "}
              </a>
            </div>
          </div>
          <div
            className={
              darkModeHandlerfunction == true
                ? "home-sec-content seperate-background"
                : "darkmode-home-sec-content  "
            }
          >
            <h1 onClick={handleAdminSecretTrigger} style={{ cursor: 'default', userSelect: 'none' }}>Hello !</h1>
            <h1>I am Vishnu Vijayan</h1>
            <p className="home-sec-content-p">
              I'm a proficient Full Stack web developer adept in both front-end
              and back-end development, committed to crafting seamless digital
              experiences. Please feel free to peruse my CV to get a glimpse of
              my portfolio and previous endeavors.
              {/* Hello, all! I'm Amaljith M K, an enthusiastic and motivated web
              developer with proficiency in both frontend and backend
              technologies. Lately, I finished an extensive MERN stack course,
              refining my abilities and understanding in constructing resilient
              web applications. Along my educational path, I've tackled various
              demanding ventures to enhance my skills and aptitude in addressing
              challenges. My commitment to mastering the art of web development
              motivates me to produce outstanding outcomes in each
              endeavor I pursue. */}
            </p>
            <div className="home-sec-content-btn-sec">
              <a
                href="https://drive.google.com/file/d/1H6mhZW1OliqirrCqOOegNDFq3GdNJ6oy/view?usp=sharing"
                download="vishnu_vijayan_25.pdf"
                className="home-sec-btn"
              >
                Download CV
                <img src="/download.png" alt="" className="home-sec-btn-icon" />
              </a>

              <a
                href="https://github.com/Vishnu-Vijayan-2002"
                className="home-sec-socialmedia-btn"
              >
                <img src="/github.png" alt="" className="home-sec-btn-icon" />
              </a>
              <a   className="home-sec-socialmedia-btn" href="https://www.linkedin.com/in/vishnu-vijayan-9a35452a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_black">
                <img src="/linkedin.png" alt="" className="home-sec-btn-icon" />
              </a>
            </div>
          </div>
          <div className="home-sec-content">
            <div className="home-sec-content-img-sec">
              <img
                src={
                  darkModeHandlerfunction == true
                    ? "/robot-back.png"
                    : "/robot-back-dark.png"
                }
                alt=""
                className="robot-back"
              />
              <img src="/robot.png" alt="" className="robot" />
            </div>{" "}
          </div>
        </div>

        {/* //Project section */}

        <div className="project-sec">
          <div
            className={
              darkModeHandlerfunction == true
                ? "project-title-sec"
                : "darkmode-project-title-sec"
            }
            id="project-sec"
          >
            {" "}
            {/* Personal Projects */}
            Personal Endeavors
            <div
              className={
                darkModeHandlerfunction == true
                  ? "project-title-underline"
                  : "darkmode-project-title-underline"
              }
            ></div>
          </div>
 
          <div className="project-content-sec">
            {projects.map((project) => (
              <div className="project-card-main-body" key={project.id}>
                <div className="project-card-sub-body">
                  <div
                    className={
                      darkModeHandlerfunction == true
                        ? "project-card-body"
                        : "darkmode-project-card-body"
                    }
                  >
                    <div className="project-card-img-sec">
                      <img
                        src={project.image || "/file.png"}
                        alt=""
                        className="project-card-img"
                      />
                    </div>

                    <div className="project-card-content-sec">
                      <div className="project-card-project-title">
                        {project.title}
                      </div>
                      <div className="project-card-project-details">
                        {project.details}
                      </div>
                      <div className="project-card-project-logo-sec">
                        {project.github && (
                          <a
                            href={project.github}
                            className="project-github-btn"
                            target="_blank"
                            rel="noopener noreferrer">
                            <img
                              src="/github.png"
                              alt=""
                              className={
                                darkModeHandlerfunction == true
                                  ? "project-logo "
                                  : "darkmode-project-logo"
                              }
                            />
                            <div className="project-logo-text">View on GitHub</div>
                          </a>
                        )}
                        {project.web && (
                          <a
                            href={project.web}
                            className="project-btn"
                            target="_blank"
                            rel="noopener noreferrer">
                            Go to web
                            <img src="/web.png" alt="" className="project-logo" />
                          </a>
                        )}
                        {adminSecret && (
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', width: '100%' }}>
                            <button 
                              onClick={() => handleEditClick(project)}
                              style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {adminSecret && (
            <div className="add-project-btn-sec" style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                className="project-btn" 
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  if (!showAddForm) {
                    setEditingId(null);
                    setNewProject({ title: "", details: "", image: "", github: "", web: "" });
                  }
                }}
                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
              >
                {showAddForm ? "Cancel" : "Add New Project"}
              </button>
              <button 
                className="project-btn" 
                onClick={handleLogout}
                style={{ background: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
              >
                Admin Logout
              </button>
            </div>
          )}

          {adminSecret && showAddForm && (
            <div className="add-project-form-container" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', background: darkModeHandlerfunction ? '#fff' : '#222', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleAddProject} className="form-sec">
                <h3 style={{ color: darkModeHandlerfunction ? '#333' : '#fff' }}>
                  {editingId ? "Edit Project" : "Add New Project"}
                </h3>
                <div className="form-input-field-sec">
                  Title
                  <input
                    type="text"
                    className="form-input-field"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div className="form-input-field-sec">
                  Details
                  <textarea
                    className="form-input-field"
                    style={{ height: '100px' }}
                    required
                    value={newProject.details}
                    onChange={(e) => setNewProject({ ...newProject, details: e.target.value })}
                  />
                </div>
                <div className="form-input-field-sec">
                  Project Image
                  <input
                    type="file"
                    className="form-input-field"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    style={{ borderBottom: 'none', paddingTop: '10px' }}
                  />
                  <small style={{ color: '#888', fontSize: '0.7rem' }}>
                    Or enter path:
                  </small>
                  <input
                    type="text"
                    className="form-input-field"
                    placeholder="/tomato.png or https://..."
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  />
                </div>
                <div className="form-input-field-sec">
                  GitHub Link
                  <input
                    type="text"
                    className="form-input-field"
                    value={newProject.github}
                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  />
                </div>
                <div className="form-input-field-sec">
                  Web Link
                  <input
                    type="text"
                    className="form-input-field"
                    value={newProject.web}
                    onChange={(e) => setNewProject({ ...newProject, web: e.target.value })}
                  />
                </div>
                <button type="submit" className="form-send-btn" style={{ width: '100%', marginTop: '10px' }}>
                  {editingId ? "Update Project" : "Add Project"}
                </button>
              </form>
            </div>
          )}

          {showLoginForm && (
            <div className="add-project-form-container" style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', background: darkModeHandlerfunction ? '#fff' : '#222', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleLogin} className="form-sec">
                <h3 style={{ color: darkModeHandlerfunction ? '#333' : '#fff' }}>Admin Login</h3>
                <div className="form-input-field-sec">
                  Admin Password
                  <input
                    type="password"
                    className="form-input-field"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="form-send-btn" style={{ width: '100%', marginTop: '10px' }}>
                  Login
                </button>
                <button type="button" className="project-btn" onClick={() => setShowLoginForm(false)} style={{ background: 'transparent', color: darkModeHandlerfunction ? '#333' : '#fff', border: 'none', marginTop: '10px' }}>
                  Close
                </button>
              </form>
            </div>
          )}
            </div>



        {/* //Skill section */}

        <div className="skill-sec" id="skill-sec">
          <div
            className={
              darkModeHandlerfunction == true
                ? "skill-title-sec"
                : "darkmode-skill-title-sec"
            }
          >
            Expertise
            <div className="skill-title-underline"></div>
          </div>
          <div className="skill-card-sec">
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/react.png" alt="" className="skill-card-logo" />
              React
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/redux.png" alt="" className="skill-card-logo" />
              Redux
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/mongodb.png" alt="" className="skill-card-logo" />
              Mongo DB
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/node.png" alt="" className="skill-card-logo" />
              Node JS
            </div>
            {/* <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/express.png" alt="" className="skill-card-logo" />
              Express JS
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/postman.png" alt="" className="skill-card-logo" />
              Postman
            </div> */}
            {/* <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/rest-api.png" alt="" className="skill-card-logo" />
              REST API{" "}
            </div> */}
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/jwt.png" alt="" className="skill-card-logo" />
              JWT
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/git.png" alt="" className="skill-card-logo" />
              Git
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/bootstrap.png" alt="" className="skill-card-logo" />
              Bootstrap
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/javascript.png" alt="" className="skill-card-logo" />
              Javascript
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/css.png" alt="" className="skill-card-logo" />
              CSS
            </div>
            <div
              className={
                darkModeHandlerfunction == true
                  ? "skill-card-body"
                  : "darkmode-skill-card-body"
              }
            >
              <img src="/html.png" alt="" className="skill-card-logo" />
              HTML
            </div>
          </div>
        </div>

        {/* //contact section */}

        <div
          className={
            darkModeHandlerfunction == true
              ? "contact-sec"
              : "darkmode-contact-sec"
          }
        >
          <div className="contact-sec-left-body" id="contact-sec">
            <div className="contact-sec-title-1">
              {/* CONTACT US */}
              CONNECT ME{" "}
            </div>
            <div className="contact-sec-title-2">
              {" "}
              Let's talk <br /> about you
            </div>
          </div>
          <div className="contact-sec-right-body">
            <form action="" className="form-sec" ref={form} name="myForm">
              <div className="form-title"> Send me a Message</div>
              <div className="form-input-field-sec">
                Full Name
                <input
                  type="text"
                  className="form-input-field"
                  required
                  name="to_name"
                />
              </div>
              <div className="form-input-field-sec">
                Email
                <input
                  type="text"
                  className="form-input-field"
                  required
                  name="from_name"
                />
              </div>
              {/* <div className="form-input-field-sec">
                Subject
                <input
                  type="text"
                  className="form-input-field"
                  required
                  name="subject"
                />
              </div> */}
              <div className="form-input-field-sec">
                Your message here
                <input
                  type="text"
                  className="form-input-field"
                  required
                  name="message"
                />
              </div>
              {loader == false ? (
                <button className="form-send-btn" onClick={sendEmail}>
                  <>
                    Send{" "}
                    <img src="/send.png" alt="" className="form-btn-icon" />
                  </>
                </button>
              ) : (
                <>
                  <Loader />
                </>
              )}
            </form>
          </div>
        </div>

        {/* //Footer */}

        <div className="footer-sec">
          <div className="footer-sec-content">
            <a
              className={
                darkModeHandlerfunction == true
                  ? "footer-card-sec"
                  : "darkmode-footer-card-sec"
              }
              href="https://maps.app.goo.gl/rfC4dnGAmG4eNrs5A"
            >
              <img src="/location.png" alt="" className="footer-icon" />
              Kottayam,Kerala
            </a>

            <a
              className={
                darkModeHandlerfunction == true
                  ? "footer-card-sec"
                  : "darkmode-footer-card-sec"
              }
              href="tel:7909247054"
            >
              <img src="/phone.png" alt="" className="footer-icon" />
              +91-7909247054
            </a>

            <a
              className={
                darkModeHandlerfunction == true
                  ? "footer-card-sec"
                  : "darkmode-footer-card-sec"
              }
              href="mailto:vishnuvijayan7909@gmail.com"
            >
              <img src="/email.png" alt="" className="footer-icon" />
              vishnuvijayan7909@gmail
            </a>
          </div>
          <div
            className={
              darkModeHandlerfunction == true
                ? "footer-sec-data"
                : "darkmode-footer-sec-data"
            }
          >
            © 2024 All Rights Reserved{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
