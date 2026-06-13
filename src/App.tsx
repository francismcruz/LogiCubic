import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  FileText,
  FileDown,
  Settings,
  Scale,
  Truck,
  Trash2,
  Undo2,
  Sparkles,
  Info,
  Calendar,
  Search,
  CheckCircle2,
  Printer,
  ChevronRight,
  Plus,
  Minus,
  Share2,
  Copy,
  Loader2,
  Globe,
  ShieldCheck,
  MapPin,
  PenTool,
  Camera,
  Cloud,
  AlertCircle,
  RefreshCw,
  X,
  Check
} from "lucide-react";
import { CubicajeRecord, PresetTruck } from "./types";
import { PRESET_TRUCKS, FORMULA_HELP } from "./constants";
import { testFirestoreConnection, saveCubicajeToCloud, getCubicajesFromCloud, auth } from "./lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User 
} from "firebase/auth";
import { TRANSLATIONS, LanguageCode } from "./translations";
import { getCustomT } from "./customTranslations";
import PhotoSelector from "./components/PhotoSelector";
import { TruckVisualizer } from "./components/TruckVisualizer";
import { AppIcon } from "./components/AppIcon";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function DumpTruckIcon({ className = "w-5 h-5", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Horizontal ground line at the bottom */}
      <line x1="8" y1="84" x2="92" y2="84" />

      {/* Cabin body of the dump truck */}
      <path d="M 11 67 V 52 H 21 L 26.5 38 H 36.5 V 67 Z" />
      
      {/* Cabin door window */}
      <path d="M 23.5 42 H 32 V 51 H 20 Z" />

      {/* Front headlight */}
      <line x1="11" y1="59" x2="14" y2="59" />

      {/* Main chassis horizontal bar behind the cabin */}
      <line x1="36.5" y1="59" x2="85" y2="59" />

      {/* Container support blocks beneath the dump body */}
      <line x1="52" y1="59" x2="52" y2="54" />
      <line x1="64" y1="59" x2="64" y2="54" />
      <line x1="76" y1="59" x2="76" y2="54" />

      {/* Dump container (tolva) with sloped top and front visor overhang */}
      <path d="M 42 54 H 88 V 35 L 58 30 L 42 24 L 37 19 L 42 24.5 Z" />

      {/* Four vertical structural ribs on the dump body */}
      <line x1="51" y1="54" x2="51" y2="31" />
      <line x1="60" y1="54" x2="60" y2="32" />
      <line x1="69" y1="54" x2="69" y2="33" />
      <line x1="78" y1="54" x2="78" y2="34" />

      {/* Double concentric wheels for robust truck style */}
      {/* Front Wheel */}
      <circle cx="23.5" cy="74.5" r="7.5" strokeWidth="5.5" fill="none" />
      <circle cx="23.5" cy="74.5" r="2" fill="currentColor" />

      {/* Rear Wheel */}
      <circle cx="68" cy="74.5" r="7.5" strokeWidth="5.5" fill="none" />
      <circle cx="68" cy="74.5" r="2" fill="currentColor" />
    </svg>
  );
}

function HopperIcon({ className = "w-4 h-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Container Bed profile */}
      <path d="M3 7h15l2 8.5H5.5L3 7z" />
      <path d="M3 7l-1.5-3.5 3-1 1.5 4.5" />
      {/* Structural rib reinforcement lines */}
      <line x1="8.5" y1="7" x2="9.5" y2="15.5" />
      <line x1="12.5" y1="7" x2="13.5" y2="15.5" />
      <line x1="16.5" y1="7" x2="17.5" y2="15.5" />
    </svg>
  );
}

