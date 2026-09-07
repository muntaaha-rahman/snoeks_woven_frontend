import { BrowserRouter, Route, Routes } from "react-router-dom";
import { VisitDetailPage } from "./pages/VisitDetailPage";
import { VisitFormPage } from "./pages/VisitFormPage";
import { VisitListPage } from "./pages/VisitListPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VisitListPage />} />
        <Route path="/visits/new" element={<VisitFormPage />} />
        <Route path="/visits/:visitId" element={<VisitDetailPage />} />
        <Route path="/visits/:visitId/edit" element={<VisitFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
