"use client";
import { Dialog } from "@base-ui/react/dialog";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { useMedia } from "@/lib/useMedia";
import { cn } from "@/lib/utils";

/**
 * Desktop: centred Base UI dialog. Phone: Vaul bottom drawer you can swipe down.
 * Same content, same API — the device decides the container.
 */
export function ResponsiveModal({
  open, onOpenChange, title, description, children, className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const desktop = useMedia("(min-width: 768px)");

  if (desktop) {
    return (
      <Dialog.Root open={open} onOpenChange={(v) => onOpenChange(v)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup
            className={cn(
              "overlay-scroll fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[min(920px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
              "rounded-[28px] bg-card p-2 shadow-[var(--shadow-pop)] outline-none",
              "transition-[opacity,scale,filter] duration-200 ease-out data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[starting-style]:blur-[4px]",
              className
            )}
          >
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            {description && <Dialog.Description className="sr-only">{description}</Dialog.Description>}
            <Dialog.Close aria-label="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-card/90 text-ink shadow-[var(--shadow-card)] transition-[scale] active:scale-[0.96]">
              <X className="h-5 w-5" strokeWidth={1.75} />
            </Dialog.Close>
            {children}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content className={cn("fixed inset-x-0 bottom-0 z-50 flex max-h-[92svh] flex-col rounded-t-[28px] bg-card outline-none", className)}>
          <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-line" aria-hidden="true" />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          {description && <Drawer.Description className="sr-only">{description}</Drawer.Description>}
          <div className="overlay-scroll overflow-y-auto p-2 pb-[max(12px,env(safe-area-inset-bottom))]">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
