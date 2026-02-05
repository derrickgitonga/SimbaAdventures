import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    wrapperClassName?: string;
}

export function OptimizedImage({ className, wrapperClassName, alt, ...props }: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={cn("relative overflow-hidden bg-muted/20", wrapperClassName)}>
            {!isLoaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                </div>
            )}

            {error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                    <span className="text-xs">Failed to load</span>
                </div>
            ) : (
                <img
                    alt={alt}
                    loading="lazy"
                    className={cn(
                        "transition-all duration-700 ease-in-out",
                        isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-xl scale-105",
                        className
                    )}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setError(true)}
                    {...props}
                />
            )}
        </div>
    );
}
