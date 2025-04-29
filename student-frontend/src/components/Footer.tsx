import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Book,
  User,
  ChartBar,
  Compass,
  CodeXml,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleClick = () => {
    const to = "";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=void.01.karthik@gmail.com`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-6 mt-10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* Logo and Social */}
          <div className="flex items-center mb-4 md:mb-0">
            <CodeXml className="mr-2" />
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500 mr-6">
              Skill-Prep
            </h3>
            <div className="hidden md:flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-sm text-blue-300 hover:text-blue-200 transition-colors"
            >
              <User className="h-5 w-5 text-blue-400" />
              <span>Profile</span>
            </Link>

            {/* Resources */}
            <Link
              to="/resources"
              className="flex items-center space-x-2 text-sm text-green-300 hover:text-green-200 transition-colors"
            >
              <Compass className="h-5 w-5 text-yellow-400" />
              <span>Resources</span>
            </Link>

            {/* Recommendations */}
            <Link
              to="/recommendations"
              className="flex items-center space-x-2 text-sm text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              <Book className="h-5 w-5 text-green-400" />
              <span>Recommendations</span>
            </Link>

            {/* Performance */}
            <Link
              to="/performance"
              className="flex items-center space-x-2 text-sm text-purple-300 hover:text-purple-200 transition-colors"
            >
              <ChartBar className="h-5 w-5 text-purple-400" />
              <span>Performance</span>
            </Link>
          </div>

          {/* Subscribe Form - Mobile Hidden */}
          <div className="hidden md:block">
            <button
              onClick={handleClick}
              className="flex items-center bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
            >
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              Contact Us
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-400 mb-2 md:mb-0">
            © {currentYear} Skill-Prep. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