function TablaIcon({ className = "w-4 h-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* A single clean horizontal wooden board/plank */}
      <rect x="2" y="8" width="20" height="8" rx="1.5" />
      
      {/* Elegant wood grain lines inside the plank */}
      <path d="M 6 12 C 10 11, 14 13, 18 12" strokeWidth="1.2" strokeDasharray="3 1" opacity="0.8" />
      <path d="M 4 10 H 20" strokeWidth="0.8" opacity="0.4" />
      <path d="M 4 14 H 20" strokeWidth="0.8" opacity="0.4" />

      {/* Fixing nail dots on both ends */}
      <circle cx="4.5" cy="12" r="0.8" fill="currentColor" />
      <circle cx="19.5" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

function BotellaIcon({ className = "w-4 h-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Piston Cylinder / Hydraulic Bottle body */}
      <circle cx="12" cy="3" r="1.5" />
      {/* Inner shaft rod */}
      <rect x="11.2" y="4.5" width="1.6" height="4.5" rx="0.5" />
      {/* Standard intermediate sleeve */}
      <rect x="10.2" y="9" width="3.6" height="5.5" rx="0.5" />
      {/* Base container outer barrel */}
      <rect x="9.2" y="14.5" width="5.6" height="6.5" rx="1" />
      {/* Lower fluid port joint */}
      <line x1="14.8" y1="17.5" x2="16.5" y2="17.5" />
      <circle cx="12" cy="21" r="1" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [bypassAuth, setBypassAuth] = useState<boolean>(() => localStorage.getItem("medidorm3_bypass_auth") === "true");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState<boolean>(false);
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState<boolean>(false);

  // Listen to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("medidorm3_bypass_auth", bypassAuth ? "true" : "false");
  }, [bypassAuth]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthInProgress(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setBypassAuth(false);
      setAuthPassword("");
    } catch (err: any) {
      console.error("Auth error:", err);
      let errorMsg = "Error de autenticación. Por favor, intente de nuevo.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
        errorMsg = "Correo o contraseña incorrectos.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "Este correo electrónico ya está registrado.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "La contraseña debe tener al menos 6 caracteres.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
    } finally {
      setAuthInProgress(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setPasswordResetSent(false);
    setAuthInProgress(true);
    try {
      if (!authEmail) {
        throw new Error(lang === "es" ? "Por favor, ingresa tu correo electrónico." : lang === "en" ? "Please enter your email address." : "Por favor, insira seu e-mail.");
      }
      await sendPasswordResetEmail(auth, authEmail);
      setPasswordResetSent(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      let errorMsg = lang === "es" ? "Error al enviar el correo de recuperación. Por favor, intente de nuevo." : lang === "en" ? "Failed to send reset email. Please try again." : "Falha ao enviar e-mail de recuperação. Tente novamente.";
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        errorMsg = lang === "es" ? "No existe ningún usuario registrado con este correo electrónico." : lang === "en" ? "No registered user found with this email." : "Nenhum usuário registrado com este e-mail.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = lang === "es" ? "El correo electrónico no es válido." : lang === "en" ? "Invalid email address." : "E-mail inválido.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setBypassAuth(false);
      setHistory([]);
      setSelectedRecordId(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Current tab view: "calculator", "history", "reports", "settings"
  const [activeTab, setActiveTab] = useState<"calculator" | "history" | "reports" | "settings">("calculator");

  // New States: Media/Evidence Entries
  const [foto, setFoto] = useState<string | null>(() => localStorage.getItem("medidorm3_draft_foto"));

  // Core Calculator Inputs State
  const [placa, setPlaca] = useState<string>(() => localStorage.getItem("medidorm3_draft_placa") || "");
  const [cubicador, setCubicador] = useState<string>(() => localStorage.getItem("medidorm3_draft_cubicador") || "");
  const [chofer, setChofer] = useState<string>(() => localStorage.getItem("medidorm3_draft_chofer") || "");
  const [empresa, setEmpresa] = useState<string>(() => localStorage.getItem("medidorm3_draft_empresa") || "");
  const [empresaTransporte, setEmpresaTransporte] = useState<string>(() => localStorage.getItem("medidorm3_draft_empresaTransporte") || "");
  const [proyecto, setProyecto] = useState<string>(() => localStorage.getItem("medidorm3_draft_proyecto") || "");
  const [inputA, setInputA] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputA") || "");
  const [inputB, setInputB] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputB") || "");
  const [inputC, setInputC] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputC") || "");

  const [inputTablaB, setInputTablaB] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputTablaB") || "");
  const [inputTablaD, setInputTablaD] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputTablaD") || "");
  const [inputTablaE, setInputTablaE] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputTablaE") || "");

  const [inputBPlus, setInputBPlus] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputBPlus") || "");
  const [inputBMinus, setInputBMinus] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputBMinus") || "");
  const [inputH, setInputH] = useState<string>(() => localStorage.getItem("medidorm3_draft_inputH") || "");

  const [compactionFactor, setCompactionFactor] = useState<number>(1.4); // default divisor is 1.4
  const [factorInputText, setFactorInputText] = useState<string>("1.40");
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Persist draft form inputs to localStorage as they change
  useEffect(() => {
    localStorage.setItem("medidorm3_draft_placa", placa);
    localStorage.setItem("medidorm3_draft_cubicador", cubicador);
    localStorage.setItem("medidorm3_draft_chofer", chofer);
    localStorage.setItem("medidorm3_draft_empresa", empresa);
    localStorage.setItem("medidorm3_draft_empresaTransporte", empresaTransporte);
    localStorage.setItem("medidorm3_draft_proyecto", proyecto);
    localStorage.setItem("medidorm3_draft_inputA", inputA);
    localStorage.setItem("medidorm3_draft_inputB", inputB);
    localStorage.setItem("medidorm3_draft_inputC", inputC);
    localStorage.setItem("medidorm3_draft_inputTablaB", inputTablaB);
    localStorage.setItem("medidorm3_draft_inputTablaD", inputTablaD);
    localStorage.setItem("medidorm3_draft_inputTablaE", inputTablaE);
    localStorage.setItem("medidorm3_draft_inputBPlus", inputBPlus);
    localStorage.setItem("medidorm3_draft_inputBMinus", inputBMinus);
    localStorage.setItem("medidorm3_draft_inputH", inputH);

    if (foto !== null) localStorage.setItem("medidorm3_draft_foto", foto);
    else localStorage.removeItem("medidorm3_draft_foto");
  }, [
    placa, cubicador, chofer, empresa, empresaTransporte, proyecto,
    inputA, inputB, inputC, inputTablaB, inputTablaD, inputTablaE,
    inputBPlus, inputBMinus, inputH, foto
  ]);

  // States for History & Reports
  const [history, setHistory] = useState<CubicajeRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSaveNotification, setShowSaveNotification] = useState<boolean>(false);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);
  const [shareNotificationMessage, setShareNotificationMessage] = useState<string>("¡Reporte copiado para compartir!");
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [showFormulaGuide, setShowFormulaGuide] = useState<boolean>(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);
  const [showDuplicatesCorrector, setShowDuplicatesCorrector] = useState<boolean>(false);

  // Language settings for dynamic multi-language field work
  const [lang, setLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("medidorm3_lang");
    return (saved as LanguageCode) || "es";
  });

  useEffect(() => {
    localStorage.setItem("medidorm3_lang", lang);
  }, [lang]);

  // Translation function helper
  const t = (key: keyof typeof TRANSLATIONS["es"]) => {
    const currentDict = TRANSLATIONS[lang] || TRANSLATIONS["es"];
    return currentDict[key] || TRANSLATIONS["es"][key] || "";
  };

  // Theme states for Day/Night and High-Contrast legible field-work
  type ThemeMode = "dark" | "light" | "system";
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("medidorm3_theme");
    return (saved as ThemeMode) || "dark";
  });
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    localStorage.setItem("medidorm3_theme", themeMode);
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      };
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    if (resolvedTheme === "light") {
      document.body.style.backgroundColor = "#f8fafc";
    } else {
      document.body.style.backgroundColor = "#141b2d";
    }
  }, [resolvedTheme]);


  // Load config on mount
  useEffect(() => {
    const savedFactor = localStorage.getItem("medidorm3_factor");
    if (savedFactor) {
      const parsed = parseFloat(savedFactor);
      if (!isNaN(parsed) && parsed > 0) {
        setCompactionFactor(parsed);
      }
    }
  }, []);

  // Load history reactively based on Auth State
  useEffect(() => {
    if (authLoading) return;

    const storageKey = currentUser?.email 
      ? `medidorm3_history_${currentUser.email}` 
      : "medidorm3_history";

    const savedHistory = localStorage.getItem(storageKey);
    let localParsed: CubicajeRecord[] = [];
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          localParsed = parsed;
          setHistory(parsed);
          if (parsed.length > 0) {
            setSelectedRecordId(parsed[0].id);
          } else {
            setSelectedRecordId(null);
          }
        }
      } catch (e) {
        console.error("Error parsing history", e);
      }
    } else {
      setHistory([]);
      setSelectedRecordId(null);
    }

    const syncWithCloud = async () => {
      try {
        const connected = await testFirestoreConnection();
        if (connected) {
          const emailFilter = currentUser?.email || undefined;
          
          if (!currentUser) {
            return;
          }

          const cloudRecords = await getCubicajesFromCloud(emailFilter);
          
          // Merge local and cloud records based on unique ID
          const mergedMap = new Map<string, CubicajeRecord>();
          cloudRecords.forEach(rec => mergedMap.set(rec.id, rec));
          localParsed.forEach(rec => mergedMap.set(rec.id, rec));
          
          const sortedMerged = Array.from(mergedMap.values()).sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });

          setHistory(sortedMerged);
          localStorage.setItem(storageKey, JSON.stringify(sortedMerged));
          if (sortedMerged.length > 0) {
            setSelectedRecordId(sortedMerged[0].id);
          }
        }
      } catch (err) {
        console.error("Could not load cloud records", err);
      }
    };
    syncWithCloud();
  }, [currentUser, authLoading]);

  useEffect(() => {
    setFactorInputText(compactionFactor === 0 ? "" : compactionFactor.toFixed(2));
  }, [compactionFactor]);

  // Save history helper
  const saveToLocalStorage = (newHistory: CubicajeRecord[]) => {
    const storageKey = currentUser?.email 
      ? `medidorm3_history_${currentUser.email}` 
      : "medidorm3_history";
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Parsing values to avoid NaN
  const valA = parseFloat(inputA) || 0;
  const valB = parseFloat(inputB) || 0;
  const valC = parseFloat(inputC) || 0;

  const valTablaB = parseFloat(inputTablaB) || 0;
  const valTablaD = parseFloat(inputTablaD) || 0;
  const valTablaE = parseFloat(inputTablaE) || 0;

  const valBPlus = parseFloat(inputBPlus) || 0;
  const valBMinus = parseFloat(inputBMinus) || 0;
  const valH = parseFloat(inputH) || 0;

  // Actual Math Formulas (following user exact logic)
  const volTolva = valA * valB * valC;
  const volTabla = valTablaB * valTablaD * valTablaE;
  const volBotella = ((valBPlus + valBMinus) / 2) * valH;
  const sumaTotal = volTolva + volTabla + volBotella;
  const volNeto = sumaTotal - volBotella; // mathematically corresponds to (volTolva + volTabla)

  // Handlers for adjust value chips (making it glove-friendly for field operators!)
  const handleAdjustValue = (
    field: string,
    current: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    amount: number
  ) => {
    const parsed = parseFloat(current) || 0;
    const updated = Math.max(0, parsed + amount);
    setter(updated.toFixed(2));
  };

  // Clean form
  const handleClear = () => {
    setPlaca("");
    setCubicador("");
    setChofer("");
    setEmpresa("");
    setEmpresaTransporte("");
    setProyecto("");
    setInputA("");
    setInputB("");
    setInputC("");
    setInputTablaB("");
    setInputTablaD("");
    setInputTablaE("");
    setInputBPlus("");
    setInputBMinus("");
    setInputH("");
    setFoto(null);
  };

  // Save current record to localStorage
  const handleSave = () => {
    const defaultPlaca = placa.trim().toUpperCase() || "SIN PLACA";
    const timestamp = new Date().toISOString();
    const newRecord: CubicajeRecord = {
      id: "M3_" + Date.now().toString(),
      placa: defaultPlaca,
      cubicador: cubicador.trim(),
      chofer: chofer.trim(),
      empresa: empresa.trim(),
      empresaTransporte: empresaTransporte.trim(),
      proyecto: proyecto.trim(),
      fecha: timestamp,
      A: valA,
      B: valB,
      C: valC,
      volTolva,
      tablaB: valTablaB,
      tablaD: valTablaD,
      tablaE: valTablaE,
      volTabla,
      bPlus: valBPlus,
      bMinus: valBMinus,
      H: valH,
      volBotella,
      sumaTotal,
      volNeto,
      foto: foto || undefined,
    };

    const updatedHistory = [newRecord, ...history];
    saveToLocalStorage(updatedHistory);
    setSelectedRecordId(newRecord.id);

    // Try to sync with Firestore in secure cloud background immediately
    saveCubicajeToCloud(newRecord).catch((err) => {
      console.warn("Background auto-save to cloud failed (operator is probably offline), will sync next manual trigger:", err);
    });

    // Show temporary animation feedback
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2500);

    // Navigate to Reports tab to immediately visualize printable sheet
    setActiveTab("reports");
  };

  // Preset Load Handler
  const handleLoadPreset = (preset: PresetTruck) => {
    setInputA(preset.A.toFixed(2));
    setInputB(preset.B.toFixed(2));
    setInputC(preset.C.toFixed(2));
    setInputTablaB(preset.tablaB.toFixed(2));
    setInputTablaD(preset.tablaD.toFixed(2));
    setInputTablaE(preset.tablaE.toFixed(2));
    setInputBPlus(preset.bPlus.toFixed(2));
    setInputBMinus(preset.bMinus.toFixed(2));
    setInputH(preset.H.toFixed(2));
  };

  // Load a record from history back into current inputs
  const handleLoadFromHistory = (rec: CubicajeRecord) => {
    setPlaca(rec.placa);
    setCubicador(rec.cubicador || "");
    setChofer(rec.chofer || "");
    setEmpresa(rec.empresa || "");
    setEmpresaTransporte(rec.empresaTransporte || "");
    setProyecto(rec.proyecto || "");
    setInputA(rec.A.toString());
    setInputB(rec.B.toString());
    setInputC(rec.C.toString());
    setInputTablaB(rec.tablaB.toString());
    setInputTablaD(rec.tablaD.toString());
    setInputTablaE(rec.tablaE.toString());
    setInputBPlus(rec.bPlus.toString());
    setInputBMinus(rec.bMinus.toString());
    setInputH(rec.H.toString());
    setFoto(rec.foto || null);
    setActiveTab("calculator");
  };

  // Delete a history record
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    saveToLocalStorage(updated);
    setSelectedForDelete((prev) => prev.filter((item) => item !== id));
    if (selectedRecordId === id) {
      setSelectedRecordId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Modify compaction divisor
  const updateCompactionFactor = (val: number) => {
    const normalized = Math.max(0.1, val);
    setCompactionFactor(normalized);
    localStorage.setItem("medidorm3_factor", normalized.toString());
  };

  // Printable selected record calculation
  const getSelectedRecord = (): CubicajeRecord => {
    if (selectedRecordId) {
      const found = history.find((r) => r.id === selectedRecordId);
      if (found) return found;
    }

    // Default to a virtual unsaved record based on live inputs if history is empty
    return {
      id: "LIVE",
      placa: placa.trim().toUpperCase() || "REPORTE TEMPORAL",
      cubicador: cubicador.trim(),
      chofer: chofer.trim(),
      empresa: empresa.trim(),
      empresaTransporte: empresaTransporte.trim(),
      proyecto: proyecto.trim(),
      fecha: new Date().toISOString(),
      A: valA,
      B: valB,
      C: valC,
      volTolva,
      tablaB: valTablaB,
      tablaD: valTablaD,
      tablaE: valTablaE,
      volTabla,
      bPlus: valBPlus,
      bMinus: valBMinus,
      H: valH,
      volBotella,
      sumaTotal,
      volNeto,
      foto: foto || undefined,
    };
  };

  const selectedRecord = getSelectedRecord();

  // Print triggering
  const handlePrint = () => {
    window.print();
  };

  // Share triggering - Generates high-definition PDF using jsPDF vectors (extremely robust, works 100% inside sandboxed containers & iframes)
  const handleShare = async () => {
    const defaultPlaca = selectedRecord.placa || "SIN PLACA";
    const cleanPlaca = defaultPlaca.trim().toUpperCase().replace(/[^A-Z0-9-]/gi, "_");
    const dateStr = new Date(selectedRecord.fecha).toISOString().slice(0, 10);
    const filename = `Reporte_Cubicaje_${cleanPlaca}_${dateStr}.pdf`;

    setIsSharing(true);

    try {
      // Preload the image to obtain real dimensions and preserve aspect ratio
      let imgWidth = 0;
      let imgHeight = 0;
      let loadedImg: HTMLImageElement | null = null;
      if (selectedRecord.foto) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            imgWidth = img.width;
            imgHeight = img.height;
            loadedImg = img;
            resolve(null);
          };
          img.onerror = () => {
            resolve(null);
          };
          img.src = selectedRecord.foto;
        });
      }

      // Create a high-quality, pure-vector PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Color Palette definition
      const primaryColor = { r: 31, g: 41, b: 66 };    // Slate (#1f2942)
      const secondaryColor = { r: 16, g: 185, b: 129 }; // Emerald/Green (#10b981)
      const warningColor = { r: 245, g: 158, b: 11 };   // Amber text (#f59e0b)
      const neutralDark = { r: 33, g: 37, b: 41 };     // Dark Charcoal (#212529)
      const neutralLight = { r: 248, g: 249, b: 250 }; // Soft Offwhite (#f8f9fa)
      const mutedText = { r: 108, g: 117, b: 125 };    // Gray text (#6c757d)

      const startX = 15;
      let currentY = 15;

      // 1. Header Band
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.rect(0, 0, 210, 42, "F");

      // Header Text inside background
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("REPORTE OFICIAL DE CUBICAJE", startX, 16);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("LOGICUBIC - CUBICADOR DE CAMIONES Y TOLVAS", startX, 22);
      doc.text("SISTEMA DE PRECISIÓN DE CUBICADO DE TOLVAS", startX, 26);

      // Metadata right side
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PATENTE / PLACA:", 140, 16);
      doc.setFontSize(14);
      doc.setTextColor(252, 196, 25); // Yellow/Gold
      doc.text(defaultPlaca, 140, 22);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      const formattedDate = new Date(selectedRecord.fecha).toLocaleDateString() + " " + new Date(selectedRecord.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      doc.text(`Fecha: ${formattedDate}`, 140, 28);
      doc.text(`ID Registro: ${selectedRecord.id.slice(0, 8).toUpperCase()}`, 140, 32);

      // Reset text color to neutral dark
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      currentY = 46;

      // Personnel meta box inside PDF
      doc.setFillColor(neutralLight.r, neutralLight.g, neutralLight.b);
      doc.setDrawColor(210, 214, 219);
      doc.rect(startX, currentY, 180, 24, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
      doc.text("CUBICADOR:", startX + 4, currentY + 6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      doc.text(selectedRecord.cubicador || "Admin / Oficial", startX + 44, currentY + 6);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
      doc.text("CHOFER / TRANSPORTISTA:", startX + 95, currentY + 6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      doc.text(selectedRecord.chofer || "Sin registro", startX + 134, currentY + 6);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
      doc.text("EMPRESA / MANDANTE:", startX + 4, currentY + 12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      doc.text(selectedRecord.empresa || "Sin registro", startX + 44, currentY + 12);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
      doc.text("EMPRESA DE TRANSPORTE:", startX + 95, currentY + 12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      doc.text(selectedRecord.empresaTransporte || "Sin registro", startX + 134, currentY + 12);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
      doc.text("PROYECTO / OBRA:", startX + 4, currentY + 18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      doc.text(selectedRecord.proyecto || "Sin registro", startX + 44, currentY + 18);

      currentY = 75;

      // 1. Section: ESPECIFICACIONES TÉCNICAS RECOLECTADAS
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("1. ESPECIFICACIONES TÉCNICAS RECOLECTADAS", startX, currentY);
      currentY += 4;
      doc.setDrawColor(200, 200, 200);
      doc.line(startX, currentY, 195, currentY);
      currentY += 6;

      // Draw three columns for Tolva, Tabla, Botella
      const colWidth = 55;
      const colHeight = 35;
      
      // Box 1: Tolva
      doc.setFillColor(neutralLight.r, neutralLight.g, neutralLight.b);
      doc.rect(startX, currentY, colWidth, colHeight, "F");
      doc.rect(startX, currentY, colWidth, colHeight, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("CONTENEDOR TOLVA", startX + 4, currentY + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`Largo (A): ${selectedRecord.A.toFixed(2)} m`, startX + 4, currentY + 14);
      doc.text(`Ancho (B): ${selectedRecord.B.toFixed(2)} m`, startX + 4, currentY + 20);
      doc.text(`Alto (C): ${selectedRecord.C.toFixed(2)} m`, startX + 4, currentY + 26);

      // Box 2: Tabla
      doc.setFillColor(neutralLight.r, neutralLight.g, neutralLight.b);
      doc.rect(startX + colWidth + 5, currentY, colWidth, colHeight, "F");
      doc.rect(startX + colWidth + 5, currentY, colWidth, colHeight, "S");
      doc.setFont("helvetica", "bold");
      doc.text("TABLA EXPANSORA", startX + colWidth + 9, currentY + 6);
      doc.setFont("helvetica", "normal");
      doc.text(`Ancho (B): ${selectedRecord.tablaB.toFixed(2)} m`, startX + colWidth + 9, currentY + 14);
      doc.text(`Largo (D): ${selectedRecord.tablaD.toFixed(2)} m`, startX + colWidth + 9, currentY + 20);
      doc.text(`Espesor (E): ${selectedRecord.tablaE.toFixed(2)} m`, startX + colWidth + 9, currentY + 26);

      // Box 3: Botella
      doc.setFillColor(neutralLight.r, neutralLight.g, neutralLight.b);
      doc.rect(startX + (colWidth * 2) + 10, currentY, colWidth, colHeight, "F");
      doc.rect(startX + (colWidth * 2) + 10, currentY, colWidth, colHeight, "S");
      doc.setFont("helvetica", "bold");
      doc.text("BOTELLA HIDRÁULICA", startX + (colWidth * 2) + 14, currentY + 6);
      doc.setFont("helvetica", "normal");
      doc.text(`B. Máxima (B⁺): ${selectedRecord.bPlus.toFixed(2)} m`, startX + (colWidth * 2) + 14, currentY + 14);
      doc.text(`B. Mínima (B⁻): ${selectedRecord.bMinus.toFixed(2)} m`, startX + (colWidth * 2) + 14, currentY + 20);
      doc.text(`Altura (H): ${selectedRecord.H.toFixed(2)} m`, startX + (colWidth * 2) + 14, currentY + 26);

      currentY += colHeight + 8;

      // 2. Section: DESGLOSE DEL VOLUMEN CALCULADO
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("2. DESGLOSE DEL VOLUMEN CALCULADO", startX, currentY);
      currentY += 4;
      doc.setDrawColor(200, 200, 200);
      doc.line(startX, currentY, 195, currentY);
      currentY += 6;

      // Draw Table of Results
      const tableX = startX;
      const tableWidth = 180;
      const rowHeight = 8;

      // Table Header Row
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.rect(tableX, currentY, tableWidth, rowHeight + 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("CONCEPTO / CLASIFICACIÓN TÉCNICA", tableX + 3, currentY + 5.5);
      doc.text("VOLUMEN RESULTANTE", tableX + tableWidth - 45, currentY + 5.5);

      currentY += rowHeight + 1;

      // Data Rows
      const rows = [
        { name: "Volumen Parcial Tolva (Largo A × Ancho B × Alto C)", val: `${selectedRecord.volTolva.toFixed(2)} m³`, isSpecial: false, isNeg: false, isNet: false },
        { name: "Volumen Adicional Tabla de Expansión (B × D × E)", val: `${selectedRecord.volTabla.toFixed(2)} m³`, isSpecial: false, isNeg: false, isNet: false },
        { name: "Volumen Descontable Botella Hidráulica - ((B⁺+B⁻)/2) × H", val: `-${selectedRecord.volBotella.toFixed(2)} m³`, isSpecial: false, isNeg: true, isNet: false },
        { name: "Suma Bruta Parcial", val: `${selectedRecord.sumaTotal.toFixed(2)} m³`, isSpecial: true, isNeg: false, isNet: false },
        { name: "VOLUMEN NETO FINAL (CUBICAJE)", val: `${selectedRecord.volNeto.toFixed(2)} m³`, isSpecial: true, isNeg: false, isNet: true }
      ];

      doc.setFontSize(8.5);
      rows.forEach((row) => {
        if (row.isNet) {
          // Highlight Neto Final Green
          doc.setFillColor(235, 247, 242);
          doc.rect(tableX, currentY, tableWidth, rowHeight + 2, "F");
          doc.setDrawColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
          doc.line(tableX, currentY, tableX + tableWidth, currentY);
          doc.line(tableX, currentY + rowHeight + 2, tableX + tableWidth, currentY + rowHeight + 2);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
          doc.text(row.name, tableX + 3, currentY + 6);
          doc.setFontSize(10.5);
          doc.text(row.val, tableX + tableWidth - 35, currentY + 6);
          currentY += rowHeight + 3;
        } else if (row.isSpecial) {
          // Summary row grey
          doc.setFillColor(243, 244, 246);
          doc.rect(tableX, currentY, tableWidth, rowHeight, "F");
          doc.setFont("helvetica", "bold");
          doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
          doc.text(row.name, tableX + 3, currentY + 5);
          doc.text(row.val, tableX + tableWidth - 35, currentY + 5);
          currentY += rowHeight;
        } else {
          // Normal Row
          doc.setDrawColor(240, 240, 240);
          doc.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
          doc.text(row.name, tableX + 3, currentY + 5);
          
          if (row.isNeg) {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(warningColor.r, warningColor.g, warningColor.b);
          } else {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
          }
          if (row.val) {
            doc.text(row.val, tableX + tableWidth - 35, currentY + 5);
          }
          currentY += rowHeight;
        }
      });

      // Add generous spacing after the table to prevent overlap with Section 2
      currentY += 10;

       // 3. Section: REGISTRO FOTOGRÁFICO DE EVIDENCIA (foto)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(neutralDark.r, neutralDark.g, neutralDark.b);
      doc.text("3. REGISTRO FOTOGRÁFICO DE EVIDENCIA", startX, currentY);
      currentY += 3.5;
      doc.setDrawColor(200, 200, 200);
      doc.line(startX, currentY, 195, currentY);
      currentY += 5;

      const evidenceY = currentY;
      const cardW = 180; // matches full page width perfectly
      const cardH = 65;  // spacious and clear
      const photoX = startX; // matches left alignment exactly

      doc.setFillColor(neutralLight.r, neutralLight.g, neutralLight.b);
      doc.rect(photoX, evidenceY, cardW, cardH, "FD");
      doc.setDrawColor(210, 214, 219);
      doc.rect(photoX, evidenceY, cardW, cardH, "S");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text("FOTO DE EVIDENCIA DE CARGA", photoX + 6, evidenceY + 6);

      if (selectedRecord.foto) {
        try {
          const maxW = cardW - 12; // 168 mm available width
          const maxH = cardH - 14; // 51 mm available height
          let imgDataUrl = selectedRecord.foto;

          if (loadedImg && imgWidth > 0 && imgHeight > 0) {
            // Perform programmatic centering and cropping (object-cover) inside an offscreen canvas
            const canvas = document.createElement("canvas");
            const targetRatio = maxW / maxH;
            const sourceRatio = imgWidth / imgHeight;

            let sX = 0;
            let sY = 0;
            let sW = imgWidth;
            let sH = imgHeight;

            if (sourceRatio > targetRatio) {
              // Source is wider than target frame - crop sides
              sW = imgHeight * targetRatio;
              sX = (imgWidth - sW) / 2;
            } else {
              // Source is taller/narrower than target frame - crop top/bottom
              sH = imgWidth / targetRatio;
              sY = (imgHeight - sH) / 2;
            }

            // Ensure very high resolution representation for crisp printing
            canvas.width = 1200;
            canvas.height = Math.round(1200 / targetRatio);

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(loadedImg, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height);
              imgDataUrl = canvas.toDataURL("image/jpeg", 0.95);
            }
          }

          // Render pre-cropped high-res JPEG filling the frame exactly, mirroring object-cover behavior
          doc.addImage(imgDataUrl, "JPEG", photoX + 6, evidenceY + 9, maxW, maxH);
        } catch (e) {
          console.error("PDF photo embed error:", e);
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8.5);
          doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
          doc.text("[Foto omitida o de formato incompatible]", photoX + 6, evidenceY + 22);
        }
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
        doc.text("Sin captura fotográfica", photoX + 6, evidenceY + 22);
        doc.text("No se adjuntó foto de la tolva en terreno", photoX + 6, evidenceY + 29);
      }

      // Footer disclaimer bottom
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(mutedText.r, mutedText.g, mutedText.b);
      doc.text("La medida especificada corresponde al volumen calculado mediante fórmulas de cubicación en base a las dimensiones ingresadas.", 20, 280);
      doc.text("© LogiCubic - Software de Cubicaje de Precisión. Todos los derechos reservados.", 52, 284);

      // Output to Blob
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf"
      });

      let shareTriggered = false;

      // Try native platform sharing (especially incredible on Android & iOS for direct WhatsApp / Telegram sharing!)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [pdfFile] })
      ) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: `Cubicaje Placa ${defaultPlaca}`,
            text: `Reporte oficial de cubicaje de tolva para el camión patente ${defaultPlaca}.`
          });
          shareTriggered = true;
          setShareNotificationMessage("¡Reporte PDF compartido con éxito!");
          setShowShareNotification(true);
          setTimeout(() => setShowShareNotification(false), 3000);
        } catch (shareErr: any) {
          // If aborted by user, we shouldn't necessarily download, but let's check if it's a real block or abort
          console.log("Native share cancelled or failed:", shareErr);
          if (shareErr?.name === "AbortError" || shareErr?.message?.includes("abort")) {
            // User manually cancelled the system dialog, don't download, just exit
            shareTriggered = true; 
          }
        }
      }

      // Fallback: If native sharing wasn't active or failed, we download the beautiful PDF directly!
      if (!shareTriggered) {
        doc.save(filename);
        setShareNotificationMessage("¡Reporte PDF descargado con éxito!");
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 3500);
      }
    } catch (err) {
      console.error("Error creating or sharing PDF:", err);
      
      // Secondary fallback: Copy text summary to clipboard
      try {
        const textSummary = `📋 *LOGICUBIC - CUBICADOR*\nPlaca: ${defaultPlaca}\nVolumen Neto: ${selectedRecord.volNeto.toFixed(2)} m³\nFecha: ${new Date(selectedRecord.fecha).toLocaleString()}`;
        await navigator.clipboard.writeText(textSummary);
        setShareNotificationMessage("¡Ocurrió un inconveniente, resumen copiado al portapapeles!");
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 3500);
      } catch (clipboardErr) {
        alert("No se pudo generar el PDF ni copiar la información.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Filter history records
  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.placa.toLowerCase().includes(term) ||
      (item.cubicador || "").toLowerCase().includes(term) ||
      (item.chofer || "").toLowerCase().includes(term) ||
      (item.empresa || "").toLowerCase().includes(term) ||
      (item.empresaTransporte || "").toLowerCase().includes(term) ||
      (item.proyecto || "").toLowerCase().includes(term)
    );
  });

  // Handle select/unselect all for quick deletion
  const isAllFilteredSelected = filteredHistory.length > 0 && 
    filteredHistory.every((rec) => selectedForDelete.includes(rec.id));

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Unselect all filtered items
      const filteredIds = filteredHistory.map((rec) => rec.id);
      setSelectedForDelete((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered items
      const filteredIds = filteredHistory.map((rec) => rec.id);
      setSelectedForDelete((prev) => {
        const union = new Set([...prev, ...filteredIds]);
        return Array.from(union);
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedForDelete.length === 0) return;
    if (confirm(`¿Estás seguro de que deseas borrar los ${selectedForDelete.length} registros seleccionados? Esta acción no se puede deshacer.`)) {
      const updated = history.filter((item) => !selectedForDelete.includes(item.id));
      saveToLocalStorage(updated);
      setSelectedForDelete([]);
      if (selectedRecordId && selectedForDelete.includes(selectedRecordId)) {
        setSelectedRecordId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  // Calculate live average aggregates to look super professional!
  const totalVolumeCubicated = history.reduce((acc, rec) => acc + rec.volNeto, 0);
  const totalTrucksMeasured = history.length;
  const averageVolume = totalTrucksMeasured > 0 ? totalVolumeCubicated / totalTrucksMeasured : 0;

  // Find duplicate plates in local history that can be corrected
  const duplicatePlatesInfo = React.useMemo(() => {
    const counts: { [placa: string]: CubicajeRecord[] } = {};
    history.forEach((rec) => {
      const p = (rec.placa || "").trim().toUpperCase();
      if (p) {
        if (!counts[p]) {
          counts[p] = [];
        }
        counts[p].push(rec);
      }
    });

    return Object.entries(counts)
      .filter(([_, list]) => list.length > 1)
      .map(([placa, list]) => ({ placa, list }));
  }, [history]);

  const hasDuplicatePlates = duplicatePlatesInfo.length > 0;

  // Helper renderer for numeric inputs with handy increment adjusters
  const renderNumericField = (
    label: string,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldId: string,
    step: number = 0.05
  ) => {
    const isLight = resolvedTheme === "light";
    return (
      <div className="space-y-1">
        <label className={`block text-[11px] font-semibold ${isLight ? "text-slate-500" : "text-gray-400"} tracking-wider uppercase`}>
          {label}
        </label>
        <div className={`relative group/field rounded-lg border ${
          isLight
            ? "border-slate-300 bg-slate-50 focus-within:border-[#d9a300]"
            : "border-gray-700 bg-[#111827] focus-within:border-[#fcc419]"
        } transition`}>
          <input
            type="number"
            value={value}
            onChange={(e) => setter(e.target.value)}
            onFocus={() => setActiveInput(fieldId)}
            onBlur={() => setActiveInput(null)}
            step="0.01"
            className={`w-full bg-transparent px-3 py-2 text-center font-bold ${isLight ? "text-slate-900" : "text-white"} tracking-wide text-sm focus:outline-none`}
            placeholder="0.00"
            id={`input_${fieldId}`}
          />
        </div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${resolvedTheme === "light" ? "bg-slate-50 text-slate-800" : "bg-[#141b2d] text-gray-100"}`} id="auth-loading">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 animate-spin text-[#fcc419]" id="auth-loading-spinner" />
          <p className="text-sm font-bold tracking-widest uppercase animate-pulse">Cargando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!currentUser && !bypassAuth) {
    const isLight = resolvedTheme === "light";
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isLight ? "bg-slate-100 text-slate-800" : "bg-[#0b0f19] text-gray-100"} relative`} id="auth-screen-container" style={{
        backgroundImage: isLight 
          ? "radial-gradient(circle at 10% 20%, rgba(217,163,0,0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(59,130,246,0.05) 0%, transparent 40%)"
          : "radial-gradient(circle at 10% 20%, rgba(217,163,0,0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(59,130,246,0.1) 0%, transparent 40%)"
      }}>
        {/* Floating Language Bar */}
        <div className="w-full max-w-md flex justify-end mb-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as LanguageCode)}
            className={`text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer border ${
              isLight 
                ? "bg-white border-slate-300 text-slate-800 hover:bg-slate-50" 
                : "bg-[#1f2942] border-gray-800 text-gray-300 hover:bg-[#273454]"
            }`}
          >
            <option value="es">Español (ES)</option>
            <option value="en">English (EN)</option>
            <option value="pt">Português (PT)</option>
          </select>
        </div>

        {/* Elegant Login Card */}
        <div className={`w-full max-w-md ${isLight ? "bg-white border-slate-200" : "bg-[#141b2d] border-slate-800/80"} rounded-2xl p-6 md:p-8 border shadow-2xl space-y-6 text-center transition-all duration-300`}>
          
          <div className="flex flex-col items-center gap-2">
            <AppIcon size={64} className="rounded-2xl shadow-xl border border-slate-400/10 mb-2" id="auth-logo" />
            <h2 className="text-2xl font-black tracking-wide text-[#d9a300] dark:text-[#fcc419] uppercase leading-none">
              {isRecoveringPassword
                ? (lang === "es" ? "Recuperar Contraseña" : lang === "en" ? "Reset Password" : "Recuperar Senha")
                : isRegistering 
                  ? (lang === "es" ? "Registrarse" : lang === "en" ? "Create Account" : "Registrar-se")
                  : (lang === "es" ? "Iniciar Sesión" : lang === "en" ? "Sign In" : "Entrar")
              }
            </h2>
            <p className={`text-xs font-semibold tracking-wider ${isLight ? "text-slate-500" : "text-gray-400"} mt-1 uppercase`}>
              {lang === "es" ? "Cubicación Volumétrica LogiCubic" : lang === "en" ? "LogiCubic Volumetric Calculator" : "Cubicagem Volumétrica LogiCubic"}
            </p>
          </div>

          {isRecoveringPassword ? (
            <form onSubmit={handlePasswordReset} className="space-y-4 text-left">
              <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                {lang === "es" 
                  ? "Ingresa tu correo electrónico registrado y te enviaremos un enlace seguro. Al hacer clic en este enlace seguro, podrás definir una nueva contraseña de inmediato y usarla para ingresar a la aplicación." 
                  : lang === "en" 
                    ? "Enter your registered email and we will send you a secure link. By clicking this link, you can immediately set a new password and use it to log into the application." 
                    : "Digite seu e-mail registrado e enviaremos um link seguro. Ao clicar neste link, você poderá definir uma nova senha imediatamente e usá-la para acessar o aplicativo."}
              </p>

              {/* Email Input */}
              <div>
                <label className={`block text-xs font-bold tracking-widest uppercase mb-1.5 ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                  {lang === "es" ? "Correo Electrónico" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="operador@cubicador.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-medium border focus:outline-none transition-all ${
                    isLight 
                      ? "bg-slate-50 border-slate-300 text-slate-800 focus:bg-white focus:border-amber-500" 
                      : "bg-[#111827] border-gray-700 text-white focus:bg-slate-950 focus:border-[#fcc419]"
                  }`}
                />
              </div>

              {/* Success Message Box */}
              {passwordResetSent && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg p-3 flex gap-2 items-start" id="auth-success-box">
                  <Check className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <span className="font-semibold leading-tight">
                    {lang === "es" 
                      ? "¡Enlace enviado con éxito! Hemos enviado las instrucciones de recuperación a tu correo. Por favor, revisa tu cuenta de Gmail (o correo registrado), incluyendo las carpetas de Spam, Correo No Deseado o Promociones." 
                      : lang === "en" 
                        ? "Recovery link sent successfully! We have sent a password reset email to your address. Please check your Gmail (or registered inbox), including the Spam, Junk, or Promotions folders." 
                        : "Link de recuperação enviado com sucesso! Verifique sua conta do Gmail ou e-mail registrado, incluindo a pasta de Spam."}
                  </span>
                </div>
              )}

              {/* Error Message Box */}
              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 flex gap-2 items-start" id="auth-error-box">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-tight">{authError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authInProgress}
                className={`w-full text-white font-black text-sm uppercase tracking-widest py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition ${
                  authInProgress 
                    ? "bg-amber-600/70" 
                    : "bg-amber-50 hover:bg-amber-600 active:bg-amber-700 active:scale-[0.98]"
                }`}
                id="submit-auth-btn"
              >
                {authInProgress && <RefreshCw className="w-4 h-4 animate-spin" />}
                {lang === "es" ? "Enviar Enlace de Recuperación" : lang === "en" ? "Send Recovery Link" : "Enviar Link de Recuperação"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
              {/* Email Input */}
              <div>
                <label className={`block text-xs font-bold tracking-widest uppercase mb-1.5 ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                  {lang === "es" ? "Correo Electrónico" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="operador@cubicador.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-medium border focus:outline-none transition-all ${
                    isLight 
                      ? "bg-slate-50 border-slate-300 text-slate-800 focus:bg-white focus:border-amber-500" 
                      : "bg-[#111827] border-gray-700 text-white focus:bg-slate-950 focus:border-[#fcc419]"
                  }`}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-xs font-bold tracking-widest uppercase mb-1.5 ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                  {lang === "es" ? "Contraseña" : "Password"}
                </label>
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-medium border focus:outline-none transition-all ${
                    isLight 
                      ? "bg-slate-50 border-slate-300 text-slate-800 focus:bg-white focus:border-amber-500" 
                      : "bg-[#111827] border-gray-700 text-white focus:bg-slate-950 focus:border-[#fcc419]"
                  }`}
                />
                {isRegistering && (
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    * {lang === "es" ? "Mínimo 6 caracteres" : "Minimum 6 characters"}
                  </span>
                )}
              </div>

              {/* Error Message Box */}
              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 flex gap-2 items-start" id="auth-error-box">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-tight">{authError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authInProgress}
                className={`w-full text-white font-black text-sm uppercase tracking-widest py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition ${
                  authInProgress 
                    ? "bg-amber-600/70" 
                    : "bg-amber-50 hover:bg-amber-600 active:bg-amber-700 active:scale-[0.98]"
                }`}
                id="submit-auth-btn"
              >
                {authInProgress && <RefreshCw className="w-4 h-4 animate-spin" />}
                {isRegistering 
                  ? (lang === "es" ? "Registrarse" : lang === "en" ? "Register" : "Cadastrar")
                  : (lang === "es" ? "Iniciar Sesión" : lang === "en" ? "Sign In" : "Entrar")
                }
              </button>
            </form>
          )}

          {/* Setup Instructions Info */}
          <div className={`p-3.5 rounded-xl border text-[11px] text-left leading-relaxed ${
            isLight ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-[#1f2942]/60 border-gray-800 text-gray-300"
          }`}>
            <span className="font-bold flex items-center gap-1.5 uppercase tracking-wide mb-1 text-xs">
              🔒 LogiCubic Cloud Sync
            </span>
            {lang === "es" 
              ? "Al iniciar sesión, tus cubicaciones se guardarán de forma totalmente automática en la nube bajo tu dirección de correo electrónico, permitiéndote reconstruir y descargar reportes históricos desde cualquier dispositivo."
              : "By signing in, your volumetric calculations are automatically synchronized in the secure cloud, enabling you to inspect, filter, and print details from any authorized device."
            }
          </div>

          <div className="flex flex-col gap-3 pt-2 text-xs">
            {/* Toggle Sign Up/Sign In or Go Back */}
            {isRecoveringPassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsRecoveringPassword(false);
                  setAuthError(null);
                  setPasswordResetSent(false);
                }}
                className="text-amber-500 hover:text-amber-600 font-bold focus:outline-none transition cursor-pointer"
                id="back-to-login-btn"
              >
                {lang === "es" ? "← Volver al Inicio de Sesión" : lang === "en" ? "← Back to Sign In" : "← Voltar ao login"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthError(null);
                }}
                className="text-amber-500 hover:text-amber-600 font-bold focus:outline-none transition cursor-pointer"
                id="toggle-auth-type-btn"
              >
                {isRegistering 
                  ? (lang === "es" ? "¿Ya tienes una cuenta? Iniciar Sesión" : lang === "en" ? "Already have an account? Sign In" : "Já tem conta? Entrar")
                  : (lang === "es" ? "¿No tienes cuenta? Registrate con tu correo" : lang === "en" ? "New here? Create an Account" : "Não tem conta? Cadastre-se")
                }
              </button>
            )}

            {/* Forgot Password Link */}
            {!isRegistering && !isRecoveringPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsRecoveringPassword(true);
                  setAuthError(null);
                  setPasswordResetSent(false);
                }}
                className={`text-xs hover:underline cursor-pointer font-bold ${isLight ? "text-slate-500 hover:text-slate-800" : "text-gray-400 hover:text-gray-100"}`}
                id="forgot-password-btn"
              >
                {lang === "es" ? "¿Olvidaste tu contraseña?" : lang === "en" ? "Forgot your password?" : "Esqueceu sua senha?"}
              </button>
            )}

            {/* Separator */}
            <div className={`flex items-center gap-2 my-1 ${isLight ? "text-slate-350" : "text-gray-700"}`}>
              <div className="h-px flex-grow bg-current"></div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">o</span>
              <div className="h-px flex-grow bg-current"></div>
            </div>

            {/* Offline/Guest Bypass button */}
            <button
              type="button"
              onClick={() => {
                setBypassAuth(true);
                setAuthError(null);
              }}
              className="text-gray-450 hover:text-gray-300 hover:underline focus:outline-none transition cursor-pointer font-semibold uppercase tracking-widest text-[10px]"
              id="guest-bypass-btn"
            >
              🚫 {lang === "es" ? "Continuar como Invitado (Sin Nube)" : lang === "en" ? "Continue as Guest (Offline Only)" : "Modo Visitante (Sem Nuvem)"}
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${resolvedTheme === "light" ? "text-slate-800 bg-slate-50" : "text-gray-100 bg-[#141b2d]"} flex flex-col justify-between`} id="medidor-app-root">
      
      {/* 1. APP HEADER DESIGNED WITH INTENTIONAL DAY/NIGHT PAIRINGS */}
      <header className={`p-4 border-b ${resolvedTheme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#1f2942]/60 border-gray-800/50"} text-center no-print relative`} id="app-header">
        <div className="flex justify-center items-center gap-3">
          <AppIcon size={48} className="rounded-xl shadow-lg border border-slate-400/20" id="header-presentation-icon" />
          <div className="text-left">
            <h1 className="text-xl font-extrabold tracking-wider text-[#d9a300] dark:text-[#fcc419] uppercase leading-none">
              {t("app_title")}
            </h1>
            <p className={`text-[10px] ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} font-semibold tracking-widest mt-1`}>
              {t("app_subtitle")}
            </p>
          </div>
        </div>

        {/* Quick Theme Toggle button in the Header to adjust contrast under direct lookup */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          <button
            onClick={() => {
              if (themeMode === "dark") setThemeMode("light");
              else if (themeMode === "light") setThemeMode("system");
              else setThemeMode("dark");
            }}
            type="button"
            className={`p-2 rounded-lg border transition cursor-pointer flex items-center justify-center ${
              resolvedTheme === "light"
                ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-sm"
                : "bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-[#fcc419]"
            }`}
            title="Ajustar Contraste / Legibilidad en Terreno"
            id="btn-header-theme-toggle"
          >
            {themeMode === "dark" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            {themeMode === "light" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m12-9h-2.25M5.25 12H3m14.03-7.03L15.3 6.72m-8.58 8.58l-1.72 1.72M18 18l-1.72-1.72M6.72 6.72L5 5m7 2.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5z" />
              </svg>
            )}
            {themeMode === "system" && (
              <div className="flex items-center gap-1.5 font-sans">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
                <span className="text-[7px] uppercase font-black tracking-tighter leading-none">Auto</span>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* 2. LIVE NOTIFICATION ALERT (Saves list indicator) */}
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-50 bg-[#fcc419] text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 justify-center no-print border border-amber-400"
            id="notification-alert"
          >
            <CheckCircle2 className="w-5 h-5 fill-slate-950 stroke-[#fcc419]" />
            <span className="text-xs tracking-wide">{t("saved_ok")}</span>
          </motion.div>
        )}
        {showShareNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 justify-center no-print border border-emerald-400"
            id="share-notification-alert"
          >
            <CheckCircle2 className="w-5 h-5 fill-slate-950 stroke-emerald-500" />
            <span className="text-xs tracking-wide">{shareNotificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-4xl w-full mx-auto px-4 py-5 flex-grow space-y-6 mb-20 no-print" id="workspace-container">
        
        {/* COLLAPSIBLE MATHEMATICAL GUIDE */}
        <div className={`${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942]/60 border-gray-800"} rounded-xl border p-3 shadow-sm`}>
          <button
            onClick={() => setShowFormulaGuide(!showFormulaGuide)}
            className={`w-full flex justify-between items-center text-xs font-bold ${resolvedTheme === "light" ? "text-slate-700 hover:text-slate-950" : "text-gray-300 hover:text-white"} transition cursor-pointer`}
            id="btn-toggle-guide"
          >
            <span className="flex items-center gap-1.5">
              <Info className={`w-4 h-4 ${resolvedTheme === "light" ? "text-amber-600" : "text-[#fcc419]"}`} />
              {t("formula_guide")}
            </span>
            <span className={`text-xs ${resolvedTheme === "light" ? "text-amber-600" : "text-[#fcc419]"} font-semibold`}>
              {showFormulaGuide ? t("hide_guide") : t("show_guide")}
            </span>
          </button>
          
          <AnimatePresence>
            {showFormulaGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`overflow-hidden text-[11px] ${resolvedTheme === "light" ? "text-slate-600 border-slate-100" : "text-gray-400 border-gray-800/60"} mt-2 space-y-2 pt-2 border-t leading-relaxed`}
                id="formula-guide-content"
              >
                <p>
                  <strong className={resolvedTheme === "light" ? "text-slate-800" : "text-gray-300"}>{t("dimensions_tolva")}:</strong> {FORMULA_HELP.tolva}
                </p>
                <p>
                  <strong className={resolvedTheme === "light" ? "text-slate-800" : "text-gray-300"}>{t("volumen_tabla")}:</strong> {FORMULA_HELP.tabla}
                </p>
                <p>
                  <strong className={resolvedTheme === "light" ? "text-slate-800" : "text-gray-300"}>{t("volumen_botella")}:</strong> {FORMULA_HELP.botella}
                </p>
                <p className={`p-2 rounded border ${resolvedTheme === "light" ? "bg-amber-50/50 border-amber-200 text-amber-800" : "bg-[#111827] border-gray-800 text-[#fcc419]"}`}>
                  <strong className={resolvedTheme === "light" ? "text-amber-700" : "text-[#fcc419]"}>{t("net_volume")}:</strong> {FORMULA_HELP.neto}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ----------------- TAB 1: CUBICADOR ----------------- */}
        {activeTab === "calculator" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="view-calculator">
            
            {/* Input fields left column */}
            <div className="space-y-4">
              
              {/* 1. Identification Section */}
              <section className={`${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942] border-gray-700/50"} p-4 rounded-xl border shadow-md transition-colors duration-250`}>
                <div className={`flex items-center space-x-2 ${resolvedTheme === "light" ? "text-amber-700" : "text-[#fcc419]"} mb-3`}>
                  <span className={`${resolvedTheme === "light" ? "bg-slate-100" : "bg-[#111827]"} p-1 rounded`}>
                    <Calculator className="w-4 h-4" />
                  </span>
                  <h2 className="font-bold text-sm tracking-wide">{t("identification")}</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-[10px] font-semibold ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} tracking-wider mb-1 uppercase`}>
                      {t("placa")}
                    </label>
                    <input
                      type="text"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value)}
                      placeholder={t("placa_placeholder")}
                      className={`w-full ${
                        resolvedTheme === "light"
                          ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#d9a300]"
                          : "bg-[#111827] border-gray-700 text-white focus:border-[#fcc419]"
                      } border rounded-lg p-2.5 text-center font-extrabold tracking-widest uppercase focus:outline-none text-base`}
                      id="inputPlaca"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-[10px] font-semibold ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} tracking-wider mb-1 uppercase`}>
                        {t("cubicador")}
                      </label>
                      <input
                        type="text"
                        value={cubicador}
                        onChange={(e) => setCubicador(e.target.value)}
                        placeholder={t("cubicador_placeholder")}
                        className={`w-full ${
                          resolvedTheme === "light"
                            ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#d9a300]"
                            : "bg-[#111827] border-gray-700 text-white focus:border-[#fcc419]"
                        } border rounded-lg p-2 text-center font-bold focus:outline-none text-xs`}
                        id="inputCubicador"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-semibold ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} tracking-wider mb-1 uppercase`}>
                        {t("chofer")}
                      </label>
                      <input
                        type="text"
                        value={chofer}
                        onChange={(e) => setChofer(e.target.value)}
                        placeholder={t("chofer_placeholder")}
                        className={`w-full ${
                          resolvedTheme === "light"
                            ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#d9a300]"
                            : "bg-[#111827] border-gray-700 text-white focus:border-[#fcc419]"
                        } border rounded-lg p-2 text-center font-bold focus:outline-none text-xs`}
                        id="inputChofer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={`block text-[10px] font-semibold ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} tracking-wider mb-1 uppercase`}>
                        {t("empresa")}
                      </label>
                      <input
                        type="text"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        placeholder={t("empresa_placeholder")}
                        className={`w-full ${
                          resolvedTheme === "light"
                            ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#d9a300]"
                            : "bg-[#111827] border-gray-700 text-white focus:border-[#fcc419]"
                        } border rounded-lg p-2 text-center font-bold focus:outline-none text-xs`}
                        id="inputEmpresa"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-semibold ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} tracking-wider mb-1 uppercase`}>
                        {t("empresa_transporte")}
                      </label>
                      <input
                        type="text"
                        value={empresaTransporte}
                        onChange={(e) => setEmpresaTransporte(e.target.value)}
                        placeholder={t("empresa_transporte_placeholder")}
                        className={`w-full ${
                          resolvedTheme === "light"
                            ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#d9a300]"
                            : "bg-[#111827] border-gray-700 text-white focus:border-[#fcc419]"
                        } border rounded-lg p-2 text-center font-bold focus:outline-none text-xs`}
                        id="inputEmpresaTransporte"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-semibold ${resolvedTheme === "light" ? "text-slate-500" : "text-gray-400"} tracking-wider mb-1 uppercase`}>
                        {t("proyecto")}
                      </label>
                      <input
                        type="text"
                        value={proyecto}
                        onChange={(e) => setProyecto(e.target.value)}
                        placeholder={t("proyecto_placeholder")}
                        className={`w-full ${
                          resolvedTheme === "light"
                            ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#d9a300]"
                            : "bg-[#111827] border-gray-700 text-white focus:border-[#fcc419]"
                        } border rounded-lg p-2 text-center font-bold focus:outline-none text-xs`}
                        id="inputProyecto"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 1.5 Digital Field Evidence Panel */}
              <section className={`${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942] border-gray-700/50"} p-4 rounded-xl border shadow-md space-y-4`}>
                <div className="flex justify-between items-center">
                  <div className={`flex items-center space-x-2 ${resolvedTheme === "light" ? "text-amber-700" : "text-[#fcc419]"}`}>
                    <span className={`${resolvedTheme === "light" ? "bg-slate-100" : "bg-[#111827]"} p-1 rounded`}>
                      <Camera className="w-4 h-4" />
                    </span>
                    <h2 className="font-bold text-sm tracking-wide">REGISTRO FOTOGRÁFICO DE EVIDENCIA</h2>
                  </div>
                  <span className="text-[9px] bg-emerald-500/15 text-emerald-500 font-extrabold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-mono">
                    Activa
                  </span>
                </div>

                <div className="w-full">
                  <PhotoSelector
                    value={foto}
                    onChange={setFoto}
                    lang={lang}
                    photoTitle={lang === "es" ? "FOTOGRAFÍA CAMIÓN / TOLVA" : "TRUCK PHOTOGRAPH"}
                    photoPlaceholder={lang === "es" ? "Tomar o subir foto de la carga" : "Capture image"}
                  />
                </div>
              </section>

              {/* 2. Volumen Tolva */}
              <section className={`${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942] border-gray-700/50"} p-4 rounded-xl border shadow-md`}>
                <div className="flex justify-between items-center mb-3">
                  <div className={`flex items-center space-x-2 ${resolvedTheme === "light" ? "text-amber-700" : "text-[#fcc419]"}`}>
                    <span className={`${resolvedTheme === "light" ? "bg-slate-100" : "bg-[#111827]"} p-1 rounded`}>
                      <HopperIcon className="w-4 h-4" />
                    </span>
                    <h2 className="font-bold text-sm tracking-wide">{t("dimensions_tolva")}</h2>
                  </div>
                  <span className={`text-[9px] ${resolvedTheme === "light" ? "text-slate-600 bg-slate-100 border-slate-200" : "text-gray-400 bg-black/30"} font-mono px-2 py-0.5 rounded border`}>
                    A × B × C
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {renderNumericField("A (" + t("largo") + ")", inputA, setInputA, "A", 0.05)}
                  {renderNumericField("B (" + t("ancho") + ")", inputB, setInputB, "B", 0.05)}
                  {renderNumericField("C (" + t("alto") + ")", inputC, setInputC, "C", 0.05)}
                </div>
              </section>

              {/* 3. Volumen Tabla */}
              <section className={`${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942] border-gray-700/50"} p-4 rounded-xl border shadow-md`}>
                <div className="flex justify-between items-center mb-3">
                  <div className={`flex items-center space-x-2 ${resolvedTheme === "light" ? "text-amber-700" : "text-[#fcc419]"}`}>
                    <span className={`${resolvedTheme === "light" ? "bg-slate-100" : "bg-[#111827]"} p-1 rounded`}>
                      <TablaIcon className="w-4 h-4" />
                    </span>
                    <h2 className="font-bold text-sm tracking-wide">{t("volumen_tabla")}</h2>
                  </div>
                  <span className={`text-[9px] ${resolvedTheme === "light" ? "text-slate-600 bg-slate-100 border-slate-200" : "text-gray-400 bg-black/30"} font-mono px-2 py-0.5 rounded border`}>
                    B × D × E
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {renderNumericField("B (" + t("ancho") + ")", inputTablaB, setInputTablaB, "tablaB", 0.05)}
                  {renderNumericField("D (" + t("largo") + ")", inputTablaD, setInputTablaD, "tablaD", 0.05)}
                  {renderNumericField("E (" + t("espesor") + ")", inputTablaE, setInputTablaE, "tablaE", 0.01)}
                </div>
              </section>

              {/* 4. Volumen Botella */}
              <section className={`${resolvedTheme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942] border-gray-700/50"} p-4 rounded-xl border shadow-md`}>
                <div className="flex justify-between items-center mb-3">
                  <div className={`flex items-center space-x-2 ${resolvedTheme === "light" ? "text-amber-700" : "text-[#fcc419]"}`}>
                    <span className={`${resolvedTheme === "light" ? "bg-slate-100" : "bg-[#111827]"} p-1 rounded`}>
                      <BotellaIcon className="w-4 h-4" />
                    </span>
                    <h2 className="font-bold text-sm tracking-wide">{t("volumen_botella")}</h2>
                  </div>
                  <span className={`text-[9px] ${resolvedTheme === "light" ? "text-slate-600 bg-slate-100 border-slate-200" : "text-gray-400 bg-black/30"} font-mono px-2 py-0.5 rounded border`}>
                    ((B⁺ + B⁻)/2) × H
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {renderNumericField("B⁺ (" + (lang === "es" ? "Máx." : lang === "en" ? "Max." : lang === "pt" ? "Máx." : lang === "fr" ? "Max." : lang === "de" ? "Max." : "Max.") + ")", inputBPlus, setInputBPlus, "bPlus", 0.05)}
                  {renderNumericField("B⁻ (" + (lang === "es" ? "Mín." : lang === "en" ? "Min." : lang === "pt" ? "Mín." : lang === "fr" ? "Min." : lang === "de" ? "Min." : "Min.") + ")", inputBMinus, setInputBMinus, "bMinus", 0.05)}
                  {renderNumericField("H (" + t("alto") + ")", inputH, setInputH, "H", 0.05)}
                </div>
              </section>

              {/* Clear & Save trigger row */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className={`w-full ${
                    resolvedTheme === "light"
                      ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      : "bg-slate-700/80 hover:bg-slate-600/80 text-white"
                  } font-bold py-3 px-4 rounded-xl transition duration-150 shadow-md flex justify-center items-center space-x-2 text-xs uppercase tracking-wider cursor-pointer`}
                  id="btn-clear"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>{t("clear_btn")}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full bg-[#fcc419] hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl transition duration-150 shadow-md flex justify-center items-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
                  id="btn-save"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t("save_btn")}</span>
                </button>
              </div>

            </div>

            {/* Calculations & Visualization - Right column */}
            <div className="space-y-4">
              
              {/* Interactive Vector diagram of truck measurements */}
              <TruckVisualizer
                A={valA}
                B={valB}
                C={valC}
                tablaB={valTablaB}
                tablaD={valTablaD}
                tablaE={valTablaE}
                bPlus={valBPlus}
                bMinus={valBMinus}
                H={valH}
                activeInput={activeInput}
                theme={resolvedTheme}
              />

              {/* Aggregated Real-time Estimation Output Box */}
              <section className={`${
                resolvedTheme === 'light'
                  ? 'bg-amber-50/10 border-2 border-amber-500/60 text-slate-800'
                  : 'bg-slate-900 border-2 border-[#fcc419]'
                } p-5 rounded-xl shadow-xl space-y-4`}>
                <h3 className={`text-center font-bold ${resolvedTheme === 'light' ? 'text-slate-700' : 'text-gray-300'} tracking-widest text-[11px] uppercase`}>
                  {lang === "es" ? "Cálculo Automatizado M³" : lang === "en" ? "Automated M³ Calculation" : lang === "pt" ? "Cálculo Automatizado M³" : lang === "fr" ? "Calcul Automatique M³" : lang === "de" ? "Automatisierte M³-Berechnung" : "Calcolo Automatizzato M³"}
                </h3>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`${resolvedTheme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111827] border-gray-800'} p-2.5 rounded-lg border flex flex-col items-center justify-between`}>
                    <span className={`block text-[9px] ${resolvedTheme === 'light' ? 'text-slate-500 font-bold' : 'text-gray-400'} font-semibold mb-1`}>
                      {lang === "es" ? "V. TOLVA" : lang === "en" ? "V. HOPPER" : lang === "pt" ? "V. CAÇAMBA" : lang === "fr" ? "V. BENNE" : lang === "de" ? "V. MULDE" : "V. TRAMOGGIA"}
                    </span>
                    <HopperIcon className={`w-4 h-4 ${resolvedTheme === 'light' ? 'text-emerald-600' : 'text-emerald-400'} mb-1`} />
                    <span className={`text-sm font-black ${resolvedTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400'} font-mono`}>
                      {volTolva.toFixed(2)}
                    </span>
                  </div>
                  <div className={`${resolvedTheme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111827] border-gray-800'} p-2.5 rounded-lg border flex flex-col items-center justify-between`}>
                    <span className={`block text-[9px] ${resolvedTheme === 'light' ? 'text-slate-500 font-bold' : 'text-gray-400'} font-semibold mb-1`}>
                      {lang === "es" ? "V. TABLA" : lang === "en" ? "V. BOARD" : lang === "pt" ? "V. TÁBUA" : lang === "fr" ? "V. PLANCHE" : lang === "de" ? "V. BRETTER" : "V. TAVOLA"}
                    </span>
                    <TablaIcon className={`w-4 h-4 ${resolvedTheme === 'light' ? 'text-emerald-600' : 'text-emerald-400'} mb-1`} />
                    <span className={`text-sm font-black ${resolvedTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400'} font-mono`}>
                      {volTabla.toFixed(2)}
                    </span>
                  </div>
                  <div className={`${resolvedTheme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111827] border-gray-800'} p-2.5 rounded-lg border flex flex-col items-center justify-between`}>
                    <span className={`block text-[9px] ${resolvedTheme === 'light' ? 'text-slate-500 font-bold' : 'text-gray-400'} font-semibold mb-1`}>
                      {lang === "es" ? "V. BOTELLA" : lang === "en" ? "V. CYLINDER" : lang === "pt" ? "V. PISTÃO" : lang === "fr" ? "V. CYLINDRE" : lang === "de" ? "V. ZYLINDER" : "V. BOTTIGLIA"}
                    </span>
                    <BotellaIcon className={`w-4 h-4 ${resolvedTheme === 'light' ? 'text-amber-600 font-bold' : 'text-amber-500'} mb-1`} />
                    <span className={`text-sm font-black ${resolvedTheme === 'light' ? 'text-amber-700' : 'text-amber-500'} font-mono`}>
                      {volBotella.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={`border-t ${resolvedTheme === 'light' ? 'border-slate-200' : 'border-gray-800'} my-2`}></div>

                <div className={`flex justify-between items-center ${resolvedTheme === 'light' ? 'bg-white border-slate-200' : 'bg-[#111827] border-gray-800'} px-4 py-2.5 rounded-lg border`}>
                  <span className={`text-[10px] font-bold ${resolvedTheme === 'light' ? 'text-slate-500' : 'text-gray-400'} uppercase`}>{t("suma_bruta_parcial")}:</span>
                  <span className={`text-sm font-black font-mono ${resolvedTheme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    {sumaTotal.toFixed(2)} m³
                  </span>
                </div>

                <div className={`flex justify-between items-center ${resolvedTheme === 'light' ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/40 border-emerald-500/20'} px-4 py-3 rounded-lg border shadow-inner`}>
                  <span className={`text-xs font-black ${resolvedTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400'} uppercase tracking-wide`}>
                    {t("net_volume")}:
                  </span>
                  <span className={`text-2xl font-black ${resolvedTheme === 'light' ? 'text-emerald-800' : 'text-emerald-400'} font-mono`}>
                    {volNeto.toFixed(2)} m³
                  </span>
                </div>
              </section>

            </div>

          </div>
        )}

        {/* ----------------- TAB 2: HISTORIAL ----------------- */}
        {activeTab === "history" && (
          <div className="space-y-4" id="view-history">
            
            {/* KPI statistics cards at top of history */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1f2942] p-3 rounded-lg border border-gray-800 text-center">
                <span className="text-[9px] text-gray-400 uppercase block font-semibold mb-1">
                  {lang === "es" ? "Cubicaje Total" : lang === "en" ? "Total Volume" : lang === "pt" ? "Cubagem Total" : lang === "fr" ? "Cubage Total" : lang === "de" ? "Gesamtkubierung" : "Cubatura Totale"}
                </span>
                <span className="text-lg font-black text-emerald-400 font-mono">{totalVolumeCubicated.toFixed(1)} m³</span>
              </div>
              <div className="bg-[#1f2942] p-3 rounded-lg border border-gray-800 text-center">
                <span className="text-[9px] text-gray-400 uppercase block font-semibold mb-1">
                  {lang === "es" ? "Camiones" : lang === "en" ? "Trucks" : lang === "pt" ? "Caminhões" : lang === "fr" ? "Camions" : lang === "de" ? "LKWs" : "Camion"}
                </span>
                <span className="text-lg font-black text-amber-400 font-mono">{totalTrucksMeasured}</span>
              </div>
              {hasDuplicatePlates ? (
                <button
                  onClick={() => setShowDuplicatesCorrector(true)}
                  className="bg-red-950/40 hover:bg-red-900/45 p-2 rounded-lg border border-red-500/40 text-center cursor-pointer transition active:scale-95 flex flex-col justify-center items-center h-full w-full min-h-[64px]"
                  title={lang === "es" ? "Click para ver y corregir placas duplicadas" : "Click to view and correct duplicate plates"}
                  id="kpi-duplicate-warning-button"
                  type="button"
                >
                  <span className="text-[8px] text-red-400 uppercase block font-black animate-pulse tracking-wide">
                    ⚠️ {lang === "es" ? "Placa Duplicada" : "Duplicate Plate"}
                  </span>
                  <span className="text-[11px] font-black text-red-200 uppercase truncate max-w-full leading-tight mt-0.5">
                    {duplicatePlatesInfo[0].placa}
                  </span>
                  <span className="text-[7.5px] text-red-400 font-bold underline mt-0.5 uppercase tracking-tight">
                    {lang === "es" ? "Ver/Corregir" : "Fix Placa"}
                  </span>
                </button>
              ) : (
                <div className="bg-[#1f2942] p-3 rounded-lg border border-gray-800 text-center">
                  <span className="text-[9px] text-gray-400 uppercase block font-semibold mb-1">
                    {lang === "es" ? "Promedio M³" : lang === "en" ? "Average M³" : lang === "pt" ? "Média M³" : lang === "fr" ? "Moyenne M³" : lang === "de" ? "Durchschnitt M³" : "Media M³"}
                  </span>
                  <span className="text-lg font-black text-blue-400 font-mono">{averageVolume.toFixed(2)} m³</span>
                </div>
              )}
            </div>

            {/* Filter toolbar */}
            <div className="bg-[#1f2942] p-4 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#fcc419]"
                  id="searchPlaca"
                />
              </div>
            </div>

            {/* List records */}
            <div className="bg-[#1f2942] rounded-xl border border-gray-700/50 p-4 space-y-3 shadow-md" id="records-list">
              <div className="flex justify-between items-center text-xs font-bold text-[#fcc419] tracking-wider uppercase border-b border-gray-800 pb-2">
                <span>{lang === "es" ? "Últimos registros guardados" : lang === "en" ? "Latest saved records" : lang === "pt" ? "Últimos registros salvos" : lang === "fr" ? "Derniers enregistrements" : lang === "de" ? "Zuletzt gespeicherte Datensätze" : "Ultimi record salvati"}</span>
                <span>{filteredHistory.length} {lang === "es" ? "registros" : lang === "en" ? "records" : lang === "pt" ? "registros" : lang === "fr" ? "enregistrements" : lang === "de" ? "Datensätze" : "record"}</span>
              </div>

              {filteredHistory.length > 0 && (
                <div className="flex flex-wrap justify-between items-center gap-2 bg-[#111827]/40 p-2.5 rounded-lg border border-gray-800/40">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAllFilteredSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4.5 h-4.5 rounded border-gray-700 bg-[#111827] text-[#fcc419] accent-[#fcc419] focus:ring-[#fcc419]/50 cursor-pointer"
                      id="checkbox-select-all"
                    />
                    <label
                      htmlFor="checkbox-select-all"
                      className="text-xs font-bold text-gray-300 cursor-pointer select-none"
                    >
                      {lang === "es" ? "Seleccionar Todo" : lang === "en" ? "Select All" : lang === "pt" ? "Selecionar Tudo" : lang === "fr" ? "Tout Sélectionner" : lang === "de" ? "Alles auswählen" : "Seleziona Tutto"} ({filteredHistory.length})
                    </label>
                  </div>
                  {selectedForDelete.length > 0 && (
                    <button
                      type="button"
                      onClick={handleBulkDelete}
                      className="bg-red-900/90 hover:bg-red-800/90 text-white font-bold py-1 px-3 rounded-md text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition shadow"
                      id="btn-bulk-delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t("delete_selected")} ({selectedForDelete.length})</span>
                    </button>
                  )}
                </div>
              )}

              {filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">
                  <FileText className="w-10 h-10 mx-auto text-gray-600 mb-2 stroke-[1.5]" />
                  {lang === "es" ? "No hay registros que coincidan con la búsqueda." : lang === "en" ? "No records match your search." : lang === "pt" ? "Nenhu registo coincidente encontrado." : lang === "fr" ? "Aucun enregistrement trouvé." : lang === "de" ? "Keine übereinstimmenden Datensätze gefunden." : "Nessun record corrispondente trovato."}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {filteredHistory.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setSelectedRecordId(rec.id);
                        setActiveTab("reports");
                      }}
                      className={`bg-[#111827] hover:bg-[#1a2236] border transition p-3 rounded-lg flex justify-between items-center cursor-pointer ${
                        selectedRecordId === rec.id ? "border-[#fcc419]" : "border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-grow min-w-0">
                        {/* Checkbox for custom record selection */}
                        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedForDelete.includes(rec.id)}
                            onChange={(e) => {
                              setSelectedForDelete((prev) =>
                                prev.includes(rec.id) ? prev.filter((item) => item !== rec.id) : [...prev, rec.id]
                              );
                            }}
                            className="w-4.5 h-4.5 rounded border-gray-700 bg-gray-900 text-[#fcc419] accent-[#fcc419] focus:ring-[#fcc419]/50 cursor-pointer"
                          />
                        </div>

                        {/* Record photo thumbnail indicator */}
                        {rec.foto ? (
                          <div className="flex-shrink-0 relative group">
                            <img
                              src={rec.foto}
                              alt="Truck thumbnail"
                              className="w-12 h-10 object-cover rounded border border-gray-750/70"
                            />
                            <span className="absolute bottom-0 right-0 bg-emerald-500 text-white font-bold px-1 py-[1.5px] rounded-[2px] text-[6.5px] tracking-wide leading-none">
                              FOTO
                            </span>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center rounded border border-gray-800/60 bg-gray-900/40 text-[10px] text-gray-500">
                            📷
                          </div>
                        )}

                        <div className="space-y-1 flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#fcc419] text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                              {rec.placa}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(rec.fecha).toLocaleDateString()} {new Date(rec.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 flex flex-wrap gap-x-4 gap-y-1 items-center">
                            <span className="flex items-center gap-1">
                              <HopperIcon className="w-3.5 h-3.5 text-gray-500" />
                              {lang === "es" ? "Tolva (A×B×C):" : lang === "en" ? "Hopper (A×B×C):" : lang === "pt" ? "Caçamba (A×B×C):" : lang === "fr" ? "Benne (A×B×C):" : lang === "de" ? "Mulde (A×B×C):" : "Tramoggia (A×B×C):"} <strong className="text-gray-300 font-mono">{(rec.A * rec.B * rec.C).toFixed(1)}m³</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <TablaIcon className="w-3.5 h-3.5 text-gray-500" />
                              {lang === "es" ? "Tabla:" : lang === "en" ? "Board:" : lang === "pt" ? "Tábua:" : lang === "fr" ? "Planche:" : lang === "de" ? "Bord:" : "Tavola:"} <strong className="text-gray-300 font-mono">{rec.volTabla > 0 ? `${rec.volTabla.toFixed(1)}m³` : (lang === "es" ? "No" : lang === "en" ? "No" : lang === "pt" ? "Não" : lang === "fr" ? "Non" : lang === "de" ? "Nein" : "No")}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <BotellaIcon className="w-3.5 h-3.5 text-amber-500/80" />
                              {lang === "es" ? "Botella:" : lang === "en" ? "Cylinder:" : lang === "pt" ? "Cilindro:" : lang === "fr" ? "Cylindre:" : lang === "de" ? "Zylinder:" : "Bottiglia:"} <strong className="text-amber-500 font-mono">-{rec.volBotella.toFixed(1)}m³</strong>
                            </span>
                          </div>

                          {(rec.empresa || rec.empresaTransporte || rec.proyecto) && (
                            <div className="text-[9px] text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5 items-center pt-1 border-t border-gray-800/40 mt-1">
                              {rec.empresa && (
                                <span className="truncate max-w-[120px] flex items-center gap-0.5" title={`${t("empresa")}: ${rec.empresa}`}>
                                  <span className="text-gray-600">🏛️</span> <span className="text-gray-300 font-bold">{rec.empresa}</span>
                                </span>
                              )}
                              {rec.empresaTransporte && (
                                <span className="truncate max-w-[120px] flex items-center gap-0.5" title={`${t("empresa_transporte")}: ${rec.empresaTransporte}`}>
                                  <span className="text-gray-600">🚚</span> <span className="text-gray-300 font-bold">{rec.empresaTransporte}</span>
                                </span>
                              )}
                              {rec.proyecto && (
                                <span className="truncate max-w-[120px] flex items-center gap-0.5" title={`${t("proyecto")}: ${rec.proyecto}`}>
                                  <span className="text-gray-600">🚧</span> <span className="text-gray-300 font-bold">{rec.proyecto}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <span className="block text-[8px] text-gray-500 tracking-wider font-bold">VOLUMEN NETO</span>
                          <span className="text-sm font-black text-emerald-400 font-mono">{rec.volNeto.toFixed(2)} m³</span>
                        </div>
                        <div className="flex items-center gap-1.5 self-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadFromHistory(rec);
                            }}
                            title="Cargar al Editor"
                            className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded hover:bg-slate-700 transition"
                          >
                            <Undo2 className="w-3.5 h-3.5 rotate-180" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistory(rec.id, e)}
                            title="Borrar Registro"
                            className="p-1.5 bg-red-950/40 text-red-400 hover:text-red-300 rounded hover:bg-red-900/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: REPORTES (Visualizes printable sheet) ----------------- */}
        {activeTab === "reports" && (
          <div className="space-y-5" id="view-reports">
            {/* Main Header & selection row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs">
              <span className="font-bold text-gray-300 flex items-center gap-1.5 self-center">
                <FileText className="w-4 h-4 text-[#fcc419]" />
                {lang === "es" ? "Hoja de Reporte Seleccionada" : lang === "en" ? "Selected Report Page" : lang === "pt" ? "Página de Relatório Selecionada" : lang === "fr" ? "Fiche de Rapport Sélectionnée" : lang === "de" ? "Ausgewählter Bericht" : "Rapporto Selezionato"}
              </span>
              
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                {history.length > 1 && (
                  <select
                    value={selectedRecordId || ""}
                    onChange={(e) => setSelectedRecordId(e.target.value)}
                    className="bg-[#111827] border border-gray-700 rounded-lg text-xs font-semibold p-2 px-3 focus:outline-none text-white shadow"
                  >
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.placa} ({new Date(h.fecha).toLocaleDateString()}) - {h.volNeto.toFixed(2)} m³
                      </option>
                    ))}
                  </select>
                )}
                
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-md transition ${
                    isSharing
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  }`}
                  id="btn-share"
                >
                  {isSharing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  <span>{isSharing ? (lang === "es" ? "Generando PDF..." : "Generating PDF...") : (lang === "es" ? "Compartir PDF" : "Share PDF")}</span>
                </button>
              </div>
            </div>

            {/* Standard structural report block (PDF) */}
            <div
              id="hojaReporte"
              className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl border border-gray-300 font-sans space-y-6 text-xs max-w-xl mx-auto"
            >
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-wider text-slate-900 uppercase">
                    {lang === "es" ? "REPORTE DE MEDICIÓN" : lang === "en" ? "MEASUREMENT REPORT" : lang === "pt" ? "RELATÓRIO DE MEDIÇÃO" : lang === "fr" ? "RAPPORT DE MESURE" : lang === "de" ? "MESSBERICHT" : "RAPPORTO DI MISURAZIONE"}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    LogiCubic - Cubicador de Camiones y Tolvas
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">{lang === "es" ? "Matrícula / Patente" : lang === "en" ? "License Plate" : lang === "pt" ? "Placa / Matrícula" : lang === "fr" ? "Immatriculation" : lang === "de" ? "Kennzeichen" : "Targa"}</span>
                  <span className="font-black text-base text-blue-700 tracking-wider uppercase">
                    {selectedRecord.placa}
                  </span>
                  <p className="text-[9px] text-slate-500 mt-1">
                    {new Date(selectedRecord.fecha).toLocaleDateString()} {new Date(selectedRecord.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Personnel/Company/Project row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-slate-700 bg-slate-50 p-3 text-[10px] rounded-lg border border-slate-200">
                <div>
                  <span className="font-bold uppercase text-[8px] text-slate-400 block tracking-wider">{t("cubicador")}</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate block">{selectedRecord.cubicador || (lang === "es" ? "No especificado" : "Not specified")}</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-[8px] text-slate-400 block tracking-wider">{t("chofer")}</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate block">{selectedRecord.chofer || (lang === "es" ? "No especificado" : "Not specified")}</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-[8px] text-slate-400 block tracking-wider">{t("empresa")}</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate block">{selectedRecord.empresa || (lang === "es" ? "No especificada" : "Not specified")}</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-[8px] text-slate-400 block tracking-wider">{t("empresa_transporte")}</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate block">{selectedRecord.empresaTransporte || (lang === "es" ? "No especificada" : "Not specified")}</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-[8px] text-slate-400 block tracking-wider">{t("proyecto")}</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate block">{selectedRecord.proyecto || (lang === "es" ? "No especificado" : "Not specified")}</span>
                </div>
              </div>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-bold text-[10px] border-b border-slate-300 pb-1 text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <HopperIcon className="w-3.5 h-3.5 text-blue-700" />
                    1. {lang === "es" ? "TOLVA" : "HOPPER"}
                  </h4>
                  <div className="mt-2 space-y-0.5 font-mono text-slate-600 text-[11px]">
                    <p>{t("largo")} (A): <strong className="text-slate-900 font-bold">{selectedRecord.A.toFixed(2)}</strong> m</p>
                    <p>{t("ancho")} (B): <strong className="text-slate-900 font-bold">{selectedRecord.B.toFixed(2)}</strong> m</p>
                    <p>{t("alto")} (C): <strong className="text-slate-900 font-bold">{selectedRecord.C.toFixed(2)}</strong> m</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[10px] border-b border-slate-300 pb-1 text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <TablaIcon className="w-3.5 h-3.5 text-blue-700" />
                    2. {lang === "es" ? "TABLA" : "BOARD"}
                  </h4>
                  <div className="mt-2 space-y-0.5 font-mono text-slate-600 text-[11px]">
                    <p>{t("ancho")} (B): <strong className="text-slate-900 font-bold">{selectedRecord.tablaB.toFixed(2)}</strong> m</p>
                    <p>{t("largo")} (D): <strong className="text-slate-900 font-bold">{selectedRecord.tablaD.toFixed(2)}</strong> m</p>
                    <p>{t("espesor")} (E): <strong className="text-slate-900 font-bold">{selectedRecord.tablaE.toFixed(2)}</strong> m</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[10px] border-b border-slate-300 pb-1 text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <BotellaIcon className="w-3.5 h-3.5 text-amber-700" />
                    3. {lang === "es" ? "BOTELLA" : "CYLINDER"}
                  </h4>
                  <div className="mt-2 space-y-0.5 font-mono text-slate-500 text-[11px]">
                    <p>Base Máx (B⁺): <strong className="text-slate-900 font-bold">{selectedRecord.bPlus.toFixed(2)}</strong> m</p>
                    <p>Base Mín (B⁻): <strong className="text-slate-900 font-bold">{selectedRecord.bMinus.toFixed(2)}</strong> m</p>
                    <p>Altura (H): <strong className="text-slate-900 font-bold">{selectedRecord.H.toFixed(2)}</strong> m</p>
                  </div>
                </div>
              </div>

              {/* Formula and calculations output */}
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-800 text-white uppercase text-[9px] tracking-wider">
                    <th className="p-2.5 rounded-l font-bold">{lang === "es" ? "Concepto / Clasificación" : "Concept / Classification"}</th>
                    <th className="p-2.5 text-right rounded-r font-bold">{lang === "es" ? "Volumen Resultado" : "Resulting Volume"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 text-slate-600 font-medium">{lang === "es" ? "Volumen Parcial Tolva" : "Hopper Partial Volume"}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                      {selectedRecord.volTolva.toFixed(2)} m³
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-600 font-medium">{lang === "es" ? "Volumen Adicional Tabla (Madera)" : "Additional Board Volume"}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                      {selectedRecord.volTabla.toFixed(2)} m³
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-600 font-medium">{lang === "es" ? "Volumen Descontable Botella Hidráulica" : "Deductible Cylinder Volume"}</td>
                    <td className="p-2.5 text-right font-bold text-amber-700 font-mono">
                      -{selectedRecord.volBotella.toFixed(2)} m³
                    </td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-800">
                    <td className="p-2.5 text-slate-800">{lang === "es" ? "Suma Bruta Total" : "Gross Total Sum"}</td>
                    <td className="p-2.5 text-right text-slate-900 font-mono">
                      {selectedRecord.sumaTotal.toFixed(2)} m³
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-950 font-black text-sm">
                    <td className="p-2.5 text-emerald-850 border-t-2 border-emerald-600 font-bold">
                      {t("net_volume")}
                    </td>
                    <td className="p-2.5 text-right text-emerald-700 border-t-2 border-emerald-600 font-mono">
                      {selectedRecord.volNeto.toFixed(2)} m³
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Evidence photo section in report view */}
              <div className="border bg-slate-50 border-slate-200 rounded-lg p-3 space-y-2">
                <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  {lang === "es" ? "📸 Evidencia Fotográfica Adjunta" : "📸 Attached Evidence Photo"}
                </span>
                {selectedRecord.foto ? (
                  <div className="relative rounded overflow-hidden border border-slate-300">
                    <img
                      src={selectedRecord.foto}
                      alt="Evidencia fotográfica"
                      className="w-full max-h-[160px] object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center py-4 bg-white rounded border border-dashed border-slate-300 text-slate-400 text-[10px]">
                    {lang === "es" ? "Sin evidencia fotográfica registrada" : "No registered photo evidence"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



        {/* ----------------- TAB 4: AJUSTES (Settings menu) ----------------- */}
        {activeTab === "settings" && (
          <div className="max-w-md mx-auto space-y-5" id="view-settings">
            <section className={`${
              resolvedTheme === 'light'
                ? 'bg-white border-slate-200 shadow-sm text-slate-800'
                : 'bg-[#1f2942] border-gray-700/50 shadow-md text-gray-100'
            } p-5 rounded-xl border space-y-4`}>
              <div className={`flex items-center space-x-2 border-b pb-3 ${
                resolvedTheme === 'light' ? 'text-amber-700 border-slate-100' : 'text-[#fcc419] border-gray-800'
              }`}>
                <Settings className={`w-5 h-5 ${resolvedTheme === 'light' ? 'text-amber-700' : 'text-[#fcc419]'}`} />
                <h2 className="font-bold text-sm tracking-wide">{t("config_title")}</h2>
              </div>

              {/* Language Selector Section */}
              <div className="space-y-2">
                <label className={`block text-[10px] font-bold tracking-wider uppercase ${resolvedTheme === 'light' ? 'text-slate-500' : 'text-gray-400'} flex items-center gap-1.5`}>
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t("language_label")}</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-base">
                    {(() => {
                      switch(lang) {
                        case "es": return "🇪🇸";
                        case "en": return "🇺🇸";
                        case "pt": return "🇧🇷";
                        case "fr": return "🇫🇷";
                        case "de": return "🇩🇪";
                        case "it": return "🇮🇹";
                        case "ru": return "🇷🇺";
                        case "zh": return "🇨🇳";
                        case "ja": return "🇯🇵";
                        case "ar": return "🇸🇦";
                        case "hi": return "🇮🇳";
                        case "tr": return "🇹🇷";
                        case "nl": return "🇳🇱";
                        case "pl": return "🇵🇱";
                        default: return "🌐";
                      }
                    })()}
                  </span>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className={`w-full text-xs font-bold pl-10 pr-10 py-3 rounded-lg border appearance-none transition focus:outline-none focus:ring-1 focus:ring-[#fcc419] focus:border-[#fcc419] cursor-pointer ${
                      resolvedTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-[#111827] border-gray-800 text-gray-100'
                    }`}
                  >
                    <option value="es">🇪🇸 Español (Spanish)</option>
                    <option value="en">🇺🇸 English (English)</option>
                    <option value="pt">🇧🇷 Português (Portuguese)</option>
                    <option value="fr">🇫🇷 Français (French)</option>
                    <option value="de">🇩🇪 Deutsch (German)</option>
                    <option value="it">🇮🇹 Italiano (Italian)</option>
                    <option value="ru">🇷🇺 Русский (Russian)</option>
                    <option value="zh">🇨🇳 中文 (Chinese)</option>
                    <option value="ja">🇯🇵 日本語 (Japanese)</option>
                    <option value="ar">🇸🇦 العربية (Arabic)</option>
                    <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                    <option value="tr">🇹🇷 Türkçe (Turkish)</option>
                    <option value="nl">🇳🇱 Nederlands (Dutch)</option>
                    <option value="pl">🇵🇱 Polski (Polish)</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Informative block about Empty Tolva Calculation */}
              <div className={`p-4 rounded-lg border leading-relaxed space-y-2 text-xs ${
                resolvedTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#111827] border-gray-800 text-gray-300'
              }`}>
                <p className="font-bold flex items-center gap-1.5 text-amber-500">
                  <span className="text-lg">📏</span> {t("empty_tolva_calc")}
                </p>
                <p>
                  {t("empty_tolva_desc")}
                </p>
                <p className="font-mono text-[11px] bg-black/10 dark:bg-black/40 p-2 rounded text-center">
                  {lang === "es" ? "Fórmula: Largo (A) × Ancho (B) × Alto (C)" : lang === "en" ? "Formula: Length (A) × Width (B) × Height (C)" : lang === "pt" ? "Fórmula: Comp. (A) × Largura (B) × Altura (C)" : lang === "fr" ? "Formule: Longueur (A) × Largeur (B) × Hauteur (C)" : lang === "de" ? "Formel: Länge (A) × Breite (B) × Höhe (C)" : "Formula: Lunghezza (A) × Larghezza (B) × Altezza (C)"}
                </p>
                <p className="text-[10px] italic">
                  {lang === "es" ? "* El volumen de la tabla se suma normalmente, y se resta el espacio ocupado por la botella del pistón hidráulico para obtener el volumen neto útil." : 
                   lang === "en" ? "* The volume of the board is added normally, and the space occupied by the hydraulic cylinder is subtracted to obtain the final useful net volume." :
                   lang === "pt" ? "* O volume da tábua é somado normalmente, e o espaço ocupado pelo pistão hidráulico é subtraído para obter o volume útil líquido final." :
                   lang === "fr" ? "* Le volume de la planche est ajouté normalement, et l'espace occupé par le vérin hydraulique est soustrait pour obtenir le volume utile net final." :
                   lang === "de" ? "* Das Volumen des Aufsatzbretts wird normal addiert und das Volumen des Hydraulikzylinders wird abgezogen, um das nutzbare Netto-Endvolumen zu erhalten." :
                   "* Il volume della tavola viene aggiunto normalmente, e viene sottratto lo spazio occupato dal cilindro idraulico per ottenere il volume utile netto finale."}
                </p>
              </div>

              {/* Reset memory */}
              <div className={`border-t pt-4 mt-2 ${resolvedTheme === 'light' ? 'border-slate-100' : 'border-gray-800/80'}`}>
                <button
                  onClick={() => {
                    if (confirm(t("reset_confirm"))) {
                      saveToLocalStorage([]);
                      alert(t("reset_success"));
                    }
                  }}
                  className={`w-full font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer ${
                    resolvedTheme === 'light'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-red-950/20 text-red-400 hover:bg-red-950/40 border border-red-900/30'
                  }`}
                >
                  {t("reset_history")}
                </button>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* 4. CHANNELS DETAILED PRINT REPORT BLOCK */}
      {/* This block is formatted using CSS to ONLY show when writing/printing page, generating high quality invoice layout */}
      <div className="hidden print-only bg-white text-slate-900 p-8 rounded-none border-none font-sans" id="print-view-document">
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black tracking-wider text-slate-900 uppercase">
              {lang === "es" ? "REPORTE DE MEDICIÓN - CUBICAJE DE TOLVA" : lang === "en" ? "MEASUREMENT REPORT - HOPPER CUBING" : lang === "pt" ? "RELATÓRIO DE MEDIÇÃO" : lang === "fr" ? "RAPPORT DE MESURE" : lang === "de" ? "MESSBERICHT KUBIERUNG" : "RAPPORTO DI MISURAZIONE"}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              {lang === "es" ? "Generado por LogiCubic - Cubicador de Camiones y Tolvas" : lang === "en" ? "Generated by LogiCubic - Truck & Hopper Measurer" : lang === "pt" ? "Gerado por LogiCubic - Cubicagem de Caminhões" : lang === "fr" ? "Généré par LogiCubic" : lang === "de" ? "Generiert von LogiCubic" : "Generato da LogiCubic"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800 text-[12px]">{lang === "es" ? "PATENTE / PLACA" : lang === "en" ? "LICENSE PLATE" : lang === "pt" ? "PLACA" : lang === "fr" ? "PLAQUE" : lang === "de" ? "KENNZEICHEN" : "TARGA"}: <span className="text-sm font-black text-blue-700">{selectedRecord.placa}</span></p>
            <p className="text-[10px] text-slate-500 font-mono">
              {lang === "es" ? "Fecha" : lang === "en" ? "Date" : lang === "pt" ? "Data" : lang === "fr" ? "Date" : lang === "de" ? "Datum" : "Data"}: {new Date(selectedRecord.fecha).toLocaleDateString()} {new Date(selectedRecord.fecha).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Personnel/Company/Project info */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 p-3 mt-4 bg-slate-50 border border-slate-200 text-[11px] rounded">
          <div>
            <span className="font-bold text-slate-400 text-[9px] block uppercase">{t("cubicador")}:</span>
            <span className="font-bold text-slate-800 text-[11px]">{selectedRecord.cubicador || "Admin / Oficial"}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 text-[9px] block uppercase">{t("chofer")}:</span>
            <span className="font-bold text-slate-800 text-[11px]">{selectedRecord.chofer || "Sin registro"}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 text-[9px] block uppercase">{t("empresa")}:</span>
            <span className="font-bold text-slate-800 text-[11px]">{selectedRecord.empresa || "Sin registro"}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 text-[9px] block uppercase">{t("empresa_transporte")}:</span>
            <span className="font-bold text-slate-800 text-[11px]">{selectedRecord.empresaTransporte || "Sin registro"}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 text-[9px] block uppercase">{t("proyecto")}:</span>
            <span className="font-bold text-slate-800 text-[11px]">{selectedRecord.proyecto || "Sin registro"}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded mt-4 border border-slate-200">
          <div>
            <h4 className="font-bold border-b border-slate-300 pb-1 text-slate-800 flex items-center gap-1">
              <HopperIcon className="w-3.5 h-3.5 text-slate-700" />
              1. {lang === "es" ? "CONTENEDOR TOLVA" : lang === "en" ? "HOPPER CONTAINER" : lang === "pt" ? "RECIPIENTE DA CAÇAMBA" : lang === "fr" ? "CONTENEUR BENNE" : lang === "de" ? "MULDENBEHÄLTER" : "CONTENITORE TRAMOGGIA"}
            </h4>
            <div className="mt-2 space-y-0.5 font-mono text-[11px] text-slate-600">
              <p>{t("largo")} (A): <strong>{selectedRecord.A.toFixed(2)}</strong> m</p>
              <p>{t("ancho")} (B): <strong>{selectedRecord.B.toFixed(2)}</strong> m</p>
              <p>{t("alto")} (C): <strong>{selectedRecord.C.toFixed(2)}</strong> m</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold border-b border-slate-300 pb-1 text-slate-800 flex items-center gap-1">
              <TablaIcon className="w-3.5 h-3.5 text-slate-700" />
              2. {lang === "es" ? "TABLA EXPANSORA" : lang === "en" ? "EXPANSION BOARD" : lang === "pt" ? "TÁBUA EXPANSORA" : lang === "fr" ? "PLANCHE D'EXTENSION" : lang === "de" ? "ERWEITERUNGSBRETT" : "TAVOLA DI ESTENSIONE"}
            </h4>
            <div className="mt-2 space-y-0.5 font-mono text-[11px] text-slate-600">
              <p>{t("ancho")} (B): <strong>{selectedRecord.tablaB.toFixed(2)}</strong> m</p>
              <p>{t("largo")} (D): <strong>{selectedRecord.tablaD.toFixed(2)}</strong> m</p>
              <p>{t("espesor")} (E): <strong>{selectedRecord.tablaE.toFixed(2)}</strong> m</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold border-b border-slate-300 pb-1 text-slate-800 flex items-center gap-1">
              <BotellaIcon className="w-3.5 h-3.5 text-slate-700" />
              3. {lang === "es" ? "BOTELLA HIDRÁULICA" : lang === "en" ? "HYDRAULIC CYLINDER" : lang === "pt" ? "PISTÃO HIDRÁULICO" : lang === "fr" ? "VÉRIN HYDRAULIQUE" : lang === "de" ? "HYDRAULIKZYLINDER" : "CILINDRO IDRAULICO"}
            </h4>
            <div className="mt-2 space-y-0.5 font-mono text-[11px] text-slate-600">
              <p>{lang === "es" ? "Base Máxima B⁺" : lang === "en" ? "Maximum Base B⁺" : lang === "pt" ? "Base Máxima B⁺" : lang === "fr" ? "Base Maximale B⁺" : lang === "de" ? "Maximale Basis B⁺" : "Base Massima B⁺"}: <strong>{selectedRecord.bPlus.toFixed(2)}</strong> m</p>
              <p>{lang === "es" ? "Base Mínima B⁻" : lang === "en" ? "Minimum Base B⁻" : lang === "pt" ? "Base Mínima B⁻" : lang === "fr" ? "Base Minimale B⁻" : lang === "de" ? "Minimale Basis B⁻" : "Base Minima B⁻"}: <strong>{selectedRecord.bMinus.toFixed(2)}</strong> m</p>
              <p>{lang === "es" ? "Altura H" : lang === "en" ? "Height H" : lang === "pt" ? "Altura H" : lang === "fr" ? "Hauteur H" : lang === "de" ? "Höhe H" : "Altezza H"}: <strong>{selectedRecord.H.toFixed(2)}</strong> m</p>
            </div>
          </div>
        </div>

        <table className="w-full text-left border-collapse mt-6 text-[12px]">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="p-2.5">{lang === "es" ? "Descripción de Medición" : lang === "en" ? "Measurement Description" : lang === "pt" ? "Descrição da Medição" : lang === "fr" ? "Description de la mesure" : lang === "de" ? "Messbeschreibung" : "Descrizione Misura"}</th>
              <th className="p-2.5 text-right">{lang === "es" ? "Volumen" : lang === "en" ? "Volume" : lang === "pt" ? "Volume" : lang === "fr" ? "Volume" : lang === "de" ? "Volumen" : "Volume"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-2.5 text-slate-600">{lang === "es" ? "Volumen Parcial Tolva Estimado" : lang === "en" ? "Estimated Partial Hopper Volume" : lang === "pt" ? "Volume Parcial Estimado da Caçamba" : lang === "fr" ? "Volume Partiel Estimé" : lang === "de" ? "Geschätztes Mulden-Teilvolumen" : "Volume Parziale Tramoggia Stimato"}</td>
              <td className="p-2.5 text-right text-slate-950 font-bold font-mono">{selectedRecord.volTolva.toFixed(2)} m³</td>
            </tr>
            <tr>
              <td className="p-2.5 text-slate-600">{lang === "es" ? "Volumen Adicional Tablar" : lang === "en" ? "Additional Board Volume" : lang === "pt" ? "Volume Adicional da Tábua" : lang === "fr" ? "Volume Supplémentaire Planche" : lang === "de" ? "Zusatzvolumen Aufsatzbrett" : "Volume Aggiuntivo Tavola"}</td>
              <td className="p-2.5 text-right text-slate-950 font-bold font-mono">{selectedRecord.volTabla.toFixed(2)} m³</td>
            </tr>
            <tr>
              <td className="p-2.5 text-slate-600">{lang === "es" ? "Espacio Descontable Botella de Pistón" : lang === "en" ? "Deductible Cylinder Space" : lang === "pt" ? "Espaço Descontável do Cilindro" : lang === "fr" ? "Espace déductible du vérin" : lang === "de" ? "Abzugsraum Kolbenzylinder" : "Spazio Sottraibile Cilindro"}</td>
              <td className="p-2.5 text-right text-amber-700 font-bold font-mono">-{selectedRecord.volBotella.toFixed(2)} m³</td>
            </tr>
            <tr className="bg-slate-100 font-bold">
              <td className="p-2.5 text-slate-800">{lang === "es" ? "Suma Bruta Parcial" : lang === "en" ? "Partial Gross Sum" : lang === "pt" ? "Soma Bruta Parcial" : lang === "fr" ? "Somme Brute Partielle" : lang === "de" ? "Brutto-Teilsumme" : "Somma Lorda Parziale"}</td>
              <td className="p-2.5 text-right text-slate-950 font-mono">{selectedRecord.sumaTotal.toFixed(2)} m³</td>
            </tr>
            <tr className="bg-slate-50 text-emerald-900 font-black text-sm">
              <td className="p-3 text-emerald-800 border-t-2 border-emerald-600">{lang === "es" ? "CUBICAJE NETO FINAL" : lang === "en" ? "FINAL NET KUBING" : lang === "pt" ? "CUBAGEM LÍQUIDA FINAL" : lang === "fr" ? "CUBAGE NET FINAL" : lang === "de" ? "GESAMT-NETTOKUBIERUNG" : "CUBATURA NETTA FINALE"}</td>
              <td className="p-3 text-right text-emerald-700 border-t-2 border-emerald-600 font-mono">{selectedRecord.volNeto.toFixed(2)} m³</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. BOTTOM NAVIGATION BAR BAR */}
      <footer
        className="bg-[#1f2942] border-t border-gray-800 py-2.5 grid grid-cols-4 text-center text-[10px] text-gray-400 fixed bottom-0 left-0 right-0 z-40 no-print"
        style={{ minHeight: "68px" }}
        id="app-footer-nav"
      >
        <button
          onClick={() => setActiveTab("calculator")}
          className={`flex flex-col items-center justify-center transition focus:outline-none ${
            activeTab === "calculator" ? "text-[#fcc419] font-black" : "hover:text-white"
          }`}
          id="nav-btn-calculator"
        >
          <Calculator className={`w-5 h-5 mb-1 ${activeTab === "calculator" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span>{t("tab_calculator")}</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center justify-center transition focus:outline-none relative ${
            activeTab === "history" ? "text-[#fcc419] font-black" : "hover:text-white"
          }`}
          id="nav-btn-history"
        >
          <FileText className={`w-5 h-5 mb-1 ${activeTab === "history" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span>{t("tab_history")}</span>
          {history.length > 0 && (
            <span className="absolute top-0 right-4 bg-[#fcc419] text-slate-950 font-black rounded-full text-[8px] w-4 h-4 flex items-center justify-center animate-pulse">
              {history.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex flex-col items-center justify-center transition focus:outline-none ${
            activeTab === "reports" ? "text-[#fcc419] font-black" : "hover:text-white"
          }`}
          id="nav-btn-reports"
        >
          <FileDown className={`w-5 h-5 mb-1 ${activeTab === "reports" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span>{t("tab_reports")}</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center transition focus:outline-none ${
            activeTab === "settings" ? "text-[#fcc419] font-black" : "hover:text-white"
          }`}
          id="nav-btn-settings"
        >
          <Settings className={`w-5 h-5 mb-1 ${activeTab === "settings" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span>{t("tab_settings")}</span>
        </button>
      </footer>

      {/* DUPLICATE PLATE CORRECTION MODAL WINDOW */}
      {showDuplicatesCorrector && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" id="modal-duplicates-corrector">
          <div className="bg-[#1f2942] border border-gray-700/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#111827] px-5 py-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    {lang === "es" ? "Corrector de Placas Duplicadas" : "Duplicate Plate Corrector"}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-normal mt-0.5">
                    {lang === "es" 
                      ? "Se encontraron vehículos con la misma identificación de placa. Corrígelas para mantener limpia tu flota."
                      : "Vehicles with identical plate identifications were found. Correct them to keep a clean fleet."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDuplicatesCorrector(false)}
                className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-lg transition"
                id="btn-close-duplicates"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-grow">
              {duplicatePlatesInfo.map(({ placa, list }) => (
                <div key={placa} className="bg-[#111827]/65 border border-red-500/20 rounded-xl p-4 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="bg-[#fcc419] text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">
                      {placa}
                    </span>
                    <span className="text-[9px] text-red-400 font-bold">
                      ⚠️ {list.length} {lang === "es" ? "Registros Duplicados" : "Duplicate Records"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {list.map((rec) => (
                      <div key={rec.id} className="bg-[#151c2e] p-3 rounded-lg border border-gray-800/80 space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] text-gray-400">
                          <span className="font-semibold text-gray-300">
                            📅 {new Date(rec.fecha).toLocaleDateString()} {new Date(rec.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-emerald-400 font-black font-mono">
                            {rec.volNeto.toFixed(2)} m³
                          </span>
                        </div>

                        {rec.cubicador && (
                          <div className="text-[10px] text-gray-400 flex gap-1 items-center">
                            <span className="opacity-90">👷</span> <span className="font-medium text-gray-300">{rec.cubicador}</span>
                          </div>
                        )}

                        {/* Inline license code plate input & button */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={lang === "es" ? "Nueva placa..." : "New plate..."}
                            defaultValue={rec.placa}
                            id={`edit-placa-input-${rec.id}`}
                            className="bg-gray-900 border border-gray-700 rounded p-1.5 px-2.5 text-xs text-white uppercase font-bold focus:outline-none focus:border-[#fcc419] flex-grow"
                          />
                          <button
                            onClick={() => {
                              const inputEl = document.getElementById(`edit-placa-input-${rec.id}`) as HTMLInputElement;
                              if (inputEl) {
                                const newPlateValue = inputEl.value.trim().toUpperCase();
                                if (!newPlateValue) {
                                  alert(lang === "es" ? "La placa no puede estar vacía" : "License plate cannot be empty");
                                  return;
                                }
                                // Update this record in history state
                                const updatedHistory = history.map(item => {
                                  if (item.id === rec.id) {
                                    return { ...item, placa: newPlateValue };
                                  }
                                  return item;
                                });
                                
                                saveToLocalStorage(updatedHistory);
                                
                                // Also try background upload
                                const targetRecord = updatedHistory.find(item => item.id === rec.id);
                                if (targetRecord) {
                                  saveCubicajeToCloud(targetRecord).catch(err => console.warn(err));
                                }
                                
                                // Notification feedback
                                setShareNotificationMessage(lang === "es" ? "¡Placa actualizada correctamente!" : "License plate updated!");
                                setShowShareNotification(true);
                                setTimeout(() => setShowShareNotification(false), 2000);
                              }
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 font-extrabold text-slate-50 text-[10px] uppercase py-1.5 px-3 rounded flex items-center gap-1 shadow-md transition active:scale-95"
                            title={lang === "es" ? "Guardar cambio de placa" : "Save plate change"}
                          >
                            <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                            <span>{lang === "es" ? "Guardar" : "Save"}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#111827] px-5 py-4 border-t border-gray-850 text-right">
              <button
                onClick={() => setShowDuplicatesCorrector(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition"
              >
                {lang === "es" ? "Cerrar" : "Close"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
