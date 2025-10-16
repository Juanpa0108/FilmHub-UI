import React from "react";

type Props = { className?: string; style?: React.CSSProperties };

const BrandLogo: React.FC<Props> = ({ className = "", style }) => {
  return <img src="/logo.png" alt="Logo" className={className} style={style} />;
};

export default BrandLogo;
