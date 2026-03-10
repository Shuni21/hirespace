import { useState, useEffect } from "react";
import { C } from "./constants/colors";
import { seekersApi } from "./constants/api";

import Navbar            from "./components/Navbar";
import AuthPage          from "./pages/AuthPage";
import SeekerVacancies   from "./pages/SeekerVacancies";
import SeekerMyResponses from "./pages/SeekerMyResponses";
import SeekerApplyForm   from "./pages/SeekerApplyForm";
import EmployerVacancies from "./pages/EmployerVacancies";
import EmployerSearch    from "./pages/EmployerSearch";
import EmployerIncoming  from "./pages/EmployerIncoming";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [role,        setRole]        = useState(null);
  const [screen,      setScreen]      = useState(null);
  const [candidates,  setCandidates]  = useState([]);
  const [seekerData,  setSeekerData]  = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // ── Вход ─────────────────────────────────────────────────
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === "Соискатель") {
      setRole("seeker");
      setScreen("vacancies");
    } else {
      setRole("employer");
      setScreen("vacancies");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRole(null);
    setScreen(null);
    setCandidates([]);
    setSeekerData(null);
  };

  // ── Загрузка данных ───────────────────────────────────────
  useEffect(() => {
    if (role === "employer") loadCandidates();
    if (role === "seeker" && currentUser?.id) loadSeekerData();
  }, [role]);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await seekersApi.getAll();
      setCandidates(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSeekerData = async () => {
    try {
      const data = await seekersApi.getByUserId(currentUser.id);
      setSeekerData(data);
    } catch {
      setSeekerData(null);
    }
  };

  const updateCandidateStatus = async (id, status) => {
    try {
      await seekersApi.updateStatus(id, status);
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, application_status: status } : c));
    } catch (e) {
      setError("Ошибка обновления: " + e.message);
    }
  };

  // ── Не авторизован ────────────────────────────────────────
  if (!currentUser) return <AuthPage onLogin={handleLogin} />;

  // ── Ошибка ────────────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>❌</div>
        <div style={{ fontWeight: 700, color: C.text, marginBottom: 8 }}>Ошибка подключения к серверу</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>{error}</div>
        <button onClick={() => { setError(null); loadCandidates(); }}
          style={{ background: C.primary, border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Попробовать снова
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Navbar
        role={role}
        screen={screen}
        onNav={setScreen}
        onLogout={handleLogout}
        userName={currentUser?.email}
      />

      {/* ── Соискатель ───────────────────────────────── */}
      {role === "seeker" && screen === "vacancies" && (
        <SeekerVacancies />
      )}
      {role === "seeker" && screen === "responses" && (
        <SeekerMyResponses
          applications={seekerData ? [seekerData] : []}
        />
      )}
      {role === "seeker" && screen === "apply" && (
        <SeekerApplyForm
          currentUser={currentUser}
          onProfileLoaded={setSeekerData}
        />
      )}

      {/* ── Работодатель ─────────────────────────────── */}
      {role === "employer" && screen === "vacancies" && (
        <EmployerVacancies />
      )}
      {role === "employer" && screen === "search" && (
        <EmployerSearch
          onUpdateStatus={updateCandidateStatus}
        />
      )}
      {role === "employer" && screen === "incoming" && (
        <EmployerIncoming
          candidates={candidates}
          onUpdateStatus={updateCandidateStatus}
        />
      )}
    </div>
  );
}
