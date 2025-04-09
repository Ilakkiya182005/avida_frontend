import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function TextReader() {
  // State management
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [error, setError] = useState("");
  const [fileType, setFileType] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("raw");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    voice: null,
    language: "en-US" // Default language
  });
  const [theme, setTheme] = useState("light");
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const textContainerRef = useRef(null);
  const speechRef = useRef(null);
  const themeButtonRef = useRef(null);

  // Available voices and languages
  const [voices, setVoices] = useState([]);
  const [showVoiceOptions, setShowVoiceOptions] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  // Supported languages with labels and voice samples
  const languages = [
    { code: "en-US", name: "English (US)", voiceSample: "Hello, how are you?" },
    { code: "ta-IN", name: "Tamil", voiceSample: "வணக்கம், எப்படி இருக்கிறீர்கள்?" },
    { code: "en-GB", name: "English (UK)", voiceSample: "Hello, how are you?" },
    { code: "es-ES", name: "Spanish", voiceSample: "Hola, ¿cómo estás?" },
    { code: "fr-FR", name: "French", voiceSample: "Bonjour, comment ça va?" },
    { code: "de-DE", name: "German", voiceSample: "Hallo, wie geht's?" },
    { code: "it-IT", name: "Italian", voiceSample: "Ciao, come stai?" },
    { code: "pt-BR", name: "Portuguese (BR)", voiceSample: "Olá, como vai?" },
    { code: "ru-RU", name: "Russian", voiceSample: "Привет, как дела?" },
    { code: "ja-JP", name: "Japanese", voiceSample: "こんにちは、元気ですか？" },
    { code: "zh-CN", name: "Chinese (Mandarin)", voiceSample: "你好，你好吗？" },
    { code: "ar-SA", name: "Arabic", voiceSample: "مرحبا، كيف حالك؟" },
    { code: "hi-IN", name: "Hindi", voiceSample: "नमस्ते, आप कैसे हैं?" }
  ];

  // Theme options
  const themes = [
    { name: "Light", value: "light", bg: "bg-gray-50", text: "text-gray-800", card: "bg-white" },
    { name: "Dark", value: "dark", bg: "bg-gray-900", text: "text-gray-100", card: "bg-gray-800" },
    { name: "Blue", value: "blue", bg: "bg-blue-50", text: "text-blue-900", card: "bg-white" },
    { name: "Teal", value: "teal", bg: "bg-teal-50", text: "text-teal-900", card: "bg-white" },
    { name: "Rose", value: "rose", bg: "bg-rose-50", text: "text-rose-900", card: "bg-white" },
  ];

  // Helper functions
  const countWords = (str) => str.trim() ? str.trim().split(/\s+/).length : 0;
  const countLines = (str) => str.trim() ? str.split('\n').length : 0;

  // File handling functions
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setText("");
    setCorrectedText("");
    setError("");
    setFileType(selectedFile.name.split(".").pop().toLowerCase());
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  // API call handlers
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setText(response.data.text || "No text found");
      setActiveTab("raw");
    } catch (err) {
      setError(err.response?.data?.detail?.message || "Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const correctText = async () => {
    if (!text) return;
    
    setCorrecting(true);
    try {
      const response = await axios.post("http://localhost:8000/correct-text", { text });
      setCorrectedText(response.data.correctedText || text);
      setActiveTab("corrected");
    } catch (err) {
      setError("Failed to correct text");
      setCorrectedText(text);
    } finally {
      setCorrecting(false);
    }
  };

  // Speech control handlers
  const handleReadText = () => {
    const contentToRead = activeTab === "corrected" ? correctedText : text;
    
    if (!contentToRead) {
      setError("No text available to read");
      return;
    }

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(contentToRead);
        speech.lang = voiceSettings.language;
        speech.rate = voiceSettings.rate;
        speech.pitch = voiceSettings.pitch;
        
        // Find the best voice for the selected language
        const availableVoices = window.speechSynthesis.getVoices();
        const preferredVoice = availableVoices.find(
          v => v.lang === voiceSettings.language
        ) || availableVoices.find(
          v => v.lang.startsWith(voiceSettings.language.substring(0, 2))
        ) || availableVoices[0];
        
        speech.voice = preferredVoice;
        
        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => setIsSpeaking(false);
        speech.onerror = () => {
          setIsSpeaking(false);
          setError("Error reading text aloud");
        };
        
        speechRef.current = speech;
        window.speechSynthesis.speak(speech);
      } catch (err) {
        setError("Failed to read text aloud");
      }
    } else {
      setError("Text-to-speech not supported in this browser");
    }
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceChange = (voice) => {
    setVoiceSettings(prev => ({ ...prev, voice }));
    setShowVoiceOptions(false);
  };

  const handleLanguageChange = (languageCode) => {
    setVoiceSettings(prev => ({ ...prev, language: languageCode }));
    setShowLanguageOptions(false);
    
    // Reset voice when language changes to ensure compatibility
    const availableVoices = window.speechSynthesis.getVoices();
    const newVoice = availableVoices.find(v => v.lang === languageCode) || 
                     availableVoices.find(v => v.lang.startsWith(languageCode.substring(0, 2))) || 
                     null;
    setVoiceSettings(prev => ({ ...prev, voice: newVoice }));
  };

  const handleRateChange = (e) => {
    setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }));
  };

  const handlePitchChange = (e) => {
    setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }));
  };

  // Clipboard function
  const copyToClipboard = async () => {
    const contentToCopy = activeTab === "corrected" ? correctedText : text;
    if (!contentToCopy) {
      setError("No text available to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(contentToCopy);
      setError("");
    } catch (err) {
      setError("Failed to copy text to clipboard");
    }
  };

  // Theme functions
  const getThemeClasses = () => {
    const selectedTheme = themes.find(t => t.value === theme) || themes[0];
    return {
      bg: selectedTheme.bg,
      text: selectedTheme.text,
      card: selectedTheme.card,
      border: theme === "dark" ? "border-gray-700" : "border-gray-200",
      buttonPrimary: theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700",
      buttonSecondary: theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
      textMuted: theme === "dark" ? "text-gray-400" : "text-gray-500",
    };
  };

  // Effects
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "blue", "teal", "rose");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeButtonRef.current && !themeButtonRef.current.contains(event.target)) {
        setShowThemeOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);
      
      // Set initial voice based on current language if not set
      if (availableVoices.length > 0 && !voiceSettings.voice) {
        const preferredVoice = availableVoices.find(
          v => v.lang === voiceSettings.language
        ) || availableVoices.find(
          v => v.lang.startsWith(voiceSettings.language.substring(0, 2))
        ) || availableVoices.find(v => v.default) || availableVoices[0];
        
        setVoiceSettings(prev => ({
          ...prev,
          voice: preferredVoice
        }));
      }
    };

    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
    };
  }, [voiceSettings.language]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const themeClasses = getThemeClasses();

  // Get current language name
  const currentLanguage = languages.find(lang => lang.code === voiceSettings.language) || languages[0];

  return (
    <div className={`flex flex-col items-center p-4 ${themeClasses.bg} ${themeClasses.text} min-h-screen font-sans`}>
      <div className="w-full max-w-6xl">
        {/* Theme Selector Button */}
        <div className="flex justify-end mb-4">
          <div className="relative" ref={themeButtonRef}>
            <button
              onClick={() => setShowThemeOptions(!showThemeOptions)}
              className={`p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors flex items-center`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M5 17h.01"></path>
              </svg>
              <span>Theme</span>
            </button>
            {showThemeOptions && (
              <div className={`absolute right-0 mt-2 w-40 ${themeClasses.card} rounded-md shadow-lg py-1 z-50 border ${themeClasses.border}`}>
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setShowThemeOptions(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === themeOption.value 
                        ? "bg-blue-100 text-blue-800" 
                        : `${themeClasses.text} hover:bg-gray-100`
                    }`}
                  >
                    {themeOption.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className={`${themeClasses.card} p-8 rounded-xl shadow-lg border ${themeClasses.border}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Smart Text Extractor
              </span>
            </h1>
            <p className={`${themeClasses.textMuted} text-lg`}>Extract, enhance, and listen to text from any document</p>
          </div>

          {/* File Upload Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <div 
                className={`mb-6 transition-all duration-300 ${isDragging ? "scale-[1.02]" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragging ? "border-blue-400 bg-blue-50" : `${themeClasses.border} hover:border-blue-400 hover:bg-blue-50`
                }`}>
                  {fileName ? (
                    <>
                      <div className="p-3 bg-blue-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium mb-1 truncate max-w-xs">
                          {fileName}
                        </p>
                        <p className={`text-sm ${themeClasses.textMuted}`}>
                          Click to change file
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium mb-1">
                          Drag & drop files or click to browse
                        </p>
                        <p className={`text-sm ${themeClasses.textMuted}`}>
                          Supports: PNG, JPG, PDF, TXT, DOCX
                        </p>
                      </div>
                    </>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.docx" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 flex-1 ${
                    loading || !file ? "bg-gray-400 cursor-not-allowed" : `${themeClasses.buttonPrimary} hover:shadow-lg`
                  }`}
                >
                  {loading && (
                    <span className="absolute inset-0 bg-blue-700 animate-pulse"></span>
                  )}
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Extracting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        Extract Text
                      </>
                    )}
                  </span>
                </button>

                {text && (
                  <button
                    onClick={correctText}
                    disabled={correcting || !text}
                    className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 flex-1 ${
                      correcting || !text ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
                    }`}
                  >
                    {correcting && (
                      <span className="absolute inset-0 bg-purple-700 animate-pulse"></span>
                    )}
                    <span className="relative flex items-center justify-center">
                      {correcting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Correcting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Enhance Text
                        </>
                      )}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Voice Settings Panel */}
            <div className={`${themeClasses.card} p-6 rounded-xl border ${themeClasses.border}`}>
              <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
              
              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Language</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                      className={`w-full flex justify-between items-center px-4 py-2 ${themeClasses.card} border ${themeClasses.border} rounded-md shadow-sm text-sm ${themeClasses.text} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <span>{currentLanguage.name}</span>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {showLanguageOptions && (
                      <div className={`absolute z-10 mt-1 w-full ${themeClasses.card} shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border ${themeClasses.border}`}>
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              lang.code === voiceSettings.language 
                                ? "bg-blue-100 text-blue-800" 
                                : `${themeClasses.text} hover:bg-gray-100`
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{lang.name}</span>
                              <span className={`text-xs ${themeClasses.textMuted}`}>{lang.voiceSample}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Voice Selection */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Voice</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowVoiceOptions(!showVoiceOptions)}
                      className={`w-full flex justify-between items-center px-4 py-2 ${themeClasses.card} border ${themeClasses.border} rounded-md shadow-sm text-sm ${themeClasses.text} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <span>{voiceSettings.voice?.name || "Default voice"}</span>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {showVoiceOptions && (
                      <div className={`absolute z-10 mt-1 w-full ${themeClasses.card} shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border ${themeClasses.border}`}>
                        {voices
                          .filter(voice => voice.lang.startsWith(voiceSettings.language.substring(0, 2)))
                          .map((voice) => (
                            <button
                              key={voice.voiceURI}
                              onClick={() => handleVoiceChange(voice)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                voice.voiceURI === voiceSettings.voice?.voiceURI 
                                  ? "bg-blue-100 text-blue-800" 
                                  : `${themeClasses.text} hover:bg-gray-100`
                              }`}
                            >
                              {voice.name} ({voice.lang})
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rate Control */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>
                    Speed: {voiceSettings.rate.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={handleRateChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className={`flex justify-between text-xs ${themeClasses.textMuted} mt-1`}>
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>

                {/* Pitch Control */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>
                    Pitch: {voiceSettings.pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.pitch}
                    onChange={handlePitchChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className={`flex justify-between text-xs ${themeClasses.textMuted} mt-1`}>
                    <span>Lower</span>
                    <span>Higher</span>
                  </div>
                </div>

                {/* Play Controls */}
                {text && (
                  <div className="flex space-x-2 pt-2">
                    {isSpeaking ? (
                      <button
                        onClick={handleStopSpeech}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                        </svg>
                        Stop
                      </button>
                    ) : (
                      <button
                        onClick={handleReadText}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"></path>
                        </svg>
                        Play
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {/* Results Section */}
          {text && (
            <div className="mt-8 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold">
                    {activeTab === "corrected" ? "Enhanced Content" : "Extracted Content"}
                  </h3>
                  <span className={`ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ${theme === "dark" ? "bg-opacity-30" : ""}`}>
                    {fileType.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className={`flex rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} p-1`}>
                    <button
                      onClick={() => setActiveTab("raw")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        activeTab === "raw" ? `${theme === "dark" ? "bg-gray-600" : "bg-white"} text-blue-600 shadow-sm` : `${themeClasses.text} hover:${theme === "dark" ? "text-gray-300" : "text-gray-800"}`
                      }`}
                    >
                      Raw Text
                    </button>
                    <button
                      onClick={() => correctedText && setActiveTab("corrected")}
                      disabled={!correctedText}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        activeTab === "corrected" ? `${theme === "dark" ? "bg-gray-600" : "bg-white"} text-blue-600 shadow-sm` : `${themeClasses.text} hover:${theme === "dark" ? "text-gray-300" : "text-gray-800"}`
                      } ${!correctedText ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Enhanced
                    </button>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors relative group`}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                      </svg>
                      <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-800"} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity`}>
                        Copy to clipboard
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div 
                ref={textContainerRef}
                className={`p-5 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-xl border ${themeClasses.border} max-h-96 overflow-y-auto scrollbar-thin ${theme === "dark" ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800" : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"}`}
              >
                <pre className={`whitespace-pre-wrap font-sans leading-relaxed ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                  {activeTab === "corrected" ? correctedText : text}
                </pre>
              </div>

              {/* Stats and Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-sm gap-2">
                <div className="flex flex-wrap gap-3">
                  <span><span className="font-medium text-blue-600">{countWords(activeTab === "corrected" ? correctedText : text)}</span> words</span>
                  <span><span className="font-medium text-blue-600">{(activeTab === "corrected" ? correctedText : text).length}</span> characters</span>
                  <span><span className="font-medium text-blue-600">{countLines(activeTab === "corrected" ? correctedText : text)}</span> lines</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setText("");
                      setCorrectedText("");
                      handleStopSpeech();
                    }}
                    className={`${themeClasses.textMuted} hover:${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center text-sm`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`text-center mt-8 ${themeClasses.textMuted} text-sm`}>
          <p>Powered by advanced OCR and NLP technology</p>
        </div>
      </div>
    </div>
  );
}