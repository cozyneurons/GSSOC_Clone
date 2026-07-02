import * as React from "react"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted ${className || ''}`}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground uppercase">
            {fallback ? fallback.slice(0, 2) : "UN"}
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
