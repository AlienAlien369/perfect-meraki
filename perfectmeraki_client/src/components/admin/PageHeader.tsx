import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="font-display text-2xl text-espresso">{title}</h1>
      {description && <p className="text-espresso/60 text-sm mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
