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
  const [seekerData,  setSeekerData]  = useState(null); // анкета соискателя

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
    setSeekerData(null);
  };

  // Загрузить анкету соискателя при входе
  useEffect(() => {
    if (role === "seeker" && currentUser?.id) {
      seekersApi.getByUserId(currentUser.id)
        .then(data => setSeekerData(data))
        .catch(() => setSeekerData(null));
    }
  }, [role, currentUser?.id]);

  if (!currentUser) return <AuthPage onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Navbar role={role} screen={screen} onNav={setScreen} onLogout={handleLogout} userName={currentUser?.email} />

      {/* ── Соискатель ─────────────────────────────────────── */}
      {role === "seeker" && screen === "vacancies" && (
        <SeekerVacancies seekerData={seekerData} />
      )}
      {role === "seeker" && screen === "responses" && (
        <SeekerMyResponses seekerData={seekerData} />
      )}
      {role === "seeker" && screen === "apply" && (
        <SeekerApplyForm
          currentUser={currentUser}
          onProfileLoaded={setSeekerData}
        />
      )}

      {/* ── Работодатель ────────────────────────────────────── */}
      {role === "employer" && screen === "vacancies" && (
        <EmployerVacancies currentUser={currentUser} />
      )}
      {role === "employer" && screen === "search" && (
        <EmployerSearch />
      )}
      {role === "employer" && screen === "incoming" && (
        <EmployerIncoming currentUser={currentUser} />
      )}
    </div>
  );
}
