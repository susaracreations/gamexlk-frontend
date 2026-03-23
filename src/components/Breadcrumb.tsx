import React from 'react';

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav aria-label="Breadcrumb" className={className} style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: 0, margin: 0, listStyle: 'none' }}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            {index > 0 && (
                                <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)', opacity: 0.4 }} aria-hidden="true">/</span>
                            )}

                            <span
                                onClick={!isLast ? item.onClick : undefined}
                                aria-current={isLast ? 'page' : undefined}
                                style={{
                                    cursor: !isLast && item.onClick ? 'pointer' : 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: isLast ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    fontWeight: isLast ? 600 : 400,
                                    transition: 'opacity 0.2s',
                                    opacity: isLast ? 1 : 0.8
                                }}
                            >
                                {item.icon && <span style={{ display: 'flex', fontSize: '1.1rem' }}>{item.icon}</span>}
                                {item.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;