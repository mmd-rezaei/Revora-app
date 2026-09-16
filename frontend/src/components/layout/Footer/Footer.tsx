import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import "./Footer.scss";

const footerLinks = [
  {
    label: "Cars",
    href: "/cars",
  },
  {
    label: "Brands",
    href: "/brands",
  },
  {
    label: "Compare",
    href: "/compare",
  },
  {
    label: "Configure",
    href: "/configure",
  },
  {
    label: "Tune",
    href: "/tune",
  },
  {
    label: "Garage",
    href: "/garage",
  },
];

export default function Footer() {
  return (
    <Box component="footer" className="footer">
      <Box className="footer__inner">
        {/* Brand */}
        <Box className="footer__brand">
          <Typography className="footer__logo">REVORA</Typography>

          <Typography className="footer__tagline">
            Build. Tune. Drive.
          </Typography>
        </Box>

        {/* Navigation */}
        <Box className="footer__links">
          {footerLinks.map((link) => (
            <Box
              key={link.href}
              component={Link}
              href={link.href}
              className="footer__link"
            >
              {link.label}
            </Box>
          ))}
        </Box>

        {/* Bottom */}
        <Box className="footer__bottom">
          <Typography className="footer__copyright">
            © {new Date().getFullYear()} REVORA
          </Typography>

          <Typography className="footer__status">
            BUILD. TUNE. DRIVE.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
