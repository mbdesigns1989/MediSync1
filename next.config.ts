import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler (stable in Next 16). Auto-memoizes components/hooks at build
  // time, so manual useMemo/useCallback are no longer needed for performance.
  // Requires the babel-plugin-react-compiler peer dep; adds Babel build cost.
  reactCompiler: true,
};

export default nextConfig;
