/**
 * Made with 💛 by Karim Saif
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

"use client"

import * as React from "react"
import {
    addPropertyControls,
    ControlType,
    useIsStaticRenderer,
    useReducedMotion,
} from "framer"

type Preset =
    | "classic"
    | "sunburst"
    | "monochrome"
    | "electric"
    | "mint"
    | "custom"

interface Props {
    preset: Preset
    color: string
    backgroundColor: string
    stripes: number
    speed: number
    waveIntensity: number
    waveFrequency: number
    lensSize: number
    lensStrength: number
    interactive: boolean
    paused: boolean
    style?: React.CSSProperties
}

const PRESETS: Record<
    Exclude<Preset, "custom">,
    { color: string; background: string }
> = {
    classic: { color: "#161616", background: "#FFD23F" },
    sunburst: { color: "#F84B20", background: "#FFE8C2" },
    monochrome: { color: "#101010", background: "#F4F4F0" },
    electric: { color: "#C6FF00", background: "#25115A" },
    mint: { color: "#123E37", background: "#B8F5D1" },
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))

const safeNumber = (
    value: number,
    fallback: number,
    min: number,
    max: number
) => clamp(Number.isFinite(value) ? value : fallback, min, max)

const MAX_DPR = 2
const MAX_DIMENSION = 4096
const MAX_PIXELS = 4_000_000
const FRAME_INTERVAL = 1000 / 60
const STATIC_PHASE = 0.65

export default function KarimSaifOpArtStripes(props: Props) {
    const {
        preset = "classic",
        color = "#161616",
        backgroundColor = "#FFD23F",
        stripes = 30,
        speed = 1,
        waveIntensity = 1,
        waveFrequency = 1,
        lensSize = 28,
        lensStrength = 50,
        interactive = true,
        paused = false,
        style,
    } = props

    const staticRenderer = useIsStaticRenderer()
    const reducedMotion = useReducedMotion()
    const hostRef = React.useRef<HTMLDivElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    const palette =
        preset === "custom"
            ? { color, background: backgroundColor }
            : PRESETS[preset] ?? PRESETS.classic

    const isStatic = staticRenderer || reducedMotion === true

    React.useEffect(() => {
        const host = hostRef.current
        const canvas = canvasRef.current
        if (!host || !canvas) return

        const ctx = canvas.getContext("2d", { alpha: false })
        if (!ctx) return

        const count = Math.round(safeNumber(stripes, 30, 4, 120))
        const rate = safeNumber(speed, 1, 0, 5)
        const intensity = safeNumber(waveIntensity, 1, 0, 4)
        const frequency = safeNumber(waveFrequency, 1, 0.1, 4)
        const lensScale = safeNumber(lensSize, 28, 5, 80) / 100
        const lensPower = safeNumber(lensStrength, 50, 0, 150) / 100

        let width = 0
        let height = 0
        let frame = 0
        let previous = 0
        let lastDraw = 0
        let elapsed = STATIC_PHASE
        let visible = true
        let pageVisible = !document.hidden
        let destroyed = false

        const pointer = { x: 0, y: 0, strength: 0, target: 0 }

        const canRun = () =>
            !destroyed &&
            !isStatic &&
            !paused &&
            visible &&
            pageVisible &&
            width > 0 &&
            height > 0

        const needsAnimation = () =>
            rate > 0 ||
            Math.abs(pointer.target - pointer.strength) > 0.001

        const draw = () => {
            if (destroyed || width <= 0 || height <= 0) return

            ctx.fillStyle = palette.background
            ctx.fillRect(0, 0, width, height)

            const band = width / count
            const amplitude = band * 1.3 * intensity
            const lens = Math.max(
                1,
                Math.min(width, height) * lensScale
            )
            const targetSegments = clamp(
                Math.round(height / 4),
                30,
                250
            )
            const step = height / targetSegments
            const top = -step
            const segments = targetSegments + 2
            const t = elapsed

            const shift = (x: number, y: number) => {
                const phase =
                    y * 0.017 * frequency +
                    x * 0.006 * frequency +
                    t * 1.1

                const modulation =
                    0.35 +
                    0.65 *
                        (0.5 +
                            0.5 *
                                Math.sin(
                                    x * 0.005 * frequency -
                                        t * 0.4
                                ))

                let displacement =
                    amplitude * Math.sin(phase) * modulation

                if (pointer.strength > 0.001) {
                    const dx = x + displacement - pointer.x
                    const dy = y - pointer.y
                    const distanceSquared = dx * dx + dy * dy
                    const influence = Math.exp(
                        -distanceSquared / (lens * lens)
                    )

                    displacement +=
                        dx *
                        lensPower *
                        pointer.strength *
                        influence
                }
                return displacement
            }

            ctx.beginPath()
            for (let k = -2; k < count + 2; k++) {
                const left = k * band
                const right = left + band * 0.5
                ctx.moveTo(left + shift(left, top), top)

                for (let i = 1; i <= segments; i++) {
                    const y = top + i * step
                    ctx.lineTo(left + shift(left, y), y)
                }

                for (let i = segments; i >= 0; i--) {
                    const y = top + i * step
                    ctx.lineTo(right + shift(right, y), y)
                }
                ctx.closePath()
            }

            ctx.fillStyle = palette.color
            ctx.fill()
        }

        const stop = () => {
            if (frame !== 0) {
                cancelAnimationFrame(frame)
                frame = 0
            }
        }

        const tick = (now: number) => {
            frame = 0
            if (!canRun()) return

            const frameDelta = now - lastDraw
            if (frameDelta < FRAME_INTERVAL - 1) {
                frame = requestAnimationFrame(tick)
                return
            }

            const delta = Math.min(
                Math.max((now - previous) / 1000, 0),
                0.05
            )

            previous = now
            lastDraw = now
            if (rate > 0) elapsed += delta * rate

            const easing = 1 - Math.exp(-delta * 12)
            pointer.strength +=
                (pointer.target - pointer.strength) * easing

            if (
                Math.abs(pointer.target - pointer.strength) <
                0.001
            ) {
                pointer.strength = pointer.target
            }

            draw()
            if (canRun() && needsAnimation()) {
                frame = requestAnimationFrame(tick)
            }
        }

        const start = () => {
            if (!canRun() || !needsAnimation() || frame !== 0) return
            previous = performance.now()
            lastDraw = previous - FRAME_INTERVAL
            frame = requestAnimationFrame(tick)
        }

        const update = () => {
            stop()
            if (destroyed) return
            if (isStatic) {
                elapsed = STATIC_PHASE
                pointer.target = 0
                pointer.strength = 0
            }
            if (paused) {
                pointer.target = 0
                pointer.strength = 0
            }
            draw()
            start()
        }

        const resize = () => {
            if (destroyed) return
            const rect = host.getBoundingClientRect()
            const nextWidth = Math.max(0, rect.width)
            const nextHeight = Math.max(0, rect.height)

            if (nextWidth <= 0 || nextHeight <= 0) {
                width = 0
                height = 0
                stop()
                return
            }

            const deviceDpr = clamp(
                window.devicePixelRatio || 1,
                1,
                MAX_DPR
            )

            const dimensionScale = Math.min(
                1,
                MAX_DIMENSION / (nextWidth * deviceDpr),
                MAX_DIMENSION / (nextHeight * deviceDpr)
            )

            const pixelScale = Math.min(
                1,
                Math.sqrt(
                    MAX_PIXELS /
                        (nextWidth *
                            nextHeight *
                            deviceDpr *
                            deviceDpr)
                )
            )

            const dpr =
                deviceDpr * Math.min(dimensionScale, pixelScale)

            const pixelWidth = Math.max(
                1,
                Math.round(nextWidth * dpr)
            )
            const pixelHeight = Math.max(
                1,
                Math.round(nextHeight * dpr)
            )

            const changed =
                canvas.width !== pixelWidth ||
                canvas.height !== pixelHeight

            width = nextWidth
            height = nextHeight

            if (changed) {
                canvas.width = pixelWidth
                canvas.height = pixelHeight
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            draw()
            start()
        }

        const move = (event: PointerEvent) => {
            if (
                !interactive ||
                isStatic ||
                paused ||
                !visible ||
                !pageVisible
            ) return

            const rect = host.getBoundingClientRect()
            pointer.x = event.clientX - rect.left
            pointer.y = event.clientY - rect.top
            pointer.target = 1
            start()
        }

        const leave = () => {
            pointer.target = 0
            start()
        }

        const onVisibility = () => {
            pageVisible = !document.hidden
            update()
        }

        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(resize)
                : null

        resizeObserver?.observe(host)

        const intersectionObserver =
            typeof IntersectionObserver !== "undefined"
                ? new IntersectionObserver(
                      (entries) => {
                          visible =
                              entries[0]?.isIntersecting ?? false
                          update()
                      },
                      { threshold: 0 }
                  )
                : null

        if (intersectionObserver) {
            intersectionObserver.observe(host)
        }

        host.addEventListener("pointermove", move, {
            passive: true,
        })
        host.addEventListener("pointerleave", leave)
        host.addEventListener("pointercancel", leave)
        document.addEventListener("visibilitychange", onVisibility)

        if (!resizeObserver) {
            window.addEventListener("resize", resize)
        }

        resize()
        update()

        return () => {
            destroyed = true
            stop()
            resizeObserver?.disconnect()
            intersectionObserver?.disconnect()
            host.removeEventListener("pointermove", move)
            host.removeEventListener("pointerleave", leave)
            host.removeEventListener("pointercancel", leave)
            document.removeEventListener("visibilitychange", onVisibility)
            if (!resizeObserver) {
                window.removeEventListener("resize", resize)
            }
        }
    }, [
        palette.color,
        palette.background,
        stripes,
        speed,
        waveIntensity,
        waveFrequency,
        lensSize,
        lensStrength,
        interactive,
        paused,
        isStatic,
    ])

    return (
        <div
            ref={hostRef}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
                isolation: "isolate",
                backgroundColor: palette.background,
            }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
        </div>
    )
}

addPropertyControls(KarimSaifOpArtStripes, {
    preset: {
        type: ControlType.Enum,
        title: "Preset",
        options: [
            "classic",
            "sunburst",
            "monochrome",
            "electric",
            "mint",
            "custom",
        ],
        optionTitles: [
            "Classic",
            "Sunburst",
            "Monochrome",
            "Electric",
            "Mint",
            "Custom",
        ],
        defaultValue: "classic",
        description:
            "Choose a ready-made optical art color palette or select Custom to define your own stripe and background colors.",
    },
    color: {
        type: ControlType.Color,
        title: "Stripe Color",
        defaultValue: "#161616",
        hidden: (props) => props.preset !== "custom",
        description:
            "Sets the color of the animated stripes when the Custom preset is selected.",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFD23F",
        hidden: (props) => props.preset !== "custom",
        description:
            "Sets the background color behind the stripes when using the Custom preset.",
    },
    stripes: {
        type: ControlType.Number,
        title: "Stripes",
        min: 4,
        max: 120,
        step: 1,
        defaultValue: 30,
        displayStepper: true,
        description:
            "Controls the number of vertical stripes across the component. Higher values create a denser optical pattern.",
    },
    speed: {
        type: ControlType.Number,
        title: "Speed",
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 1,
        description:
            "Adjusts the speed of the flowing wave animation. Set to zero to freeze the pattern while keeping pointer interaction available.",
    },
    waveIntensity: {
        type: ControlType.Number,
        title: "Wave Amount",
        min: 0,
        max: 4,
        step: 0.1,
        defaultValue: 1,
        description:
            "Controls how strongly the stripes bend, ripple, swell, and pinch as the waves move.",
    },
    waveFrequency: {
        type: ControlType.Number,
        title: "Wave Detail",
        min: 0.1,
        max: 4,
        step: 0.1,
        defaultValue: 1,
        description:
            "Adjusts the spatial frequency of the stripe waves. Higher values create tighter, more detailed ripples.",
    },
    lensSize: {
        type: ControlType.Number,
        title: "Lens Size",
        min: 5,
        max: 80,
        step: 1,
        defaultValue: 28,
        unit: "%",
        hidden: (props) => props.interactive === false,
        description:
            "Sets the radius of the pointer magnification area relative to the smaller component dimension.",
    },
    lensStrength: {
        type: ControlType.Number,
        title: "Lens Power",
        min: 0,
        max: 150,
        step: 5,
        defaultValue: 50,
        unit: "%",
        hidden: (props) => props.interactive === false,
        description:
            "Controls how strongly nearby stripe edges are pushed away from the pointer to create the magnifying effect.",
    },
    interactive: {
        type: ControlType.Boolean,
        title: "Interactive",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        description:
            "Enables the interactive magnifying lens that follows pointer movement and distorts nearby stripes.",
    },
    paused: {
        type: ControlType.Boolean,
        title: "Paused",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
        description:
            "Pauses automatic animation and removes pointer distortion, displaying a stable optical pattern.",
    },
})
