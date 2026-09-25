"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import { revoraColors } from "@/theme/colors";

type ImageLightboxProps = {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  alt: string;
  onIndexChange?: (index: number) => void;
};

export default function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
  alt,
  onIndexChange,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
    }
  }, [open, initialIndex]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(next);
      onIndexChange?.(next);
    },
    [onIndexChange],
  );

  const prev = useCallback(() => {
    setIndex((current) => {
      const nextIndex = (current - 1 + images.length) % images.length;
      onIndexChange?.(nextIndex);
      return nextIndex;
    });
  }, [images.length, onIndexChange]);

  const next = useCallback(() => {
    setIndex((current) => {
      const nextIndex = (current + 1) % images.length;
      onIndexChange?.(nextIndex);
      return nextIndex;
    });
  }, [images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, prev, next]);

  if (!images.length) return null;

  const current = images[index] ?? images[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      aria-labelledby="car-image-lightbox-title"
      PaperProps={{
        sx: {
          bgcolor: revoraColors.bgDeep,
          backgroundImage: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          pt: "var(--navbar-height, 0px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${revoraColors.border}`,
          }}
        >
          <Typography id="car-image-lightbox-title" variant="subtitle2" color="text.secondary">
            {alt} · {index + 1} / {images.length}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close gallery" edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 1, md: 6 },
            py: 2,
          }}
        >
          {images.length > 1 ? (
            <IconButton
              onClick={prev}
              aria-label="Previous image"
              sx={{
                position: "absolute",
                left: { xs: 4, md: 16 },
                zIndex: 2,
                bgcolor: "rgba(0,0,0,0.45)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          ) : null}

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: 1400,
              maxHeight: "100%",
            }}
          >
            <Image
              src={current}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "contain" }}
            />
          </Box>

          {images.length > 1 ? (
            <IconButton
              onClick={next}
              aria-label="Next image"
              sx={{
                position: "absolute",
                right: { xs: 4, md: 16 },
                zIndex: 2,
                bgcolor: "rgba(0,0,0,0.45)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          ) : null}
        </Box>

        {images.length > 1 ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              px: 2,
              py: 2,
              borderTop: `1px solid ${revoraColors.border}`,
            }}
          >
            {images.map((src, thumbIndex) => (
              <Box
                key={src}
                component="button"
                type="button"
                onClick={() => goTo(thumbIndex)}
                aria-label={`Open image ${thumbIndex + 1}`}
                aria-current={thumbIndex === index ? "true" : undefined}
                sx={{
                  p: 0,
                  flexShrink: 0,
                  border:
                    thumbIndex === index
                      ? `2px solid ${revoraColors.signal}`
                      : `1px solid ${revoraColors.border}`,
                  borderRadius: 1,
                  overflow: "hidden",
                  cursor: "pointer",
                  bgcolor: "transparent",
                  width: 88,
                  height: 58,
                  position: "relative",
                }}
              >
                <Image src={src} alt="" fill sizes="88px" style={{ objectFit: "cover" }} />
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>
    </Dialog>
  );
}
