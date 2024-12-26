import React from "react";

interface CensusHeaderProps {
  department: string;
}

const CensusHeader: React.FC<CensusHeaderProps> = ({ department }) => (
  <div className="container max-w-md mx-auto p-4">
    <h2 className="text-lg font-medium mb-4">{department}</h2>
  </div>
);

export default CensusHeader;