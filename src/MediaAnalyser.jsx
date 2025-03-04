import React, { useState, useCallback } from "react";
import {
  Upload,
  History,
  X,
  Linkedin,
  Send,
  Download,
  Film,
  Image,
  LogOut,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Logo from "./Assets/logo.png";
import Background from "./Assets/bg.svg";
import Footer from "./Components/Footer";
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MediaAnalyzer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [loading, setLoading] = useState(false);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const isValidFileType = (file) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    const validVideoTypes = ["video/mp4", "video/quicktime"]; // quicktime = .mov

    if (validImageTypes.includes(file.type)) {
      return { valid: true, type: "image" };
    } else if (validVideoTypes.includes(file.type)) {
      return { valid: true, type: "video" };
    }

    return { valid: false, type: null };
  };

  const uploadMedia = async (file) => {
    setLoading(true);
    setError("");
    setAltText("");
    setDownloadLink("");

    const formData = new FormData();
    formData.append(mediaType === "image" ? "image" : "video", file);

    try {
      const endpoint =
        mediaType === "image"
          ? "http://127.0.0.1:3000/api/images/generate-alt-text/upload"
          : "http://127.0.0.1:3000/api/videos/upload-video";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze ${mediaType}`);
      }

      const data = await response.json();

      // Handle different response formats based on media type
      if (mediaType === "image") {
        setAltText(data.altText);
      } else {
        // For video, the analysis comes through description property
        setAltText(data.description);
      }

      if (data.downloadLink) {
        setDownloadLink(data.downloadLink);
      }
    } catch (err) {
      setError(`Failed to analyze ${mediaType}. Please try again.`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:3000${downloadLink}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.txt"; // or use a name from the response if provided
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download report. Please try again.");
      console.error("Download error:", err);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const fileCheck = isValidFileType(file);

      if (fileCheck.valid) {
        setMediaType(fileCheck.type);
        const reader = new FileReader();
        reader.onload = (event) => {
          setMedia(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError(
          "Invalid file type. Please upload JPEG, PNG, MP4, or MOV files."
        );
      }
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const fileCheck = isValidFileType(file);

      if (fileCheck.valid) {
        setMediaType(fileCheck.type);
        const reader = new FileReader();
        reader.onload = (event) => {
          setMedia(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError(
          "Invalid file type. Please upload JPEG, PNG, MP4, or MOV files."
        );
      }
    }
  }, []);

  const handleAnalyze = async () => {
    // Get the file extension from the mediaType
    const extension = mediaType === "image" ? "jpg" : "mp4";

    const file = await fetch(media)
      .then((r) => r.blob())
      .then(
        (blobFile) =>
          new File([blobFile], `file.${extension}`, {
            type: mediaType === "image" ? "image/jpeg" : "video/mp4",
          })
      );

    await uploadMedia(file);
  };

  const resetMedia = () => {
    setMedia(null);
    setMediaType(null);
    setAltText("");
    setError("");
    setDownloadLink("");
  };

  const NavLink = ({ children, active }) => (
    <button
      className={`px-2 sm:px-4 py-2 font-medium text-sm sm:text-base ${
        active
          ? "text-blue-500 border-b-2 border-blue-500"
          : "text-gray-600 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-10 w-auto"
                />
              </div>
              <nav className="ml-6">
                <button
                  className="px-4 py-2 text-sm font-medium text-blue-500 border-b-2 border-blue-500"
                >
                  Analyze
                </button>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 sm:py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Panel - Upload Section */}
          <div
            className="rounded-lg shadow p-4 sm:p-6 flex flex-col items-center"
            style={{
              backgroundImage: `url(${Background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">
              Upload media to analyze
            </h2>
            {/* Fixed height container for the upload area */}
            <div className="w-full h-48 sm:h-[28rem]">
              <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-8 transition-colors duration-200 ease-in-out w-full h-full bg-white flex flex-col items-center justify-center
                  ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {media ? (
                  <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative">
                    {mediaType === "image" ? (
                      <img
                        src={media}
                        alt="Uploaded preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <video
                        src={media}
                        controls
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                    <button
                      onClick={resetMedia}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="flex gap-4 mb-4">
                      <Image className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      <Film className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 mb-2">
                      Drop your file here or{" "}
                      <label className="text-blue-500 cursor-pointer hover:text-blue-600">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.mp4,.mov"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Supports: JPEG, PNG, MP4, MOV
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              className={`mt-12 mb-16 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base
                ${
                  media && !loading
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              disabled={!media || loading}
              onClick={handleAnalyze}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              ) : (
                <Upload size={16} className="sm:w-5 sm:h-5" />
              )}
              {loading ? "Analyzing..." : `Analyze ${mediaType || "Media"}`}
            </button>
          </div>

          {/* Right Panel - Results Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="h-full flex flex-col">
              {error && (
                <div className="text-red-500 text-center mb-4 text-sm sm:text-base">
                  {error}
                </div>
              )}

              {/* Result content area - modified to have a fixed height */}
              <div className="flex-grow flex flex-col h-48 sm:h-[28rem]">
                {/* Scrollable content area */}
                <div className="overflow-y-auto flex-grow">
                  {altText ? (
                    <div className="prose prose-sm sm:prose max-w-none w-full flex flex-col gap-3">
                      <ReactMarkdown>{altText}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm sm:text-base text-center h-full items-center justify-center flex flex-col">
                      Report will be shown here
                    </div>
                  )}
                </div>

                {/* Download button area - fixed position at bottom */}
                {downloadLink && (
                  <div className="mt-4 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-gray-800 font-medium">
                        Download Result:
                      </span>
                      <button
                        onClick={handleDownload}
                        className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MediaAnalyzer;
