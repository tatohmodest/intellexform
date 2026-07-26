import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'oo-architecture',
    title: 'Object-Oriented Game Architecture',
    description:
      'Structure a Pygame project with clear classes for the game loop, entities, and systems so features stay easy to extend.',
    level: 'advanced',
    section: 'Architecture',
    order: 49,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'As a Pygame project grows past a single file, unstructured code becomes hard to change. Object-oriented architecture keeps responsibilities separated: the app owns the window and loop, scenes own screens of gameplay, and entities own their own update and draw logic.',
      },
      {
        type: 'p',
        text: 'You do not need a heavy framework. A small set of classes with clear methods is enough for most 2D games.',
      },
      { type: 'h2', text: 'A thin application shell' },
      {
        type: 'p',
        text: 'Start with a Game class that owns the display, clock, running flag, and the active scene. Keep pygame.init and the main loop here so every scene can focus on gameplay.',
      },
      {
        type: 'code',
        title: 'Minimal Game shell',
        language: 'python',
        code: `import pygame


class Game:
    def __init__(self, width=960, height=540, title="My Game"):
        pygame.init()
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption(title)
        self.clock = pygame.time.Clock()
        self.running = True
        self.scene = None

    def set_scene(self, scene):
        self.scene = scene
        if hasattr(scene, "on_enter"):
            scene.on_enter()

    def run(self, fps=60):
        while self.running:
            dt = self.clock.tick(fps) / 1000.0
            events = pygame.event.get()
            for event in events:
                if event.type == pygame.QUIT:
                    self.running = False
            if self.scene:
                self.scene.handle_events(events)
                self.scene.update(dt)
                self.scene.draw(self.screen)
            pygame.display.flip()
        pygame.quit()`,
      },
      { type: 'h2', text: 'Entity classes with update and draw' },
      {
        type: 'p',
        text: 'Each interactive object should own its state and expose update(dt) and draw(surface). Pass time as a float in seconds so movement stays frame-rate independent.',
      },
      {
        type: 'code',
        title: 'Player entity',
        language: 'python',
        code: `import pygame


class Player:
    def __init__(self, x, y):
        self.image = pygame.Surface((32, 48))
        self.image.fill((80, 180, 255))
        self.rect = self.image.get_rect(midbottom=(x, y))
        self.velocity = pygame.Vector2(0, 0)
        self.speed = 220

    def handle_input(self, keys):
        direction = pygame.Vector2(0, 0)
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            direction.x -= 1
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            direction.x += 1
        if direction.length_squared() > 0:
            direction = direction.normalize()
        self.velocity = direction * self.speed

    def update(self, dt):
        self.rect.x += int(self.velocity.x * dt)
        self.rect.y += int(self.velocity.y * dt)

    def draw(self, surface):
        surface.blit(self.image, self.rect)`,
      },
      { type: 'h2', text: 'Composition over deep inheritance' },
      {
        type: 'p',
        text: 'Prefer small classes that work together. A sprite can hold a health component, a collider, and a renderer without forcing every enemy into one giant base class.',
      },
      {
        type: 'ul',
        items: [
          'Game owns window, clock, and scene switching',
          'Scene owns lists of entities and local rules',
          'Entity owns position, state, update, and draw',
          'Helpers own math, collision, and loading',
        ],
      },
      {
        type: 'table',
        headers: ['Class', 'Owns', 'Avoid putting here'],
        rows: [
          ['Game', 'Display, loop, scene pointer', 'Enemy AI details'],
          ['Scene', 'Level state and entity lists', 'pygame.init'],
          ['Player', 'Input mapping and movement', 'Menu navigation'],
          ['Resource cache', 'Images and sounds', 'Gameplay scoring'],
        ],
      },
      {
        type: 'tip',
        text: 'If a method needs more than a few unrelated pieces of state, that is a signal to split the class.',
      },
      {
        type: 'try',
        text: 'Refactor a single-file Pygame prototype into Game, PlayScene, and Player classes. Keep behavior identical, then add a pause toggle in the scene only.',
      },
      {
        type: 'keypoints',
        items: [
          'A thin Game shell owns the loop and display.',
          'Entities expose update(dt) and draw(surface).',
          'Prefer composition and clear ownership over deep inheritance.',
          'Frame-rate independent movement uses delta time in seconds.',
        ],
      },
    ],
  },
  {
    slug: 'scene-manager',
    title: 'Scene Manager Pattern',
    description:
      'Switch between menu, play, pause, and game-over screens cleanly with a scene stack and lifecycle hooks.',
    level: 'advanced',
    section: 'Architecture',
    order: 50,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Most games are a sequence of screens. A scene manager keeps only one active scene drawing and updating, while still allowing pause overlays or temporary transitions.',
      },
      {
        type: 'p',
        text: 'Each scene implements the same small interface: handle_events, update, draw, plus optional on_enter and on_exit hooks.',
      },
      { type: 'h2', text: 'Shared scene base' },
      {
        type: 'code',
        title: 'Scene protocol as a base class',
        language: 'python',
        code: `class Scene:
    def __init__(self, manager):
        self.manager = manager

    def on_enter(self):
        pass

    def on_exit(self):
        pass

    def handle_events(self, events):
        pass

    def update(self, dt):
        pass

    def draw(self, surface):
        pass`,
      },
      { type: 'h2', text: 'A stack-based manager' },
      {
        type: 'p',
        text: 'A stack lets you push a pause scene over gameplay and pop back without rebuilding the level. Replace clears the stack when you want a hard switch, such as menu to play.',
      },
      {
        type: 'code',
        title: 'SceneManager with push, pop, and replace',
        language: 'python',
        code: `class SceneManager:
    def __init__(self):
        self.stack = []

    @property
    def current(self):
        return self.stack[-1] if self.stack else None

    def push(self, scene):
        if self.current:
            self.current.on_exit()
        self.stack.append(scene)
        scene.on_enter()

    def pop(self):
        if not self.stack:
            return
        old = self.stack.pop()
        old.on_exit()
        if self.current:
            self.current.on_enter()

    def replace(self, scene):
        while self.stack:
            self.pop()
        self.push(scene)

    def handle_events(self, events):
        if self.current:
            self.current.handle_events(events)

    def update(self, dt):
        if self.current:
            self.current.update(dt)

    def draw(self, surface):
        if self.current:
            self.current.draw(surface)`,
      },
      { type: 'h2', text: 'Concrete menu and play scenes' },
      {
        type: 'code',
        title: 'Switching from menu into gameplay',
        language: 'python',
        code: `import pygame


class MenuScene(Scene):
    def handle_events(self, events):
        for event in events:
            if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN:
                self.manager.replace(PlayScene(self.manager))

    def draw(self, surface):
        surface.fill((18, 22, 30))
        font = pygame.font.SysFont(None, 48)
        label = font.render("Press Enter to Play", True, (240, 240, 240))
        surface.blit(label, label.get_rect(center=surface.get_rect().center))


class PlayScene(Scene):
    def on_enter(self):
        self.player = Player(480, 500)

    def handle_events(self, events):
        for event in events:
            if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                self.manager.push(PauseScene(self.manager))

    def update(self, dt):
        keys = pygame.key.get_pressed()
        self.player.handle_input(keys)
        self.player.update(dt)

    def draw(self, surface):
        surface.fill((30, 40, 55))
        self.player.draw(surface)`,
      },
      {
        type: 'note',
        text: 'When drawing a pause overlay, either redraw the play scene underneath first or keep a frozen snapshot surface created when pause was pushed.',
      },
      {
        type: 'warning',
        text: 'Do not create a new PlayScene on every frame. Scene creation belongs in transitions only.',
      },
      {
        type: 'try',
        text: 'Add MenuScene, PlayScene, PauseScene, and GameOverScene. From game over, Enter should replace the stack with a fresh PlayScene.',
      },
      {
        type: 'keypoints',
        items: [
          'Scenes share a small interface for events, update, and draw.',
          'A stack supports overlays like pause without losing play state.',
          'replace is for hard transitions; push and pop are for temporary screens.',
          'Lifecycle hooks are the right place to load or reset local state.',
        ],
      },
    ],
  },
  {
    slug: 'resource-manager',
    title: 'Resource Manager',
    description:
      'Cache images, sounds, and fonts so assets load once, fail clearly, and stay easy to reload during development.',
    level: 'advanced',
    section: 'Architecture',
    order: 51,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Calling pygame.image.load inside gameplay code causes repeated disk access, harder testing, and duplicated convert_alpha work. A resource manager loads each asset once and returns the cached object on later requests.',
      },
      { type: 'h2', text: 'Central asset cache' },
      {
        type: 'code',
        title: 'ResourceManager for images, sounds, and fonts',
        language: 'python',
        code: `from pathlib import Path

import pygame


class ResourceManager:
    def __init__(self, root="assets"):
        self.root = Path(root)
        self.images = {}
        self.sounds = {}
        self.fonts = {}

    def image(self, relative_path, alpha=True):
        key = (relative_path, alpha)
        if key not in self.images:
            path = self.root / relative_path
            surface = pygame.image.load(path.as_posix())
            self.images[key] = surface.convert_alpha() if alpha else surface.convert()
        return self.images[key]

    def sound(self, relative_path):
        if relative_path not in self.sounds:
            path = self.root / relative_path
            self.sounds[relative_path] = pygame.mixer.Sound(path.as_posix())
        return self.sounds[relative_path]

    def font(self, relative_path, size):
        key = (relative_path, size)
        if key not in self.fonts:
            if relative_path is None:
                self.fonts[key] = pygame.font.SysFont(None, size)
            else:
                path = self.root / relative_path
                self.fonts[key] = pygame.font.Font(path.as_posix(), size)
        return self.fonts[key]

    def clear(self):
        self.images.clear()
        self.sounds.clear()
        self.fonts.clear()`,
      },
      { type: 'h2', text: 'Use convert and convert_alpha once' },
      {
        type: 'p',
        text: 'Surfaces straight from disk are often slower to blit. convert matches the display format for opaque art. convert_alpha keeps per-pixel alpha for sprites with transparency. Do this at load time inside the manager.',
      },
      {
        type: 'code',
        title: 'Loading through the manager in a scene',
        language: 'python',
        code: `class PlayScene(Scene):
    def on_enter(self):
        assets = self.manager.game.assets
        self.ship = assets.image("sprites/ship.png")
        self.laser = assets.sound("sfx/laser.wav")
        self.hud_font = assets.font("fonts/ui.ttf", 24)

    def fire(self):
        self.laser.play()`,
      },
      { type: 'h2', text: 'Fail fast with clear paths' },
      {
        type: 'p',
        text: 'Missing assets should raise a readable error during load, not appear as blank sprites mid-game. Keep a consistent folder layout such as assets/sprites, assets/sfx, and assets/fonts.',
      },
      {
        type: 'table',
        headers: ['Asset type', 'Pygame API', 'Cache tip'],
        rows: [
          ['Image', 'pygame.image.load', 'convert or convert_alpha once'],
          ['Sound', 'pygame.mixer.Sound', 'Reuse Sound objects; do not reload per shot'],
          ['Music', 'pygame.mixer.music.load', 'Stream one track; stop or fade before switching'],
          ['Font', 'pygame.font.Font', 'Cache by (path, size) pair'],
        ],
      },
      {
        type: 'tip',
        text: 'During development, add a hot-reload key that calls clear() and then reloads the current scene assets.',
      },
      {
        type: 'try',
        text: 'Wrap all image and sound loading behind ResourceManager. Verify that firing 100 lasers still uses one Sound instance.',
      },
      {
        type: 'keypoints',
        items: [
          'Load each asset once and cache it by a stable key.',
          'Convert surfaces at load time for faster blits.',
          'Keep asset paths consistent and fail early when files are missing.',
          'Scenes should request assets, not own loading details.',
        ],
      },
    ],
  },
  {
    slug: 'entity-components',
    title: 'Lightweight Entity Components',
    description:
      'Compose game objects from small data and behavior pieces without adopting a full ECS framework.',
    level: 'advanced',
    section: 'Architecture',
    order: 52,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'A full entity-component-system framework is often more than a Pygame project needs. A lightweight approach still pays off: store entities as simple containers and attach reusable components for transform, health, sprites, and timers.',
      },
      { type: 'h2', text: 'Entity as a component bag' },
      {
        type: 'code',
        title: 'Simple entity and component helpers',
        language: 'python',
        code: `class Entity:
    def __init__(self, name="entity"):
        self.name = name
        self.components = {}
        self.alive = True

    def add(self, component):
        self.components[type(component)] = component
        component.entity = self
        return self

    def get(self, component_type):
        return self.components.get(component_type)

    def has(self, component_type):
        return component_type in self.components


class Transform:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y


class Health:
    def __init__(self, maximum):
        self.maximum = maximum
        self.current = maximum

    def damage(self, amount):
        self.current = max(0, self.current - amount)
        if self.current == 0:
            self.entity.alive = False


class Sprite:
    def __init__(self, image):
        self.image = image`,
      },
      { type: 'h2', text: 'Systems operate on matching entities' },
      {
        type: 'p',
        text: 'Instead of giant update methods on every subclass, write small systems that loop entities and act when required components exist.',
      },
      {
        type: 'code',
        title: 'Movement and render systems',
        language: 'python',
        code: `import pygame


class Velocity:
    def __init__(self, vx=0, vy=0):
        self.vx = vx
        self.vy = vy


def move_system(entities, dt):
    for entity in entities:
        transform = entity.get(Transform)
        velocity = entity.get(Velocity)
        if transform and velocity:
            transform.x += velocity.vx * dt
            transform.y += velocity.vy * dt


def render_system(entities, surface):
    for entity in entities:
        transform = entity.get(Transform)
        sprite = entity.get(Sprite)
        if transform and sprite:
            surface.blit(sprite.image, (transform.x, transform.y))


def cleanup_system(entities):
    return [entity for entity in entities if entity.alive]`,
      },
      { type: 'h2', text: 'Spawn with factory functions' },
      {
        type: 'code',
        title: 'Factory for a bullet entity',
        language: 'python',
        code: `def create_bullet(assets, x, y):
    return (
        Entity("bullet")
        .add(Transform(x, y))
        .add(Velocity(0, -420))
        .add(Sprite(assets.image("sprites/bullet.png")))
        .add(Health(1))
    )`,
      },
      {
        type: 'ul',
        items: [
          'Components hold data and tiny helpers',
          'Systems hold shared behavior loops',
          'Factories assemble common entity recipes',
          'Scenes own the entity list and call systems in order',
        ],
      },
      {
        type: 'note',
        text: 'You can still use pygame.sprite.Sprite for drawing and collision groups. Treat that as one component style, not a requirement for every object.',
      },
      {
        type: 'try',
        text: 'Rebuild one enemy type as Transform, Velocity, Health, and Sprite components. Add a damage_system that removes entities when health hits zero.',
      },
      {
        type: 'keypoints',
        items: [
          'Lightweight components keep data reusable across entity types.',
          'Systems apply behavior to entities that match needed components.',
          'Factories make spawning consistent and readable.',
          'You do not need a full ECS library to get composition benefits.',
        ],
      },
    ],
  },
  {
    slug: 'data-driven-design',
    title: 'Data-Driven Design',
    description:
      'Move tuning values, spawn tables, and level layouts into data files so design changes do not require rewriting code.',
    level: 'advanced',
    section: 'Architecture',
    order: 53,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Hard-coded constants scattered through classes make balancing painful. Data-driven design stores stats, waves, and layout in JSON or similar files, then code reads that data to build content.',
      },
      { type: 'h2', text: 'Keep code generic and data specific' },
      {
        type: 'code',
        title: 'enemies.json tuning table',
        language: 'python',
        code: `# Example contents of assets/data/enemies.json
# {
#   "scout": {"hp": 3, "speed": 140, "score": 100, "sprite": "sprites/scout.png"},
#   "tank":  {"hp": 12, "speed": 60, "score": 250, "sprite": "sprites/tank.png"}
# }`,
      },
      {
        type: 'code',
        title: 'Loading definitions and spawning from data',
        language: 'python',
        code: `import json
from pathlib import Path


def load_enemy_defs(path="assets/data/enemies.json"):
    with Path(path).open(encoding="utf-8") as handle:
        return json.load(handle)


def spawn_enemy(defs, kind, assets, x, y):
    data = defs[kind]
    entity = Entity(kind)
    entity.add(Transform(x, y))
    entity.add(Velocity(0, data["speed"]))
    entity.add(Health(data["hp"]))
    entity.add(Sprite(assets.image(data["sprite"])))
    entity.score = data["score"]
    return entity`,
      },
      { type: 'h2', text: 'Wave and level files' },
      {
        type: 'p',
        text: 'Levels can be grids of tiles, lists of spawn events, or both. Event lists are excellent for shooters and endless runners because designers can change timing without touching Python.',
      },
      {
        type: 'code',
        title: 'Wave timeline driven by data',
        language: 'python',
        code: `class WaveController:
    def __init__(self, waves, spawn_func):
        self.waves = waves
        self.spawn_func = spawn_func
        self.wave_index = 0
        self.elapsed = 0.0
        self.spawned = set()

    def update(self, dt):
        if self.wave_index >= len(self.waves):
            return
        wave = self.waves[self.wave_index]
        self.elapsed += dt
        for index, event in enumerate(wave["events"]):
            key = (self.wave_index, index)
            if key in self.spawned:
                continue
            if self.elapsed >= event["time"]:
                self.spawn_func(event["enemy"], event["x"], event["y"])
                self.spawned.add(key)
        if len(self.spawned) >= len(wave["events"]) and wave.get("auto_next", True):
            self.wave_index += 1
            self.elapsed = 0.0
            self.spawned.clear()`,
      },
      {
        type: 'table',
        headers: ['Put in data', 'Keep in code'],
        rows: [
          ['HP, speed, score, damage', 'Collision response algorithms'],
          ['Wave timing and enemy kinds', 'Scene manager and input handling'],
          ['Tile map symbols', 'Tile rendering and physics rules'],
          ['UI label strings', 'Layout anchoring logic'],
        ],
      },
      {
        type: 'warning',
        text: 'Validate data on load. A missing sprite key or negative HP should fail with a clear message before the level starts.',
      },
      {
        type: 'try',
        text: 'Extract enemy stats into JSON and change balance without editing class constructors. Add a simple schema check for required keys.',
      },
      {
        type: 'keypoints',
        items: [
          'Data files hold tuning and content; code holds behavior.',
          'Factories should build entities from definitions.',
          'Wave timelines are a natural fit for data-driven spawning.',
          'Validate content early so bad data fails at load time.',
        ],
      },
    ],
  },
  {
    slug: 'particle-systems',
    title: 'Particle Systems',
    description:
      'Add juice with lightweight particle bursts for explosions, thrusters, dust, and pickups.',
    level: 'advanced',
    section: 'Polish & Performance',
    order: 54,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Particles are short-lived visual fragments. A simple system can make hits, landings, and thrusters feel responsive without complex animation pipelines.',
      },
      { type: 'h2', text: 'Particle data and emitter' },
      {
        type: 'code',
        title: 'CPU particle system',
        language: 'python',
        code: `import random
import pygame


class Particle:
    __slots__ = ("pos", "vel", "life", "max_life", "size", "color")

    def __init__(self, pos, vel, life, size, color):
        self.pos = pygame.Vector2(pos)
        self.vel = pygame.Vector2(vel)
        self.life = life
        self.max_life = life
        self.size = size
        self.color = color


class ParticleSystem:
    def __init__(self):
        self.particles = []

    def emit(self, origin, count, color, speed=80, life=0.4, size=3):
        for _ in range(count):
            angle = random.uniform(0, 360)
            magnitude = random.uniform(speed * 0.3, speed)
            velocity = pygame.Vector2(magnitude, 0).rotate(angle)
            self.particles.append(
                Particle(origin, velocity, random.uniform(life * 0.5, life), size, color)
            )

    def update(self, dt):
        alive = []
        for particle in self.particles:
            particle.life -= dt
            if particle.life <= 0:
                continue
            particle.vel *= 0.92
            particle.pos += particle.vel * dt
            alive.append(particle)
        self.particles = alive

    def draw(self, surface):
        for particle in self.particles:
            alpha_factor = particle.life / particle.max_life
            color = tuple(max(0, min(255, int(c * alpha_factor))) for c in particle.color)
            pygame.draw.circle(
                surface,
                color,
                (int(particle.pos.x), int(particle.pos.y)),
                max(1, int(particle.size * alpha_factor)),
            )`,
      },
      { type: 'h2', text: 'Hook particles into gameplay events' },
      {
        type: 'code',
        title: 'Burst on enemy death',
        language: 'python',
        code: `def destroy_enemy(scene, enemy):
    transform = enemy.get(Transform)
    scene.particles.emit(
        (transform.x, transform.y),
        count=18,
        color=(255, 180, 60),
        speed=160,
        life=0.5,
        size=4,
    )
    enemy.alive = False`,
      },
      {
        type: 'tip',
        text: 'Use __slots__ or compact tuples if you spawn hundreds of particles. Drawing filled circles is fine for small counts; switch to blitting a tiny cached surface when counts grow.',
      },
      {
        type: 'ul',
        items: [
          'Emit on events: hit, death, jump land, pickup',
          'Shrink and fade over lifetime',
          'Apply drag so bursts settle quickly',
          'Cap particle count to protect frame time',
        ],
      },
      {
        type: 'warning',
        text: 'Avoid allocating new Surface objects per particle each frame. Reuse draw primitives or pre-made spark images.',
      },
      {
        type: 'try',
        text: 'Add thruster particles behind the player ship that emit only while a thrust key is held.',
      },
      {
        type: 'keypoints',
        items: [
          'Particles are short-lived objects with position, velocity, and life.',
          'Emit from gameplay events for readable feedback.',
          'Update with drag and fade for natural motion.',
          'Keep allocations and draw cost under control.',
        ],
      },
    ],
  },
  {
    slug: 'scaled-pixel-art',
    title: 'Scaled Pixel Art Display',
    description:
      'Render to a low-resolution internal surface and scale it up for crisp pixel art on modern displays.',
    level: 'advanced',
    section: 'Polish & Performance',
    order: 55,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Pixel art looks best when game logic draws to a small surface, such as 320x180, then that surface is scaled to the window. This keeps sprite sizes simple and avoids muddy stretched assets.',
      },
      { type: 'h2', text: 'Virtual resolution pipeline' },
      {
        type: 'code',
        title: 'Integer scale to a window',
        language: 'python',
        code: `import pygame


class PixelGame:
    def __init__(self):
        pygame.init()
        self.virtual_size = (320, 180)
        self.window_size = (1280, 720)
        self.window = pygame.display.set_mode(self.window_size)
        self.canvas = pygame.Surface(self.virtual_size)
        self.clock = pygame.time.Clock()
        self.running = True

    def blit_scaled(self):
        scale_x = self.window_size[0] // self.virtual_size[0]
        scale_y = self.window_size[1] // self.virtual_size[1]
        scale = min(scale_x, scale_y)
        size = (self.virtual_size[0] * scale, self.virtual_size[1] * scale)
        frame = pygame.transform.scale(self.canvas, size)
        self.window.fill((0, 0, 0))
        dest = frame.get_rect(center=self.window.get_rect().center)
        self.window.blit(frame, dest)

    def run(self, scene):
        while self.running:
            dt = self.clock.tick(60) / 1000.0
            events = pygame.event.get()
            for event in events:
                if event.type == pygame.QUIT:
                    self.running = False
            scene.handle_events(events)
            scene.update(dt)
            scene.draw(self.canvas)
            self.blit_scaled()
            pygame.display.flip()
        pygame.quit()`,
      },
      { type: 'h2', text: 'Map mouse coordinates correctly' },
      {
        type: 'p',
        text: 'If you scale the canvas, mouse positions from the window are not canvas positions. Convert them before hit-testing UI or aiming.',
      },
      {
        type: 'code',
        title: 'Window point to canvas point',
        language: 'python',
        code: `def window_to_canvas(pos, window_size, virtual_size):
    scale = min(window_size[0] // virtual_size[0], window_size[1] // virtual_size[1])
    frame_w = virtual_size[0] * scale
    frame_h = virtual_size[1] * scale
    offset_x = (window_size[0] - frame_w) // 2
    offset_y = (window_size[1] - frame_h) // 2
    x = (pos[0] - offset_x) / scale
    y = (pos[1] - offset_y) / scale
    return x, y`,
      },
      {
        type: 'tip',
        text: 'Prefer integer scaling when you want sharp pixels. Non-integer scaling can introduce blur unless you use a nearest-neighbor scale path consistently.',
      },
      {
        type: 'note',
        text: 'pygame.transform.scale is commonly used here. For sharper control with newer builds, check nearest-neighbor options available in your installed Pygame version.',
      },
      {
        type: 'try',
        text: 'Draw your whole play scene to a 320x180 canvas and scale to 1280x720. Confirm mouse clicks on a button still land on the intended rect.',
      },
      {
        type: 'keypoints',
        items: [
          'Draw gameplay to a low-resolution canvas.',
          'Scale the canvas to the window once per frame.',
          'Integer scales keep pixel art crisp.',
          'Convert mouse coordinates when using a scaled view.',
        ],
      },
    ],
  },
  {
    slug: 'performance-tips',
    title: 'Performance Tips',
    description:
      'Keep frame rates stable with smarter blits, fewer allocations, group collision choices, and careful surface use.',
    level: 'advanced',
    section: 'Polish & Performance',
    order: 56,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Most Pygame slowdowns come from doing too much per frame: loading assets repeatedly, creating surfaces in tight loops, overdrawing, or using expensive collision checks. Measure first, then apply the cheapest fix that solves the bottleneck.',
      },
      { type: 'h2', text: 'High-impact habits' },
      {
        type: 'ul',
        items: [
          'Load and convert assets once',
          'Avoid Surface and Font creation inside update or draw',
          'Use dirty rects or layered draw only when needed',
          'Cull off-screen sprites before expensive work',
          'Prefer pygame.sprite.Groupcollide for batch checks',
        ],
      },
      {
        type: 'code',
        title: 'Cache fonts and HUD surfaces',
        language: 'python',
        code: `class HUD:
    def __init__(self, font):
        self.font = font
        self._score = None
        self._score_surf = None

    def set_score(self, score):
        if score == self._score:
            return
        self._score = score
        self._score_surf = self.font.render(f"Score: {score}", True, (255, 255, 255))

    def draw(self, surface):
        if self._score_surf:
            surface.blit(self._score_surf, (12, 12))`,
      },
      { type: 'h2', text: 'Collision cost control' },
      {
        type: 'code',
        title: 'Batch collisions with sprite groups',
        language: 'python',
        code: `import pygame


def resolve_bullet_hits(bullets, enemies):
    hits = pygame.sprite.groupcollide(bullets, enemies, True, False)
    for bullet, targets in hits.items():
        for enemy in targets:
            enemy.health -= bullet.damage
            if enemy.health <= 0:
                enemy.kill()`,
      },
      {
        type: 'table',
        headers: ['Symptom', 'Likely cause', 'Fix'],
        rows: [
          ['FPS drops when scoring', 'Font.render every frame', 'Cache until value changes'],
          ['Hitch on first shot', 'Sound loaded on fire', 'Preload in resource manager'],
          ['FPS falls with many enemies', 'O(n^2) nested loops', 'Use groups or spatial buckets'],
          ['Blurry or slow scaling', 'Scaling whole screen poorly', 'Integer scale from a small canvas'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not optimize blindly. A micro-optimization that hurts readability is wasted if draw calls or asset loading are the real cost.',
      },
      {
        type: 'try',
        text: 'Spawn 200 enemies and profile your collision loop. Replace nested rect checks with groupcollide and compare FPS.',
      },
      {
        type: 'keypoints',
        items: [
          'Create expensive objects outside the hot loop.',
          'Cache rendered text and reused surfaces.',
          'Use batch collision helpers for large sets.',
          'Optimize after identifying the actual bottleneck.',
        ],
      },
    ],
  },
  {
    slug: 'profiling-games',
    title: 'Profiling Your Game',
    description:
      'Find real bottlenecks with timing probes, cProfile, and simple on-screen frame metrics.',
    level: 'advanced',
    section: 'Polish & Performance',
    order: 57,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Profiling answers a focused question: where does this frame spend its time? Guessing leads to wasted refactors. Short timers around update, collision, and draw phases reveal the truth quickly.',
      },
      { type: 'h2', text: 'Section timers in the game loop' },
      {
        type: 'code',
        title: 'Measure update vs draw cost',
        language: 'python',
        code: `import time
import pygame


def run_with_timers(game, scene, fps=60):
    clock = pygame.time.Clock()
    font = pygame.font.SysFont(None, 24)
    while game.running:
        dt = clock.tick(fps) / 1000.0
        events = pygame.event.get()
        for event in events:
            if event.type == pygame.QUIT:
                game.running = False

        t0 = time.perf_counter()
        scene.handle_events(events)
        scene.update(dt)
        t1 = time.perf_counter()
        scene.draw(game.screen)
        t2 = time.perf_counter()

        update_ms = (t1 - t0) * 1000
        draw_ms = (t2 - t1) * 1000
        label = font.render(
            f"update {update_ms:.2f} ms  draw {draw_ms:.2f} ms  fps {clock.get_fps():.0f}",
            True,
            (255, 255, 0),
        )
        game.screen.blit(label, (8, 8))
        pygame.display.flip()`,
      },
      { type: 'h2', text: 'cProfile for deeper investigation' },
      {
        type: 'code',
        title: 'Profile a short play session',
        language: 'python',
        code: `import cProfile
import pstats
from pstats import SortKey


def profile_game(main_callable, seconds=10):
    profiler = cProfile.Profile()
    profiler.enable()
    main_callable(seconds)
    profiler.disable()
    stats = pstats.Stats(profiler).sort_stats(SortKey.CUMULATIVE)
    stats.print_stats(30)`,
      },
      {
        type: 'note',
        text: 'Profile a release-like build with the same resolution and asset settings you ship. Debug overlays and logging can distort timings.',
      },
      {
        type: 'ol',
        items: [
          'Confirm FPS or frame time is actually bad',
          'Split update and draw timings',
          'Zoom into the slower side with cProfile',
          'Change one thing, then measure again',
        ],
      },
      {
        type: 'try',
        text: 'Add on-screen update and draw timers. Intentionally create a new font every frame, watch draw time spike, then cache the font and confirm the fix.',
      },
      {
        type: 'keypoints',
        items: [
          'Use perf_counter around major loop phases.',
          'Show FPS and section timings while tuning.',
          'cProfile helps find expensive functions.',
          'Measure, change one variable, measure again.',
        ],
      },
    ],
  },
  {
    slug: 'packaging-distribute',
    title: 'Packaging and Distributing',
    description:
      'Bundle a Pygame project into a shareable build with PyInstaller, clean assets, and a short run checklist.',
    level: 'advanced',
    section: 'Polish & Performance',
    order: 58,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Players should not need your development environment. Packaging freezes your Python code, dependencies, and assets into an executable or folder they can run.',
      },
      { type: 'h2', text: 'Prepare the project for freezing' },
      {
        type: 'ul',
        items: [
          'Use a single entry script such as main.py',
          'Keep assets outside package internals when possible',
          'Avoid relying on the current working directory alone',
          'Test a clean virtual environment before packaging',
        ],
      },
      {
        type: 'code',
        title: 'Resolve asset paths for frozen builds',
        language: 'python',
        code: `import sys
from pathlib import Path


def resource_path(*parts):
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
    return base.joinpath(*parts)


ship = resource_path("assets", "sprites", "ship.png")`,
      },
      { type: 'h2', text: 'PyInstaller one-folder build' },
      {
        type: 'code',
        title: 'Common packaging commands',
        language: 'python',
        code: `# In a terminal, from your project root:
# pip install pyinstaller
# pyinstaller --noconfirm --clean --name SpaceRun main.py
#
# Include assets explicitly if needed:
# pyinstaller --noconfirm --clean --name SpaceRun \\
#   --add-data "assets:assets" main.py
#
# On Windows the add-data separator is ";" instead of ":"`,
      },
      {
        type: 'p',
        text: 'One-folder builds are easier to debug than one-file builds. Start there, confirm assets and audio work, then consider one-file if you truly need a single binary.',
      },
      {
        type: 'table',
        headers: ['Checklist item', 'Why it matters'],
        rows: [
          ['Fresh venv install of requirements', 'Catches missing dependencies early'],
          ['Run packaged build on another machine', 'Surfaces path and driver issues'],
          ['Confirm audio device startup', 'Mixer init can fail quietly in some setups'],
          ['Ship a README with controls', 'Players need a short how-to-play note'],
        ],
      },
      {
        type: 'warning',
        text: 'Antivirus tools sometimes flag unsigned frozen Python apps. For wider distribution, document this and consider code signing when you are ready.',
      },
      {
        type: 'try',
        text: 'Package a small Pygame demo with assets, copy the dist folder to a clean location, and run it without your source tree available.',
      },
      {
        type: 'keypoints',
        items: [
          'Entry-point scripts and stable asset paths make packaging smoother.',
          'PyInstaller can bundle code and assets into shareable builds.',
          'Test the packaged output outside your development folder.',
          'One-folder builds are a practical first shipping target.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-shooter',
    title: 'Capstone: Space Shooter',
    description:
      'Build a complete vertical space shooter with scenes, spawning, collisions, score, and particle juice.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 59,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'This capstone combines architecture, resources, collisions, and polish into a small but complete game loop: menu, play, and game over.',
      },
      { type: 'h2', text: 'Feature scope' },
      {
        type: 'ol',
        items: [
          'Player ship moves horizontally and fires bullets',
          'Enemies spawn in waves from data',
          'Collisions award score and emit particles',
          'HUD shows score and lives',
          'Game over scene restarts cleanly',
        ],
      },
      {
        type: 'code',
        title: 'Core play update sketch',
        language: 'python',
        code: `import pygame


class ShooterScene(Scene):
    def on_enter(self):
        self.assets = self.manager.game.assets
        self.player = Player(160, 160)
        self.bullets = pygame.sprite.Group()
        self.enemies = pygame.sprite.Group()
        self.particles = ParticleSystem()
        self.score = 0
        self.spawn_timer = 0.0

    def handle_events(self, events):
        for event in events:
            if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
                self.bullets.add(self.player.make_bullet(self.assets))

    def update(self, dt):
        keys = pygame.key.get_pressed()
        self.player.handle_input(keys)
        self.player.update(dt)
        self.bullets.update(dt)
        self.enemies.update(dt)
        self.particles.update(dt)

        self.spawn_timer -= dt
        if self.spawn_timer <= 0:
            self.enemies.add(spawn_enemy(self.assets))
            self.spawn_timer = 0.8

        hits = pygame.sprite.groupcollide(self.bullets, self.enemies, True, True)
        for bullet, targets in hits.items():
            for enemy in targets:
                self.score += enemy.score_value
                self.particles.emit(enemy.rect.center, 14, (255, 200, 80))

        if pygame.sprite.spritecollide(self.player, self.enemies, True):
            self.manager.replace(GameOverScene(self.manager, self.score))

    def draw(self, surface):
        surface.fill((8, 10, 20))
        self.enemies.draw(surface)
        self.bullets.draw(surface)
        self.player.draw(surface)
        self.particles.draw(surface)`,
      },
      {
        type: 'tip',
        text: 'Keep the first version tiny: one enemy type, one bullet type, no powerups. Ship the loop, then layer features.',
      },
      {
        type: 'try',
        text: 'Finish the shooter with at least two enemy definitions in JSON, a score HUD, and a restart path from game over.',
      },
      {
        type: 'keypoints',
        items: [
          'A shooter is an ideal architecture practice project.',
          'Use groups for bullets and enemies.',
          'Particles and HUD polish make the loop feel complete.',
          'Scope tightly, then expand after the core loop works.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-runner',
    title: 'Capstone: Endless Runner',
    description:
      'Create a side-scrolling endless runner with scrolling ground, obstacle spawning, jump feel, and rising difficulty.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 60,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'An endless runner teaches scrolling cameras, spawn pacing, and simple physics feel. The player stays near a fixed x position while the world moves left.',
      },
      { type: 'h2', text: 'World scroll and jump' },
      {
        type: 'code',
        title: 'Runner player with gravity',
        language: 'python',
        code: `import pygame


class RunnerPlayer:
    def __init__(self, x, ground_y):
        self.image = pygame.Surface((28, 40))
        self.image.fill((120, 220, 160))
        self.rect = self.image.get_rect(midbottom=(x, ground_y))
        self.ground_y = ground_y
        self.vel_y = 0.0
        self.gravity = 1800
        self.jump_speed = -620
        self.on_ground = True

    def jump(self):
        if self.on_ground:
            self.vel_y = self.jump_speed
            self.on_ground = False

    def update(self, dt):
        self.vel_y += self.gravity * dt
        self.rect.y += int(self.vel_y * dt)
        if self.rect.bottom >= self.ground_y:
            self.rect.bottom = self.ground_y
            self.vel_y = 0
            self.on_ground = True

    def draw(self, surface):
        surface.blit(self.image, self.rect)`,
      },
      {
        type: 'code',
        title: 'Scrolling obstacles and difficulty ramp',
        language: 'python',
        code: `class Obstacle(pygame.sprite.Sprite):
    def __init__(self, x, ground_y, speed):
        super().__init__()
        self.image = pygame.Surface((24, 32))
        self.image.fill((220, 90, 70))
        self.rect = self.image.get_rect(midbottom=(x, ground_y))
        self.speed = speed

    def update(self, dt):
        self.rect.x -= int(self.speed * dt)
        if self.rect.right < 0:
            self.kill()


class RunnerScene(Scene):
    def on_enter(self):
        self.ground_y = 160
        self.player = RunnerPlayer(60, self.ground_y)
        self.obstacles = pygame.sprite.Group()
        self.speed = 180
        self.spawn_in = 1.2
        self.distance = 0.0

    def handle_events(self, events):
        for event in events:
            if event.type == pygame.KEYDOWN and event.key in (pygame.K_SPACE, pygame.K_UP):
                self.player.jump()

    def update(self, dt):
        self.speed += 8 * dt
        self.distance += self.speed * dt
        self.player.update(dt)
        self.obstacles.update(dt)
        self.spawn_in -= dt
        if self.spawn_in <= 0:
            self.obstacles.add(Obstacle(340, self.ground_y, self.speed))
            self.spawn_in = max(0.55, 1.4 - self.speed / 400)
        if pygame.sprite.spritecollide(self.player, self.obstacles, False):
            self.manager.replace(GameOverScene(self.manager, int(self.distance)))`,
      },
      {
        type: 'note',
        text: 'Feel matters more than art at first. Tune gravity, jump speed, and spawn gaps until failures feel fair.',
      },
      {
        type: 'try',
        text: 'Add a second obstacle height and a dust particle burst when the player lands from a jump.',
      },
      {
        type: 'keypoints',
        items: [
          'Keep the player x mostly stable and scroll hazards instead.',
          'Gravity and jump speed define the control feel.',
          'Increase speed gradually to raise difficulty.',
          'Fair gaps matter as much as collision code.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-puzzle',
    title: 'Capstone: Puzzle Game',
    description:
      'Implement a grid puzzle with board state, input selection, match rules, and cascade clears.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 61,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Puzzle games reward clean state models. Represent the board as data first, then draw from that data. Input should translate to board coordinates, not raw pixel hacks.',
      },
      { type: 'h2', text: 'Board model' },
      {
        type: 'code',
        title: 'Grid creation and swap',
        language: 'python',
        code: `import random


class Board:
    def __init__(self, columns, rows, kinds=5):
        self.columns = columns
        self.rows = rows
        self.kinds = kinds
        self.cells = [
            [random.randrange(kinds) for _ in range(columns)]
            for _ in range(rows)
        ]
        self.selected = None

    def in_bounds(self, col, row):
        return 0 <= col < self.columns and 0 <= row < self.rows

    def swap(self, a, b):
        (c1, r1), (c2, r2) = a, b
        self.cells[r1][c1], self.cells[r2][c2] = self.cells[r2][c2], self.cells[r1][c1]

    def neighbors(self, a, b):
        (c1, r1), (c2, r2) = a, b
        return abs(c1 - c2) + abs(r1 - r2) == 1`,
      },
      {
        type: 'code',
        title: 'Find horizontal and vertical matches',
        language: 'python',
        code: `def find_matches(board):
    matched = set()
    for row in range(board.rows):
        run_start = 0
        for col in range(1, board.columns + 1):
            same = (
                col < board.columns
                and board.cells[row][col] == board.cells[row][run_start]
                and board.cells[row][col] != -1
            )
            if same:
                continue
            if col - run_start >= 3 and board.cells[row][run_start] != -1:
                for match_col in range(run_start, col):
                    matched.add((match_col, row))
            run_start = col

    for col in range(board.columns):
        run_start = 0
        for row in range(1, board.rows + 1):
            same = (
                row < board.rows
                and board.cells[row][col] == board.cells[run_start][col]
                and board.cells[row][col] != -1
            )
            if same:
                continue
            if row - run_start >= 3 and board.cells[run_start][col] != -1:
                for match_row in range(run_start, row):
                    matched.add((col, match_row))
            run_start = row
    return matched`,
      },
      { type: 'h2', text: 'Input to grid mapping' },
      {
        type: 'code',
        title: 'Convert mouse clicks into cell selection',
        language: 'python',
        code: `import pygame


class PuzzleScene(Scene):
    def __init__(self, manager, origin=(40, 20), tile=32):
        super().__init__(manager)
        self.board = Board(8, 8)
        self.origin = origin
        self.tile = tile

    def cell_at(self, pos):
        x = (pos[0] - self.origin[0]) // self.tile
        y = (pos[1] - self.origin[1]) // self.tile
        if self.board.in_bounds(x, y):
            return int(x), int(y)
        return None

    def handle_events(self, events):
        for event in events:
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                cell = self.cell_at(event.pos)
                if cell is None:
                    continue
                if self.board.selected is None:
                    self.board.selected = cell
                elif self.board.neighbors(self.board.selected, cell):
                    self.board.swap(self.board.selected, cell)
                    matches = find_matches(self.board)
                    if not matches:
                        self.board.swap(self.board.selected, cell)
                    self.board.selected = None
                else:
                    self.board.selected = cell`,
      },
      {
        type: 'tip',
        text: 'After clears, gravity should drop remaining tiles down a column, then fill empty top cells with new kinds, then search for matches again.',
      },
      {
        type: 'try',
        text: 'Implement match detection, invalid-swap revert, and one cascade resolve pass after a successful match.',
      },
      {
        type: 'keypoints',
        items: [
          'Store puzzle state in a grid separate from drawing.',
          'Map pointer input to board coordinates.',
          'Validate moves, then resolve matches and cascades.',
          'Keep rules in pure functions that are easy to test.',
        ],
      },
    ],
  },
  {
    slug: 'save-progress',
    title: 'Saving Progress',
    description:
      'Persist settings, unlocks, and high scores with JSON save files and safe load defaults.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 62,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A finished game remembers the player. For many Pygame projects, a JSON file is enough for high scores, volume settings, and unlocked levels.',
      },
      { type: 'h2', text: 'Save schema and defaults' },
      {
        type: 'code',
        title: 'Load and save helpers',
        language: 'python',
        code: `import json
from pathlib import Path

DEFAULT_SAVE = {
    "high_score": 0,
    "unlocked_level": 1,
    "volume": 0.8,
    "fullscreen": False,
}


def save_path():
    folder = Path.home() / ".my_pygame_game"
    folder.mkdir(parents=True, exist_ok=True)
    return folder / "save.json"


def load_save():
    path = save_path()
    if not path.exists():
        return DEFAULT_SAVE.copy()
    try:
        with path.open(encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return DEFAULT_SAVE.copy()
    merged = DEFAULT_SAVE.copy()
    merged.update({key: data[key] for key in DEFAULT_SAVE if key in data})
    return merged


def write_save(data):
    path = save_path()
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2)`,
      },
      {
        type: 'code',
        title: 'Updating a high score',
        language: 'python',
        code: `def submit_score(save, score):
    if score > save["high_score"]:
        save["high_score"] = score
        write_save(save)
    return save`,
      },
      {
        type: 'warning',
        text: 'Never trust a save file blindly. Merge with defaults so missing keys after an update do not crash the game.',
      },
      {
        type: 'ul',
        items: [
          'Store saves in a user-writable directory',
          'Version your schema when fields change',
          'Keep cheatable data out of online competitive contexts',
          'Write after meaningful events, not every frame',
        ],
      },
      {
        type: 'try',
        text: 'Persist volume and high score. Restart the game and confirm both values reload correctly after a corrupt-file simulation.',
      },
      {
        type: 'keypoints',
        items: [
          'JSON saves are enough for many local Pygame games.',
          'Merge loaded data with defaults for forward compatibility.',
          'Handle missing or corrupt files without crashing.',
          'Write on events such as game over or settings changes.',
        ],
      },
    ],
  },
  {
    slug: 'polish-checklist',
    title: 'Polish Checklist',
    description:
      'Use a practical checklist for feel, feedback, clarity, accessibility basics, and release readiness.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 63,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Polish is the difference between a prototype and a game people enjoy. It is mostly many small decisions: clearer feedback, tighter timing, fewer rough edges.',
      },
      { type: 'h2', text: 'Feel and feedback' },
      {
        type: 'ul',
        items: [
          'Attacks and jumps respond on keydown, not key repeat lag',
          'Hits spawn particles, flashes, or short screen shake',
          'UI buttons have hover and pressed states',
          'Sound effects confirm important actions',
          'Dangerous objects read clearly against the background',
        ],
      },
      { type: 'h2', text: 'Clarity and flow' },
      {
        type: 'ul',
        items: [
          'Title screen explains the first action in one line',
          'Controls are visible before the first death',
          'Game over shows score and a clear restart action',
          'Pause never loses state unexpectedly',
          'Volume and quit are always reachable',
        ],
      },
      {
        type: 'code',
        title: 'Tiny screen-shake helper',
        language: 'python',
        code: `import random
import pygame


class ScreenShake:
    def __init__(self):
        self.time = 0.0
        self.magnitude = 0.0

    def add(self, magnitude=4, duration=0.15):
        self.magnitude = max(self.magnitude, magnitude)
        self.time = max(self.time, duration)

    def offset(self, dt):
        if self.time <= 0:
            return (0, 0)
        self.time -= dt
        return (
            random.randint(-int(self.magnitude), int(self.magnitude)),
            random.randint(-int(self.magnitude), int(self.magnitude)),
        )`,
      },
      {
        type: 'table',
        headers: ['Area', 'Ship check'],
        rows: [
          ['Input', 'No accidental double actions on held keys unless intended'],
          ['Audio', 'Mute works and volume persists'],
          ['Visuals', 'Player can be spotted in under one second'],
          ['Performance', 'Target FPS holds in late-game density'],
          ['Build', 'Packaged copy runs without the source folder'],
        ],
      },
      {
        type: 'try',
        text: 'Play your game for five minutes and write every moment of confusion. Fix the top three before adding any new feature.',
      },
      {
        type: 'keypoints',
        items: [
          'Polish is many small feedback and clarity improvements.',
          'Make controls and restart paths obvious.',
          'Use light juice such as shake and particles with restraint.',
          'Run a release checklist before you share a build.',
        ],
      },
    ],
  },
  {
    slug: 'pygame-ce-notes',
    title: 'Pygame vs Pygame-ce',
    description:
      'Understand the relationship between Pygame and Pygame-ce, what to install, and how to keep projects compatible.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 64,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Pygame-ce (community edition) is an actively maintained fork that many new projects use. It keeps the familiar pygame import and APIs while shipping fixes and improvements faster than the classic package in many environments.',
      },
      { type: 'h2', text: 'What stays the same' },
      {
        type: 'ul',
        items: [
          'import pygame still works',
          'Surfaces, rects, sprites, mixer, and event APIs feel familiar',
          'Most tutorial code ports with little or no change',
          'Your architecture patterns remain valid on either package',
        ],
      },
      {
        type: 'code',
        title: 'Installing and verifying the runtime',
        language: 'python',
        code: `# Preferred for many new projects:
# pip install pygame-ce
#
# Classic package name still exists in the ecosystem:
# pip install pygame
#
# Verify inside Python:
import pygame
print(pygame.__version__)
print(pygame.version.ver)`,
      },
      { type: 'h2', text: 'Practical project advice' },
      {
        type: 'p',
        text: 'Pick one package for a project and pin it in requirements. Mixing mental models is fine; mixing both packages in one environment is not.',
      },
      {
        type: 'table',
        headers: ['Topic', 'Guidance'],
        rows: [
          ['New learning project', 'pygame-ce is a strong default'],
          ['Existing codebase', 'Stay on the package it already uses unless you plan a migration'],
          ['CI and packaging', 'Install the same package you pin locally'],
          ['Docs and examples', 'Confirm examples match your installed version'],
        ],
      },
      {
        type: 'note',
        text: 'When reading older tutorials, APIs usually match. If an example fails, check version notes before rewriting your architecture.',
      },
      {
        type: 'warning',
        text: 'Do not install pygame and pygame-ce into the same environment expecting both to coexist cleanly. Use one virtual environment per choice.',
      },
      {
        type: 'try',
        text: 'Create a clean virtual environment, install pygame-ce, and run one of your earlier lessons unchanged. Record the version string in your project README.',
      },
      {
        type: 'keypoints',
        items: [
          'Pygame-ce is a community-maintained fork with familiar APIs.',
          'Most game code remains portable across the ecosystem.',
          'Pin one package per project and environment.',
          'Check versions when an older example behaves differently.',
        ],
      },
    ],
  },
  {
    slug: 'next-steps-gamedev',
    title: 'Next Steps in Game Dev',
    description:
      'Plan what to learn after Pygame: stronger design habits, tools, engines, and a portfolio project path.',
    level: 'advanced',
    section: 'Capstones & Next',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Finishing a Pygame path means you can ship small 2D games. The next step is depth: better feel, clearer architecture, collaboration habits, and eventually larger toolchains if your goals need them.',
      },
      { type: 'h2', text: 'Grow without abandoning your foundation' },
      {
        type: 'ul',
        items: [
          'Finish and publish one complete tiny game',
          'Add tests for pure rules such as match detection or damage math',
          'Learn basic game feel: tweening, invulnerability frames, coyote time',
          'Study input buffering and camera follow behavior',
          'Practice writing short design notes before coding features',
        ],
      },
      {
        type: 'table',
        headers: ['Goal', 'Next focus', 'Suggested project'],
        rows: [
          ['Stronger Python games', 'Architecture, tools, content pipelines', 'Expand your shooter into a 10-level campaign'],
          ['Team-ready skills', 'Git, issues, design docs, playtest notes', 'Build a game jam entry in 48 hours'],
          ['Engine transition', 'Godot or Unity basics after one shipped Pygame title', 'Remake your runner in an engine'],
          ['Tech art direction', 'Shaders later; first master timing and juice in 2D', 'Juice-focused arcade score attack'],
        ],
      },
      { type: 'h2', text: 'A simple portfolio bar' },
      {
        type: 'code',
        title: 'Release readiness notes',
        language: 'python',
        code: `# Portfolio project checklist (text plan)
# - One sentence pitch
# - Controls screen
# - 3 to 5 minutes of satisfying play
# - Readable README with install or download steps
# - Short clip or GIF of gameplay
# - Known issues list
# - What you would build next`,
      },
      {
        type: 'tip',
        text: 'A finished small game teaches more than an unfinished ambitious engine rewrite. Ship, gather feedback, then choose your next skill target.',
      },
      {
        type: 'try',
        text: 'Pick one capstone from this section, polish it for a week, package a build, and write a one-page postmortem on what felt good and what broke.',
      },
      {
        type: 'keypoints',
        items: [
          'Ship complete small games before chasing larger engines.',
          'Strengthen feel, architecture, and playtest habits next.',
          'Use Pygame skills as a foundation for later tool choices.',
          'Portfolio value comes from finished, explainable projects.',
        ],
      },
    ],
  },
];
