"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Box sx={{ py: 8, textAlign: "center", border: "1px dashed rgba(244,241,234,0.12)", borderRadius: 1 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary">{body}</Typography>
    </Box>
  );
}
