import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let variantStyles = '';
  switch (variant) {
    case 'default':
      variantStyles = 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80';
      break;
    case 'secondary':
      variantStyles = 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80';
      break;
    case 'destructive':
      variantStyles = 'border-transparent bg-red-500 text-white shadow hover:bg-red-500/80';
      break;
    case 'outline':
      variantStyles = 'text-foreground';
      break;
  }

  return (
    <div
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className || ''}`}
      {...props}
    />
  )
}

export { Badge }
