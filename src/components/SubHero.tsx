import React from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface SubHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbItems: BreadcrumbItem[];
  bgImage?: string;
}

const SubHero: React.FC<SubHeroProps> = ({ title, subtitle, breadcrumbItems, bgImage }) => {
  const hoverStyle = `
    .breadcrumb-item-link:hover {
      color: #a855f7 !important;
      transform: translateY(-1px);
    }
    @media (max-width: 768px) {
      .sub-hero h1 { font-size: 2.5rem !important; }
    }
  `;

  return (
    <section className="sub-hero" style={{
      position: 'relative',
      padding: '4rem 0 3.5rem',
      marginTop: '-20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      overflow: 'hidden',
      background: 'var(--bg-secondary)',
      zIndex: 5
    }}>
      <style>{hoverStyle}</style>

      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: bgImage ? 0.08 : 0,
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        
        {/* Integrated Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <ol style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            padding: 0, 
            margin: 0, 
            listStyle: 'none'
          }}>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  {index > 0 && (
                    <span style={{ margin: '0 1rem', color: 'var(--text-muted)', fontSize: '0.7rem', opacity: 0.3 }} aria-hidden="true">/</span>
                  )}
                  <span
                    onClick={!isLast ? item.onClick : undefined}
                    className="breadcrumb-item-link"
                    style={{
                      cursor: !isLast && item.onClick ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      color: isLast ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      fontWeight: isLast ? 700 : 500,
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {item.icon && <span style={{ display: 'flex', fontSize: '1.1rem', opacity: isLast ? 1 : 0.6 }}>{item.icon}</span>}
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 900, 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, var(--accent-purple-light) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px'
        }}>
          {title}
        </h1>
        
        {subtitle && (
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default SubHero;
