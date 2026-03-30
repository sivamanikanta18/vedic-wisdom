import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import MinimalLayout from "./components/MinimalLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
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

// HKM Temple Management Pages
const Temples = lazy(() => import("./pages/Temples"));
const TempleDetail = lazy(() => import("./pages/TempleDetail"));
const Colleges = lazy(() => import("./pages/Colleges"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const SocialFeed = lazy(() => import("./pages/SocialFeed"));
const AkshayaPatra = lazy(() => import("./pages/AkshayaPatra"));

// Admin Pages
const AdminUsers = lazy(() => import("./pages/AdminUsers"));

// Guide Pages
const GuideDashboard = lazy(() => import("./pages/GuideDashboard"));
const FolkEvents = lazy(() => import("./pages/FolkEvents"));

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
          <Route element={<MinimalLayout />}>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/scriptures" element={<ProtectedRoute><Scriptures /></ProtectedRoute>} />
            <Route path="/essential-truths" element={<ProtectedRoute><EssentialTruths /></ProtectedRoute>} />
            <Route path="/essential-truths/who-am-i" element={<ProtectedRoute><WhoAmI /></ProtectedRoute>} />
            <Route path="/essential-truths/what-is-our-purpose" element={<ProtectedRoute><WhatIsOurPurpose /></ProtectedRoute>} />
            <Route path="/essential-truths/what-is-karma" element={<ProtectedRoute><WhatIsKarma /></ProtectedRoute>} />
            <Route path="/essential-truths/what-is-reincarnation" element={<ProtectedRoute><WhatIsReincarnation /></ProtectedRoute>} />
            <Route path="/essential-truths/overcome-fear" element={<ProtectedRoute><HowToOvercomeFear /></ProtectedRoute>} />
            <Route path="/essential-truths/overcome-anger" element={<ProtectedRoute><HowToOvercomeAnger /></ProtectedRoute>} />
            <Route path="/essential-truths/why-bad-happens" element={<ProtectedRoute><WhyBadHappensToGoodPeople /></ProtectedRoute>} />
            <Route path="/essential-truths/manage-time" element={<ProtectedRoute><ManageTime /></ProtectedRoute>} />
            <Route path="/essential-truths/overcome-stress" element={<ProtectedRoute><HowToOvercomeStress /></ProtectedRoute>} />
            <Route path="/essential-truths/yoga-modern-age" element={<ProtectedRoute><YogaModernAge /></ProtectedRoute>} />
            <Route path="/essential-truths/real-happiness" element={<ProtectedRoute><WhatIsRealHappiness /></ProtectedRoute>} />
            <Route path="/human-origin" element={<ProtectedRoute><HumanOrigin /></ProtectedRoute>} />
            <Route path="/essential-truths/six-opulences" element={<ProtectedRoute><SixOpulences /></ProtectedRoute>} />
            <Route path="/essential-truths/regulative-principles" element={<ProtectedRoute><RegulativePrinciples /></ProtectedRoute>} />
            <Route path="/essential-truths/abcde-bhakti" element={<ProtectedRoute><AbcdeBhakti /></ProtectedRoute>} />
            <Route path="/essential-truths/pure-love" element={<ProtectedRoute><PureLove /></ProtectedRoute>} />
            <Route path="/essential-truths/84-lakh-species" element={<ProtectedRoute><EightyFourLakhSpecies /></ProtectedRoute>} />
            <Route path="/essential-truths/maya-and-material-world" element={<ProtectedRoute><MayaAndMaterialWorld /></ProtectedRoute>} />
            <Route path="/essential-truths/control-lust" element={<ProtectedRoute><ControlLust /></ProtectedRoute>} />
            <Route path="/chanting" element={<ProtectedRoute><Chanting /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/krishna-chat" element={<ProtectedRoute><KrishnaChatbot /></ProtectedRoute>} />
            <Route path="/vedabase/:bookId" element={<ProtectedRoute><VedaBaseEmbed /></ProtectedRoute>} />
            <Route path="/vedabase/:bookId/:chapterId" element={<ProtectedRoute><VedaBaseEmbed /></ProtectedRoute>} />
            {/* HKM Temple Management Routes */}
            <Route path="/temples" element={<ProtectedRoute><Temples /></ProtectedRoute>} />
            <Route path="/temples/:id" element={<ProtectedRoute><TempleDetail /></ProtectedRoute>} />
            <Route path="/colleges" element={<ProtectedRoute><Colleges /></ProtectedRoute>} />
            <Route path="/colleges/:id" element={<ProtectedRoute><CollegeDetail /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
            <Route path="/akshaya-patra" element={<ProtectedRoute><AkshayaPatra /></ProtectedRoute>} />
            {/* Admin Routes - Only Admin can access */}
            <Route path="/admin/users" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </RoleProtectedRoute>
            } />
            {/* Guide Routes - Guide and Admin can access */}
            <Route path="/guide/dashboard" element={
              <RoleProtectedRoute allowedRoles={['folk_guide', 'admin']}>
                <GuideDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/events" element={<ProtectedRoute><FolkEvents /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
