
import { TagCategory, ThemeColor } from './types';

// Theme Configuration Map
export const THEMES: Record<ThemeColor, {
    bgApp: string;
    bgPanel: string;
    bgSoft: string; // Very light background
    textPrimary: string;
    textSecondary: string;
    border: string;
    borderStrong: string;
    buttonPrimary: string;
    buttonHover: string;
    ring: string;
    icon: string;
}> = {
    orange: {
        bgApp: 'bg-orange-50',
        bgPanel: 'bg-orange-100',
        bgSoft: 'bg-orange-50',
        textPrimary: 'text-orange-600',
        textSecondary: 'text-orange-800',
        border: 'border-orange-100',
        borderStrong: 'border-orange-500',
        buttonPrimary: 'bg-orange-500',
        buttonHover: 'hover:bg-orange-600',
        ring: 'focus:ring-orange-200',
        icon: 'text-orange-500'
    },
    blue: {
        bgApp: 'bg-blue-50',
        bgPanel: 'bg-blue-100',
        bgSoft: 'bg-blue-50',
        textPrimary: 'text-blue-600',
        textSecondary: 'text-blue-800',
        border: 'border-blue-100',
        borderStrong: 'border-blue-500',
        buttonPrimary: 'bg-blue-500',
        buttonHover: 'hover:bg-blue-600',
        ring: 'focus:ring-blue-200',
        icon: 'text-blue-500'
    },
    emerald: {
        bgApp: 'bg-emerald-50',
        bgPanel: 'bg-emerald-100',
        bgSoft: 'bg-emerald-50',
        textPrimary: 'text-emerald-600',
        textSecondary: 'text-emerald-800',
        border: 'border-emerald-100',
        borderStrong: 'border-emerald-500',
        buttonPrimary: 'bg-emerald-500',
        buttonHover: 'hover:bg-emerald-600',
        ring: 'focus:ring-emerald-200',
        icon: 'text-emerald-500'
    },
    violet: {
        bgApp: 'bg-violet-50',
        bgPanel: 'bg-violet-100',
        bgSoft: 'bg-violet-50',
        textPrimary: 'text-violet-600',
        textSecondary: 'text-violet-800',
        border: 'border-violet-100',
        borderStrong: 'border-violet-500',
        buttonPrimary: 'bg-violet-500',
        buttonHover: 'hover:bg-violet-600',
        ring: 'focus:ring-violet-200',
        icon: 'text-violet-500'
    },
    rose: {
        bgApp: 'bg-rose-50',
        bgPanel: 'bg-rose-100',
        bgSoft: 'bg-rose-50',
        textPrimary: 'text-rose-600',
        textSecondary: 'text-rose-800',
        border: 'border-rose-100',
        borderStrong: 'border-rose-500',
        buttonPrimary: 'bg-rose-500',
        buttonHover: 'hover:bg-rose-600',
        ring: 'focus:ring-rose-200',
        icon: 'text-rose-500'
    }
};

export const SUNO_TAGS: TagCategory[] = [
    {
        name: "Structure",
        tags: [
            { label: "Intro", value: "[Intro]" },
            { label: "Verse", value: "[Verse]" },
            { label: "Pre-Chorus", value: "[Pre-Chorus]" },
            { label: "Chorus", value: "[Chorus]" },
            { label: "Post-Chorus", value: "[Post-Chorus]" },
            { label: "Bridge", value: "[Bridge]" },
            { label: "Interlude", value: "[Interlude]" },
            { label: "Outro", value: "[Outro]" },
            { label: "End", value: "[End]" },
            { label: "Hook", value: "[Hook]" },
            { label: "Drop", value: "[Drop]" },
            { label: "Break", value: "[Break]" },
        ]
    },
    {
        name: "Vocals",
        tags: [
            { label: "Male", value: "[Male Vocals]" },
            { label: "Female", value: "[Female Vocals]" },
            { label: "Duet", value: "[Duet]" },
            { label: "Choir", value: "[Choir]" },
            { label: "Whisper", value: "[Whisper]" },
            { label: "Rap", value: "[Rap]" },
            { label: "Scream", value: "[Scream]" },
            { label: "Spoken", value: "[Spoken Word]" },
            { label: "Autotune", value: "[Autotune]" },
        ]
    },
    {
        name: "Instruments",
        tags: [
            { label: "Instrumental", value: "[Instrumental]" },
            { label: "Guitar Solo", value: "[Guitar Solo]" },
            { label: "Piano Solo", value: "[Piano Solo]" },
            { label: "Bass Solo", value: "[Bass Solo]" },
            { label: "Drum Fill", value: "[Drum Fill]" },
            { label: "Synth Solo", value: "[Synth Solo]" },
            { label: "Acoustic", value: "[Acoustic]" },
            { label: "Orchestral", value: "[Orchestral]" },
        ]
    },
    {
        name: "Mood & Speed",
        tags: [
            { label: "Fast", value: "[Fast Tempo]" },
            { label: "Slow", value: "[Slow Tempo]" },
            { label: "Sad", value: "[Sad]" },
            { label: "Happy", value: "[Happy]" },
            { label: "Dark", value: "[Dark]" },
            { label: "Epic", value: "[Epic]" },
            { label: "Chill", value: "[Chill]" },
            { label: "Silence", value: "[Silence]" },
            { label: "Fade Out", value: "[Fade Out]" },
            { label: "Big Finish", value: "[Big Finish]" },
        ]
    }
];

export const VOCAL_TEXTURES = [
    "Edge Voice (Fry)", 
    "Whisper", 
    "Growl (Ganari)", 
    "Seductive", 
    "Sexy",
    "Anime Voice", 
    "Falsetto",
    "Powerful",
    "Mellow",
    "Husky",
    "Clear",
    "Robot/Autotune"
];

export const GENRES = [
    "Visual Kei",
    "J-Pop",
    "J-Rock",
    "Anime Song",
    "EDM",
    "City Pop",
    "Ballad",
    "Heavy Metal",
    "R&B",
    "Jazz",
    "Lo-Fi",
    "Hip Hop",
    "Vocaloid Style",
    "Electro Swing"
];

export const EMPHASIS_INSTRUMENTS = [
    "Piano",
    "Guitar",
    "Bass",
    "Slap Bass",
    "Drums",
    "Shamisen",
    "Human Beatbox", // Boipa
    "Koto",
    "Shakuhachi",
    "Xylophone",
    "Glockenspiel"
];
