import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages/IndexPage/IndexPage";
import { VoxelMeshesPage } from "./pages/VoxelMeshesPage/VoxelMeshesPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/voxel-meshes" element={<VoxelMeshesPage />} />
      </Routes>
    </BrowserRouter>
  );
};
