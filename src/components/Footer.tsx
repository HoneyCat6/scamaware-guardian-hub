
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">ScamAware</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © 2024 ScamAware. Protecting you from digital deception.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Stay vigilant, stay safe.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
