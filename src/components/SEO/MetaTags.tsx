import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  section?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "Nico Cruickshank - Web Developer Portfolio",
  description = "Full Stack Web Developer specializing in React, TypeScript, Node.js, and modern web technologies",
  section = "home"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Add section-specific meta data
    const sectionMeta = document.querySelector('meta[name="current-section"]') ||
      document.createElement('meta');
    sectionMeta.setAttribute('name', 'current-section');
    sectionMeta.setAttribute('content', section);
    if (!document.querySelector('meta[name="current-section"]')) {
      document.head.appendChild(sectionMeta);
    }

    // Add structured data for current section
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": `${window.location.origin}#${section}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Nico Cruickshank Portfolio",
        "url": window.location.origin
      }
    };

    // Update or create structured data script
    let structuredDataScript = document.querySelector('#structured-data-section') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data-section';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [title, description, section]);

  return null; // This component doesn't render anything
};