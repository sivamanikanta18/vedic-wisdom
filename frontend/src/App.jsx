import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { startTimeTracking, stopTimeTracking } from "./utils/timeTracker";
import { isAuthenticated } from "./utils/api";

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"));
const Scriptures = lazy(() => import("./pages/Scriptures"));
const EssentialTruths = lazy(() => import("./pages/EssentialTruths"));
const WhoAmI = lazy(() => import("./pages/WhoAmI"));
const WhatIsOurPurpose = lazy(() => import("./pages/WhatIsOurPurpose"));
const WhatIsKarma = lazy(() => import("./pages/WhatIsKarma"));
const WhatIsReincarnation = lazy(() => import("./pages/WhatIsReincarnation"));
const HowToOvercomeFear = lazy(() => import("./pages/HowToOvercomeFear"));
const HowToOvercomeAnger = lazy(() => import("./pages/HowToOvercomeAnger"));
const WhyBadHappensToGoodPeople = lazy(() => import("./pages/WhyBadHappensToGoodPeople"));
const ManageTime = lazy(() => import("./pages/ManageTime"));
const HowToOvercomeStress = lazy(() => import("./pages/HowToOvercomeStress"));
const YogaModernAge = lazy(() => import("./pages/YogaModernAge"));
const WhatIsRealHappiness = lazy(() => import("./pages/WhatIsRealHappiness"));
const HumanOrigin = lazy(() => import("./pages/HumanOrigin"));
const SixOpulences = lazy(() => import("./pages/SixOpulences"));
const RegulativePrinciples = lazy(() => import("./pages/RegulativePrinciples"));
const AbcdeBhakti = lazy(() => import("./pages/AbcdeBhakti"));
const PowerOfChanting = lazy(() => import("./pages/PowerOfChanting"));
const PureLove = lazy(() => import("./pages/PureLove"));
const EightyFourLakhSpecies = lazy(() => import("./pages/EightyFourLakhSpecies"));
const MayaAndMaterialWorld = lazy(() => import("./pages/MayaAndMaterialWorld"));
const ControlLust = lazy(() => import("./pages/ControlLust"));
const Chanting = lazy(() => import("./pages/Chanting"));
const About = lazy(() => import("./pages/About"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Events"));
const Games = lazy(() => import("./pages/Games"));
const KrishnaChatbot = lazy(() => import("./pages/KrishnaChatbot"));
const BookReader = lazy(() => import("./pages/BookReader"));
const VedaBaseEmbed = lazy(() => import("./pages/VedaBaseEmbed"));

function App() {
  // Start global time tracking when app mounts
  useEffect(() => {
    startTimeTracking();
    
    return () => {
      stopTimeTracking();
    };
  }, []);

  return (
    <Router>
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
            <Route path="/scriptures" element={<Scriptures />} />
            <Route path="/essential-truths" element={<EssentialTruths />} />
            <Route path="/essential-truths/who-am-i" element={<WhoAmI />} />
            <Route path="/essential-truths/what-is-our-purpose" element={<WhatIsOurPurpose />} />
            <Route path="/essential-truths/what-is-karma" element={<WhatIsKarma />} />
            <Route path="/essential-truths/what-is-reincarnation" element={<WhatIsReincarnation />} />
            <Route path="/essential-truths/overcome-fear" element={<HowToOvercomeFear />} />
            <Route path="/essential-truths/overcome-anger" element={<HowToOvercomeAnger />} />
            <Route path="/essential-truths/why-bad-happens" element={<WhyBadHappensToGoodPeople />} />
            <Route path="/essential-truths/manage-time" element={<ManageTime />} />
            <Route path="/essential-truths/overcome-stress" element={<HowToOvercomeStress />} />
            <Route path="/essential-truths/yoga-modern-age" element={<YogaModernAge />} />
            <Route path="/essential-truths/real-happiness" element={<WhatIsRealHappiness />} />
            <Route path="/human-origin" element={<HumanOrigin />} />
            <Route path="/essential-truths/six-opulences" element={<SixOpulences />} />
            <Route path="/essential-truths/regulative-principles" element={<RegulativePrinciples />} />
            <Route path="/essential-truths/abcde-bhakti" element={<AbcdeBhakti />} />
            <Route path="/essential-truths/pure-love" element={<PureLove />} />
            <Route path="/essential-truths/84-lakh-species" element={<EightyFourLakhSpecies />} />
            <Route path="/essential-truths/maya-and-material-world" element={<MayaAndMaterialWorld />} />
            <Route path="/essential-truths/control-lust" element={<ControlLust />} />
            <Route path="/chanting" element={<Chanting />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/krishna-chat" element={<ProtectedRoute><KrishnaChatbot /></ProtectedRoute>} />
            <Route path="/vedabase/:bookId" element={<VedaBaseEmbed />} />
            <Route path="/vedabase/:bookId/:chapterId" element={<VedaBaseEmbed />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
