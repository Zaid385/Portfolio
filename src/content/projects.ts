import { AssetRegistry } from '../assets/registry';

export interface ProjectRecord {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  repoUrl?: string;
  deploymentUrl?: string;
  icon: string;
  screenshots: string[];
  embeddable?: boolean;
  status?: 'deployed' | 'in-progress' | 'archived';
}

export const projectData: ProjectRecord[] = [
  {
    id: 'reson',
    name: 'Reson',
    shortDescription: 'Browser-Based Music Production App',
    longDescription: 'Built a client-side audio engine on Tone.js supporting velocity-sensitive sample playback across a 32-pad grid, with a built-in sample browser and waveform editor. Integrated Web MIDI API to map external MIDI controller input directly to pad triggers. Persisted locally via IndexedDB with a fully offline-capable PWA build.',
    techStack: ['React 19', 'TypeScript', 'Tone.js', 'Zustand', 'Dexie', 'Vite'],
    repoUrl: 'https://github.com/Zaid385/Reson',
    deploymentUrl: 'https://reson-4nav.onrender.com',
    icon: AssetRegistry.ICON_RESON,
    screenshots: [],
    embeddable: true,
    status: 'deployed'
  },
  {
    id: 'audioflow',
    name: 'AudioFlow',
    shortDescription: 'Full-Stack Music Streaming Web Application',
    longDescription: 'Built a dual-interface backend serving server-rendered EJS views (session auth) and a stateless REST API (JWT) from a single Express.js router. Implemented role-based access control and a Cloudinary media pipeline with Multer and audio metadata parsing for a paginated, filterable song catalog.',
    techStack: ['TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT'],
    repoUrl: 'https://github.com/Zaid385/AudioFlow',
    deploymentUrl: 'https://audioflow-4pg4.onrender.com',
    icon: AssetRegistry.ICON_AUDIOFLOW,
    screenshots: [],
    embeddable: true,
    status: 'deployed'
  },
  {
    id: 'tether',
    name: 'Tether',
    shortDescription: 'Real-Time Messaging Application',
    longDescription: 'Designed a custom JSON-over-TCP protocol with length-prefixed framing supporting 20+ packet types across auth, messaging, presence, and file transfer. Built a multi-threaded server with per-client threading and a PacketDispatcher routing packets to service handlers; secured auth with bcrypt and AES-128 Fernet.',
    techStack: ['Python', 'PySide6', 'MongoDB', 'TCP Sockets', 'bcrypt', 'Fernet'],
    repoUrl: 'https://github.com/Zaid385/Tether',
    icon: AssetRegistry.XP_COMMAND_PROMPT_ICON,
    screenshots: [],
    embeddable: false,
    status: 'deployed'
  },
  {
    id: 'javafx-music-player',
    name: 'JavaFX Music Player',
    shortDescription: 'Desktop Audio Application',
    longDescription: 'Designed a layered OOP architecture (Player, PlaylistManager, Login, Register) with clean scene-switching and live metadata playback via MediaPlayer callbacks.',
    techStack: ['Java 23', 'JavaFX 24', 'FXML', 'SceneBuilder'],
    repoUrl: 'https://github.com/Zaid385/Music-Player',
    icon: AssetRegistry.XP_FOLDER_ICON,
    screenshots: [],
    embeddable: false,
    status: 'deployed'
  }
];
