export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  technologies: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  doodleAnnotation?: string;
}

export const projects: Project[] = [
  {
    id: 'reson',
    title: 'Reson',
    subtitle: 'Browser-Based Music Production App',
    description: [
      'Built a client-side audio engine on Tone.js supporting velocity-sensitive sample playback across a 32-pad grid, with a built-in sample browser and waveform editor for trimming/chopping.',
      'Integrated the Web MIDI API to map external MIDI controller input directly to pad triggers, translating note and velocity data in real time for hardware-driven performance.',
      'Persisted all projects locally via IndexedDB (Dexie) with a fully offline-capable PWA build, requiring no backend server.'
    ],
    technologies: ['React 19', 'TypeScript', 'Tone.js', 'Zustand', 'Dexie', 'Vite'],
    github: 'https://github.com/Zaid385/Reson',
    demo: 'https://reson-4nav.onrender.com',
    featured: true,
    doodleAnnotation: 'audio context + web midi!'
  },
  {
    id: 'tether',
    title: 'Tether',
    subtitle: 'Real-Time Messaging Application',
    description: [
      'Designed a custom JSON-over-TCP protocol with length-prefixed framing supporting 20+ packet types across auth, messaging, presence, and file transfer.',
      'Built a multi-threaded server with per-client threading and a PacketDispatcher routing packets to service handlers; secured auth with bcrypt and AES-128 Fernet.'
    ],
    technologies: ['Python', 'PySide6', 'MongoDB', 'TCP Sockets', 'bcrypt', 'Fernet'],
    github: 'https://github.com/Zaid385/Tether',
    featured: true,
    doodleAnnotation: 'raw sockets & custom protocol'
  },
  {
    id: 'audioflow',
    title: 'AudioFlow',
    subtitle: 'Full-Stack Music Streaming Web App',
    description: [
      'Built a dual-interface backend serving server-rendered EJS views (session auth) and a stateless REST API (JWT) from a single Express.js router.',
      'Implemented role-based access control (customer/admin) and a Cloudinary media pipeline with Multer and audio metadata parsing for a paginated, filterable song catalog.'
    ],
    technologies: ['TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT'],
    github: 'https://github.com/Zaid385/AudioFlow',
    demo: 'https://audioflow-4pg4.onrender.com'
  },
  {
    id: 'javafx-music',
    title: 'JavaFX Music Player',
    subtitle: 'Desktop Audio Application',
    description: [
      'Designed a layered OOP architecture (Player, PlaylistManager, Login, Register) with clean scene-switching and live metadata playback via MediaPlayer callbacks.'
    ],
    technologies: ['Java 23', 'JavaFX 24', 'FXML', 'SceneBuilder'],
    github: 'https://github.com/Zaid385/Music-Player'
  }
];
