import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle, ArrowRight, BookOpen, Mic, HeartHandshake, Award } from "lucide-react";
import "@fontsource/outfit";

const VolunteerDash = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("https://avida-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login", { replace: true });
        window.location.href = "/login";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Stats data
  const impactStats = [
    { value: "500+", label: "Students Helped" },
    { value: "300+", label: "Volunteers" },
    { value: "1000+", label: "Exams Completed" },
    { value: "98%", label: "Success Rate" }
  ];

  // How it works steps
  const processSteps = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Register as Volunteer",
      description: "Complete our quick onboarding process to become a certified scribe"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Get Matched",
      description: "We'll connect you with students based on your availability and skills"
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Assist in Exams",
      description: "Help students by scribing or reading during their examinations"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Make an Impact",
      description: "Receive feedback and see the difference you've made in someone's education"
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#12062E] to-[#862D86] text-white">
      {/* Enhanced Navbar */}
      <nav className="flex justify-between items-center p-6 px-8 min-h-100vh">
        <motion.img 
          src="/avidalogo.png" 
          alt="Logo" 
          className="h-12 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        />
        <div className="flex items-center gap-6">
          <motion.button
            onClick={() => navigate("/register-volunteer")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Scribe Enrollment</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={handleLogout}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <UserCircle
              className="w-10 h-10 cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/profile")}
            />
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold uppercase mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering <span className="text-purple-300">Differently Abled</span> Students Through Education
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your time and skills can provide independence and opportunity to students who need assistance. Become the bridge to academic success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <button
              onClick={() => navigate("/register-volunteer")}
              className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition-all shadow-lg"
            >
              Join Our Volunteer Team
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 border-2 border-white rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Learn About Our Mission
            </button>
          </motion.div>
        </div>

        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our <span className="text-purple-300">Community Impact</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-8 rounded-2xl text-center border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-bold text-purple-300 mb-2">{stat.value}</p>
                <p className="text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How You Can <span className="text-purple-300">Make a Difference</span>
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-16">
            Your participation creates educational equity for differently abled students
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-8 rounded-2xl border border-white/20 hover:border-purple-300 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Stories of <span className="text-purple-300">Transformation</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              className="bg-white/10 p-8 rounded-2xl border border-white/20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-lg">Sarah Johnson</h4>
                  <p className="text-white/70">Volunteer Scribe</p>
                </div>
              </div>
              <p className="text-lg italic">
                "Being a scribe has been one of the most rewarding experiences of my life. Helping visually impaired students complete their exams gives them the independence they deserve in education."
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 p-8 rounded-2xl border border-white/20"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-lg">Michael Chen</h4>
                  <p className="text-white/70">Student</p>
                </div>
              </div>
              <p className="text-lg italic">
                "Before Avida, I struggled to complete exams independently. Now, with the help of volunteer scribes, I can focus on demonstrating my knowledge without barriers."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-12 rounded-3xl border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="text-purple-300">Make an Impact</span>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of volunteers and help break down barriers in education
          </p>
          <button
            onClick={() => navigate("/register-volunteer")}
            className="px-10 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition-all shadow-lg text-lg"
          >
            Become a Volunteer Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default VolunteerDash;