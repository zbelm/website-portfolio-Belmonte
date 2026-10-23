/**
 * Every section is a "level" on the world map.
 * Order here = order on the page, the HUD nav and the side progress rail.
 * `id` must match the <section id="..."> of each section component.
 */
export const LEVELS = [
  { id: 'title', world: 'START', short: 'Start', name: 'Title Screen' },
  { id: 'about', world: '1-1', short: 'About', name: 'Character Select' },
  { id: 'projects', world: '1-2', short: 'Projects', name: 'Level Select' },
  { id: 'achievements', world: '1-3', short: 'Certs', name: 'Trophy Room' },
  { id: 'skills', world: '1-4', short: 'Skills', name: 'Skill Tree' },
  { id: 'quests', world: '2-1', short: 'Experience', name: 'Quest Log' },
  { id: 'stream', world: '2-2', short: 'Streams', name: 'Streamer Mode' },
  { id: 'contact', world: '2-3', short: 'Contact', name: 'Join My Party' },
];

export const SECTION_IDS = LEVELS.map((l) => l.id);

export const levelById = (id) => LEVELS.find((l) => l.id === id);
