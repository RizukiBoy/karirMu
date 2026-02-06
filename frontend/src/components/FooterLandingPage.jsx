import React from "react";
import logoKarirMu from "../assets/img/logoz2.svg";
import {
  Youtube,
  Facebook,
  Instagram,
  Send,
  Global,
} from "iconsax-reactjs";

const FooterLandingPage = () => {
  return (
    <footer
      className="w-full text-white"
      style={{
        background: "linear-gradient(90deg, #004F8F 0%, #009B49 100%)",
      }}
    >
      {/* CONTAINER → SAMA DENGAN NAVBAR */}
      <div className="max-w-7xl mx-auto px-2 py-6">
        <div className="flex items-center justify-between">

          {/* LEFT - LOGO (UKURAN DISAMAKAN DENGAN NAVBAR) */}
          <div className="flex items-center justify-start gap-2">
            <img
  src={logoKarirMu}
  alt="KarirMu"
  className="h-12 w-auto"
  style={{
    filter: "brightness(0) invert(1)",
  }}
/>
          </div>

          {/* CENTER - COPYRIGHT (TIDAK DIUBAH) */}
          <div className="text-sm opacity-90 text-center">
            © 2025 Persyarikatan Muhammadiyah
          </div>

          {/* RIGHT - ICON (UKURAN & ALIGN DISESUAIKAN) */}
          <div className="flex items-center gap-4">
            <Youtube size="18" color="#ffffff" variant="Bold" />
            <Facebook size="18" color="#ffffff" variant="Bold" />
            <Send size="18" color="#ffffff" variant="Bold" />
            <Instagram size="18" color="#ffffff" variant="Bold" />
            <Global size="18" color="#ffffff" variant="Bold" />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default FooterLandingPage;