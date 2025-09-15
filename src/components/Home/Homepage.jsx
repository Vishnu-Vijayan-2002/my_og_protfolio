import React, { useRef, useState } from "react";
import "./Homepage.css";
import emailjs from "@emailjs/browser";
import Loader from "./Loader";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { DarkmodeHandler } from "../../redux/reducer/Reducer";

const Homepage = () => {
  const form = useRef();

  const [loader, setLoader] = useState(false);

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
        publicKey: "lUmI5slkEgdP6ewCp",
      })
      .then(
        () => {
          // console.log("SUCCESS!");
          toast.success("Email sent", { position: "bottom-center" });
          setLoader(false);
        },
        (error) => {
          // console.log("FAILED...", error.text);
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
            <h1>Hello !</h1>
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
                href="/vishnu_vijayan.pdf"
                download="Vishnu vijayanResume.pdf"
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
            {/* //project card body */}
            {/* / Tomato/*/}

                <div className="project-card-main-body">
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
                          src="/tomato.png"
                          alt=""
                          className="project-card-img"
                        />
                      </div>


                      {/* projects */}
                      <div className="project-card-content-sec">
                        <div className="project-card-project-title">
                          Tomato
                        </div>
                        <div className="project-card-project-details">
                        This project is a simple food ordering website built using React. It allows users to browse through a menu of food items, add items to their cart, and place an order. The website is responsive and adapts well to different screen sizes.
                        </div>
                        <div className="project-card-project-logo-sec">
                          <a
                            href="https://github.com/Vishnu-Vijayan-2002/React-main-project-front-end-design.git"
                            className="project-github-btn"
                            target="_black">
                            <img
                              src="/github.png"
                              alt=""
                              className={
                                darkModeHandlerfunction == true
                                  ? "project-logo "
                                  : "darkmode-project-logo"
                              }
                            />
                            <div class="project-logo-text">View on GitHub</div>
                          </a>
                          <a
                            href="https://react-main-project-front-end-4i53-nn1s6hk2r.vercel.app/"
                            className="project-btn"
                            target="_black">
                            Go to web
                            <img src="/web.png" alt="" className="project-logo" />
                          </a>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                {/* //React Quiz App*/}
    
                <div className="project-card-main-body">
                  <div className="project-card-sub-body">
                    <div
                      className={
                        darkModeHandlerfunction == true
                          ? "project-card-body"
                          : "darkmode-project-card-body"
                      }
                    >
                      <div className="project-card-img-sec">
                        <img src="/quizapp.png" alt="" className="project-card-img" />
                      </div>
                      <div className="project-card-content-sec">
                        <div className="project-card-project-title">React Quiz App</div>
                        <div className="project-card-project-details">
                        Interactive Quizzes: Engage in thought-provoking questions on various topics.
                        React-powered UI: Building a responsive and sleek user interface with React components.
                        Score Tracking: Challenge yourself and track your quiz performance.
                        </div>
                        <div className="project-card-project-logo-sec">
                          <a
                            href="https://github.com/Vishnu-Vijayan-2002/react-quiz-app.git"
                            className="project-github-btn"
                            target="_black">
                            <img
                              src="/github.png"
                              alt=""
                              className={
                                darkModeHandlerfunction == true
                                  ? "project-logo "
                                  : "darkmode-project-logo"
                              }
                            />
                            <div class="project-logo-text">View on GitHub</div>
                          </a>
                          <a
                            href="https://react-quiz-app-zeta-blue.vercel.app/"
                            className="project-btn"
                            target="_black">
                            Go to web
                            <img src="/web.png" alt="" className="project-logo" />
                          </a>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/* //Gym Website */}
    
                <div className="project-card-main-body">
                  <div className="project-card-sub-body">
                    <div
                      className={
                        darkModeHandlerfunction == true
                          ? "project-card-body"
                          : "darkmode-project-card-body"
                      }
                    >
                      {" "}
                      <div className="project-card-img-sec">
                        <img
                          src="/file.png"
                          alt=""
                          className="project-card-img"
                        />
                      </div>
                      <div className="project-card-content-sec">
                        <div className="project-card-project-title">Gym Website</div>
                        <div className="project-card-project-details">
                        A Responsive 💪🏽Gym site Website blending HTML, CSS, Bootstrap and javascript
                        </div>
                        <div className="project-card-project-logo-sec">
                          <a
                            href="https://github.com/Vishnu-Vijayan-2002/befit-gym.git"
                            className="project-github-btn"
                            target="_black">
                            <img
                              src="/github.png"
                              alt=""
                              className={
                                darkModeHandlerfunction == true
                                  ? "project-logo "
                                  : "darkmode-project-logo"
                              }
                            />
                            <div class="project-logo-text">View on GitHub</div>
                          </a>
                          <a
                            href="https://befit-gym.vercel.app/"
                            className="project-btn"
                            target="_black">
                            Go to web
                            <img src="/web.png" alt="" className="project-logo" />
                          </a>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                {/* //Personal Portfolio */}
    
                <div className="project-card-main-body">
                  <div className="project-card-sub-body">
                    <div
                      className={
                        darkModeHandlerfunction == true
                          ? "project-card-body"
                          : "darkmode-project-card-body"
                      }
                    >
                      {" "}
                      <div className="project-card-img-sec">
                        <img 
                          src="/news.png"
                          alt=""
                          className="project-card-img img-fluid"
                        />
                      </div>
                      <div className="project-card-content-sec">
                        <div className="project-card-project-title">
                          News-Hub
                        </div>
                        <div className="project-card-project-details">
                        Real-time News Updates: Stay informed with the latest headlines fetched dynamically.
                        JSON Server Magic: Leveraging the simplicity and flexibility of JSON Server for seamless data management.
                        User-Friendly Interface: A clean and intuitive design for a smooth browsing experience
                        </div>
                        <div className="project-card-project-logo-sec">
                          <a
                            href="https://github.com/Vishnu-Vijayan-2002/React-news-hub-web"
                            className="project-github-btn"
                            target="_black">
                            <img
                              src="/github.png"
                              alt=""
                              className={
                                darkModeHandlerfunction == true
                                  ? "project-logo "
                                  : "darkmode-project-logo"
                              }
                            />
                            <div class="project-logo-text">View on GitHub</div>
                          </a>
                          <a
                            href="https://react-news-hub-web.vercel.app/"
                            className="project-btn"
                            target="_black">
                            Go to web
                            <img src="/web.png" alt="" className="project-logo" />
                          </a>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
