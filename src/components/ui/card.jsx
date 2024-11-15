import React from 'react'

export function Card({ children, className, ...props }) {
  return (
    <div className={`bg-card text-card-foreground rounded-lg shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>
}

export function CardTitle({ children, className, ...props }) {
  return <h3 className={`text-2xl font-semibold ${className}`} {...props}>{children}</h3>
}

export function CardContent({ children, className, ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
}