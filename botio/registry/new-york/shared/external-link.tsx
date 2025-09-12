import { cn } from "@/lib/utils";

interface ExternalLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    className?: string;
}

export default function ExternalLink({ children, className, ...props }: ExternalLinkProps) {
    return (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'text-foreground underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 ease-out hover:decoration-current! hover:opacity-80',
              className,
          )}
        >
            {children}
        </a>
    )
}
