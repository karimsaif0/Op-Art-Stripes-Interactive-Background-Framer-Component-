<div align="center">

# 🌀 Op Art Stripes
### Interactive Optical Art Background for Framer

**Bold stripes. Fluid motion. A cursor that bends the pattern.**

[![Live Preview](https://img.shields.io/badge/Live_Preview-Explore_the_Effect-FFD23F?style=for-the-badge&logo=framer&logoColor=black)](https://opartstripes.framer.website/)
[![Framer](https://img.shields.io/badge/Built_for-Framer-161616?style=for-the-badge&logo=framer)](https://www.framer.com/)
[![Author](https://img.shields.io/badge/Made_with_💛-Karim_Saif-FFD23F?style=for-the-badge)](https://x.com/karimsaif0)

[**🚀 Live Demo**](https://opartstripes.framer.website/) · [**💻 Component Source**](./KarimSaifOpArtStripes.tsx) · [**✉️ Contact**](mailto:karimsaif010@gmail.com)

</div>

---

## Make your background move differently

**Op Art Stripes** turns a classic high-contrast stripe pattern into a living interactive surface. Vertical bands ripple, swell and pinch in slow motion. Move your cursor over the canvas and a soft magnification field pushes nearby stripes outward, creating a playful optical illusion.

Built as a responsive **Framer code component** by **Karim Saif**.

### ✨ What makes it special?

- **Flowing optical-art bands** — dynamic waves animate stripe edges.
- **Cursor magnification** — a radial displacement field follows pointer movement.
- **Five curated color palettes** — Classic, Sunburst, Monochrome, Electric, Mint.
- **Your colors, your rhythm** — tune stripe count, wave detail, intensity and speed.
- **Responsive canvas** — adapts to any Framer frame.
- **Performance-conscious rendering** — adaptive path segments, 60 FPS cap, max DPR 2, and a canvas pixel budget.
- **Visibility-aware lifecycle** — stops animation offscreen or when the tab is hidden.
- **Accessible motion** — respects reduced-motion preferences.
- **Static-render support** — provides a deterministic thumbnail/export frame.
- **Zero third-party runtime dependencies** — uses React, Framer and Canvas 2D.

## 🎬 Live Preview

### [opartstripes.framer.website →](https://opartstripes.framer.website/)

Visit the demo and move your cursor around the stripes. Try changing the wave density and lens strength in Framer to create a completely different visual mood.

## 🧩 Installation in Framer

1. Open your project in [Framer](https://www.framer.com/).
2. Create a new **Code Component**.
3. Name it `KarimSaifOpArtStripes.tsx`.
4. Copy the complete source from [KarimSaifOpArtStripes.tsx](./KarimSaifOpArtStripes.tsx).
5. Add the component to your canvas and resize it to fill a hero or section.
6. Customize the properties in the Framer right sidebar.

> **Tip:** Use the background behind your content by layering text, buttons, or sections above it inside Framer.

## 🎛️ Customize everything

| Control | What it does |
| :-- | :-- |
| **Preset** | Choose Classic, Sunburst, Monochrome, Electric, Mint, or Custom |
| **Stripe Color** | Set the band color in Custom mode |
| **Background** | Set the base color in Custom mode |
| **Stripes** | Control stripe density from 4 to 120 |
| **Speed** | Control the wave animation speed |
| **Wave Amount** | Set how much the stripes bend |
| **Wave Detail** | Change the wave frequency and pattern complexity |
| **Lens Size** | Adjust the cursor distortion radius |
| **Lens Power** | Set the cursor magnification strength |
| **Interactive** | Enable or disable pointer effects |
| **Paused** | Freeze the animated waves |

## 🎨 Color palettes

| Preset | Stripe | Background |
| :-- | :-- | :-- |
| Classic | `#161616` | `#FFD23F` |
| Sunburst | `#F84B20` | `#FFE8C2` |
| Monochrome | `#101010` | `#F4F4F0` |
| Electric | `#C6FF00` | `#25115A` |
| Mint | `#123E37` | `#B8F5D1` |

## 💡 Great for

Creative portfolios · Experimental landing pages · Interactive hero sections · Creative agencies · Music and event microsites · Editorial websites · Digital art showcases · Bold product launches

## ⚡ Under the hood

The component uses the Canvas 2D API to construct stripe shapes from dynamically displaced boundaries. Time-driven sine waves create motion, while a Gaussian pointer influence gives the lens its smooth falloff.

Animation uses `requestAnimationFrame` with a 60 FPS cap, adaptive vertical sampling and canvas resolution limits. Intersection and visibility observers stop work when the effect isn't visible, while Framer's static-render and reduced-motion hooks provide a still frame.

## 💛 Made by Karim Saif

Designed and developed with care for people who enjoy expressive, interactive interfaces.

- **Live demo:** https://opartstripes.framer.website/
- **X / Twitter:** https://x.com/karimsaif0
- **Email:** karimsaif010@gmail.com

Have feedback, a question, or a creative idea? Reach out!

---

<div align="center">

**Made with 💛 by Karim Saif**

*Make the web feel a little more alive.*

[Explore the Live Demo](https://opartstripes.framer.website/)

</div>
