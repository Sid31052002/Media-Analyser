import React from "react";
import {
  Upload,
  History,
  X,
  Linkedin,
  Send,
  Download,
  Film,
  Image,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white mt-auto">
      <div className="max-w-full font-bold px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-10 sm:h-16 gap-4 sm:gap-0 px-4">
          <div className="text-xs sm:text-lg text-gray-600 text-center sm:text-left">
            Copyright © 2024 TWIN Protocol, Inc
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex gap-8">
              <a
                href="#"
                className="text-xs sm:text-lg text-gray-600 hover:text-gray-800"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs sm:text-lg text-gray-600 hover:text-gray-800"
              >
                Term & Condition
              </a>
            </div>
            <div className="flex items-center gap-4">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
